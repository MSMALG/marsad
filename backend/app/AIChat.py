"""
AIChat.py
"اسأل مرصاد" — the AI financial advisor chat feature.

POST /assistant/chat
Streams Claude's response back to the frontend token-by-token (SSE-style),
so the chat UI can render it live like ChatGPT. The user's wallet data is
injected into the system prompt so answers are grounded in their real
progress/goals, not generic advice.

Chat memory: the frontend sends the full message history on every call
(standard stateless-multi-turn pattern) -- the backend never stores
conversation state itself.
"""

import os
import json

import httpx
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from schemas import ChatRequest

load_dotenv()

router = APIRouter()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_MODEL = "claude-sonnet-5"


def _build_system_prompt(wallets: list[dict]) -> str:
    if wallets:
        wallets_lines = "\n".join(
            f"- {w.get('name', 'محفظة')}: المدخر حاليًا {w.get('saved', 0)} ريال "
            f"من هدف {w.get('goal', 0)} ريال ({w.get('progress', 0)}% مكتمل)"
            for w in wallets
        )
    else:
        wallets_lines = "لا توجد بيانات محافظ متاحة حاليًا."

    return f"""أنتِ "مرصاد" — مستشار مالي شخصي ذكي داخل تطبيق مرصاد للتمويل الشخصي بالسعودية.
شخصيتك: دافئة، مشجعة، مباشرة وعملية. تتكلمين بالعربية الفصحى المبسطة، بدون رسمية زايدة.

بيانات محافظ المستخدم الحالية:
{wallets_lines}

عند الإجابة:
- استخدمي أرقام المحافظ الفعلية أعلاه لما تكون السؤال متعلق بمحفظة معينة
- قدمي نصائح عملية وقابلة للتنفيذ فورًا (مو نصائح عامة مبهمة)
- إذا اقترحتِ خطة ادخار، اذكري أرقام محددة (مبلغ شهري، مدة، نسبة تخفيض إنفاق)
- شجعي المستخدم واحتفلي بأي تقدم حققه
- خلي ردودك مختصرة ومركزة (3-5 جمل عادة)، إلا لو طلب المستخدم تفصيل أكثر"""


async def _stream_claude_response(messages: list[dict], wallets: list[dict]):
    if not ANTHROPIC_API_KEY:
        yield f"data: {json.dumps({'error': 'ANTHROPIC_API_KEY is not configured on the server'})}\n\n"
        return

    payload = {
        "model": ANTHROPIC_MODEL,
        "max_tokens": 1024,
        "system": _build_system_prompt(wallets),
        "messages": messages,
        "stream": True,
    }
    headers = {
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            async with client.stream("POST", ANTHROPIC_API_URL, headers=headers, json=payload) as response:
                if response.status_code != 200:
                    error_text = await response.aread()
                    yield f"data: {json.dumps({'error': error_text.decode()})}\n\n"
                    return

                async for line in response.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    raw = line[len("data:"):].strip()
                    if raw == "[DONE]":
                        break
                    try:
                        event = json.loads(raw)
                    except json.JSONDecodeError:
                        continue

                    if event.get("type") == "content_block_delta":
                        delta = event.get("delta", {})
                        if delta.get("type") == "text_delta":
                            text = delta.get("text", "")
                            yield f"data: {json.dumps({'text': text}, ensure_ascii=False)}\n\n"

    except httpx.RequestError as e:
        yield f"data: {json.dumps({'error': f'Could not reach Anthropic API: {str(e)}'})}\n\n"

    yield "data: [DONE]\n\n"


@router.post("/assistant/chat")
async def assistant_chat(request: ChatRequest):
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    wallets = [w.dict() for w in request.wallets] if request.wallets else []

    return StreamingResponse(
        _stream_claude_response(messages, wallets),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )

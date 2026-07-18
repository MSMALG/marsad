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

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "..", ".env"))

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


def _build_fallback_reply(messages: list[dict], wallets: list[dict]) -> str:
    last_user_message = ""
    for message in reversed(messages):
        if message.get("role") == "user":
            last_user_message = message.get("content", "")
            break

    wallet_hint = ""
    if wallets:
        wallet_names = ", ".join(w.get("name", "محفظة") for w in wallets[:3])
        wallet_hint = f"أرى أن لديك الآن {wallet_names}."

    if not last_user_message:
        return "مرحبًا! أنا مرصاد، وسأساعدك في تخطيط الادخار والإنفاق. جرّبي سؤالًا بسيطًا مثل: كيف أوزع ميزانيتي بين محفظاتي؟"

    return (
        f"أفهم أنك تسأل عن: {last_user_message}. "
        f"{wallet_hint} "
        "في الوقت الحالي، أنا أعمل في وضع الاستجابة المحلية لأن خدمة Claude غير متاحة، لكنني أقدر أقدم لك نصيحة عملية الآن: "
        "قسّم دخلك إلى 50% احتياجات، 30% أهداف، و20% إنفاق مرن، ثم راقب أول 3 محفظات لديك بانتظام."
    )


async def _stream_claude_response(messages: list[dict], wallets: list[dict]):
    if not ANTHROPIC_API_KEY:
        yield f"data: {json.dumps({'text': _build_fallback_reply(messages, wallets)}, ensure_ascii=False)}\n\n"
        yield "data: [DONE]\n\n"
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
                    detail = error_text.decode()
                    try:
                        payload_detail = json.loads(detail)
                        if isinstance(payload_detail, dict):
                            detail = payload_detail.get("error", {}).get("message") or payload_detail.get("detail") or detail
                    except Exception:
                        pass
                    yield f"data: {json.dumps({'text': _build_fallback_reply(messages, wallets) + f' (ملاحظة: {detail})'}, ensure_ascii=False)}\n\n"
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

    except httpx.RequestError:
        yield f"data: {json.dumps({'text': _build_fallback_reply(messages, wallets)}, ensure_ascii=False)}\n\n"
    except Exception as e:
        yield f"data: {json.dumps({'text': _build_fallback_reply(messages, wallets)}, ensure_ascii=False)}\n\n"

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

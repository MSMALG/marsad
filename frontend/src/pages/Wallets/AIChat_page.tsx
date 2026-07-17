import { useState, useRef, useEffect } from "react";
import { ArrowRight, Send } from "lucide-react";
import logo from "../../assets/logo.png";
import robotLogo from "../../assets/mersad-robot.png";

type Props = {
  onBack: () => void;
};

type Message = {
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "كيف أدخر أكثر من محفظة السفر؟",
  "اعملي لي خطة ادخار لمحفظة الطوارئ",
  "كم لازم أدخر شهريًا؟",
  "حللي إنفاقي",
  "ساعديني أوصل لهدفي أسرع",
];

// Same shape as backend/app/wallets.py's dummy data — kept in sync so the
// assistant's advice matches what the user sees on the Wallets page.
const CURRENT_WALLETS = [
  { name: "محفظة الزواج", saved: 2500, goal: 10000, progress: 25 },
  { name: "محفظة السفر", saved: 2500, goal: 2000, progress: 40 },
];

export default function AIChat({ onBack }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "مرحبًا 👋 أنا مرصاد، مساعدك المالي الذكي. اسألني كيف تدخر أكثر من أي محفظة تريد ✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Cancel any in-flight stream if the user navigates away (back button) or
  // the component unmounts, instead of leaving a dangling fetch running.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const nextMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setStreaming(true);

    abortRef.current?.abort(); // cancel any previous stream just in case
    const controller = new AbortController();
    abortRef.current = controller;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/assistant/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: nextMessages.map((m) => ({ role: m.role, content: m.content })),
          wallets: CURRENT_WALLETS,
        }),
        signal: controller.signal,
      });

      if (!response.body) throw new Error("لا يوجد رد من الخادم");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const raw = line.slice(5).trim();
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.error) {
              setError(parsed.error);
              continue;
            }
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages((prev) => {
                const copy = [...prev];
                copy[copy.length - 1] = { role: "assistant", content: accumulated };
                return copy;
              });
            }
          } catch {
            // ignore malformed chunk
          }
        }
      }
      // If the connection closed but nothing came through, don't fail silently.
      if (!accumulated.trim()) {
        setError("توقف الرد قبل ما يبدأ، جربي ترسلين السؤال مرة ثانية.");
      }
    } catch (e: any) {
      if (e?.name === "AbortError") {
        // Intentional cancellation (e.g. navigated back) — not a real error.
      } else {
        setError(e?.message ?? "تعذر الاتصال بمرصاد، تأكدي إن السيرفر شغّال");
      }
    } finally {
      setStreaming(false);
    }
  }

  return (
    
    <div
      dir="rtl"
      style={{
        position: "relative",
         height: "100%",
display: "flex",
flexDirection: "column",
overflow: "hidden",
        backgroundColor: "#F7F4EC",
        fontFamily: "'SF Arabic', sans-serif",
       
      }}
    >
      {/* ── App Bar ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr 44px",
          alignItems: "center",
          height: 56,
          flexShrink: 0,
          padding: "40px 16px 10px",
          boxSizing: "border-box",
        }}
      >
        <button
  onClick={() => {
    console.log("Back clicked");
    onBack();
  }}
  style={{
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(79,107,85,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    cursor: "pointer",
    justifySelf: "start",
    position: "relative",
    zIndex: 9999,
    pointerEvents: "auto",
  }}
>
  <ArrowRight size={18} color="#4F6B55" strokeWidth={2} />
</button>

       <div style={{ textAlign: "center", minWidth: 0 }}>
  <div
    style={{
      fontSize: 17,
      fontWeight: 700,
      color: "#2F4735",
      lineHeight: 2,
      letterSpacing: "-0.2px",
    }}
  >
    مرصاد الذكي
  </div>

  <div
    style={{
      marginTop: 2,
      fontSize: 12,
      color: "#7A8B82",
      fontWeight: 500,
    }}
  >
    مساعدك المالي الشخصي
  </div>
</div>

        <div
        
        >
          <img src={logo} alt="مرصاد" style={{ width: 70, height: 70, objectFit: "contain" }} />
        </div>
      </div>

      {/* ── Messages ─────────────────────────────────────────────── */}
<div
  ref={scrollRef}
  style={{
    flex: 1,
    minHeight: 0,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    gap: 12,
    padding: "8px 16px",
    paddingBottom: "150px",
  }}
>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: 8,
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                alignItems: "flex-end",
            }}
          >{m.role === "assistant" && (
            <img
              src={robotLogo}
              alt="مرصاد"
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                flexShrink: 0,
                  alignSelf: "flex-end",
              }}
            />
)}
            <div
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "82%",
                background: m.role === "user" ? "linear-gradient(135deg,#4F6B55 0%,#3A5040 100%)" : "#fff",
                color: m.role === "user" ? "#fff" : "#1C2B22",
                borderRadius: m.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                padding: "11px 14px",
                fontSize: 13,
                lineHeight: 1.7,
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.content || (streaming && i === messages.length - 1 ? "..." : "")}
            </div>
          </div>
        ))}

        {error && (
          <div style={{ alignSelf: "flex-start", background: "#FBEAE7", borderRadius: 14, padding: "10px 14px", fontSize: 11.5, color: "#B04A3A" }}>
            {error}
          </div>
        )}

        {/* Suggested questions, shown until the first user message */}
        {messages.length === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                style={{
                  textAlign: "right",
                  background: "#fff",
                  border: "1.5px solid rgba(79,107,85,0.15)",
                  borderRadius: 14,
                  padding: "10px 14px",
                  fontSize: 12.5,
                  color: "#37463A",
                  fontFamily: "'SF Arabic', sans-serif",
                  cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Input Bar ─────────────────────────────────────────────── */}
      <div style={{ display: "flex",
  alignItems: "center",
  gap: 7,
  padding: "12px 14px",
  flexShrink: 0,
  background: "#F7F4EC",
  position: "absolute",
bottom: 72,
left: 0,
right: 0,
zIndex: 100, }}>
        <button
          onClick={() => sendMessage(input)}
          disabled={streaming || !input.trim()}
          style={{
            width: 42, height: 42, borderRadius: 14, border: "none", flexShrink: 0,
            background: input.trim() && !streaming ? "linear-gradient(135deg,#4F6B55 0%,#3A5040 100%)" : "rgba(79,107,85,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: input.trim() && !streaming ? "pointer" : "not-allowed",
          }}
        >
          <Send size={17} color="#fff" strokeWidth={2} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          placeholder="اكتب هنا..."
          style={{
            flex: 1, height: 42, borderRadius: 14, border: "1.5px solid rgba(79,107,85,0.15)",
            background: "#fff", padding: "0 14px", fontSize: 13,
            fontFamily: "'SF Arabic', sans-serif", color: "#1C2B22", outline: "none",
          }}
        />
      </div>
    </div>
  );
}
import { useState } from "react";
import { ArrowRight, Sparkles, Loader2, RefreshCcw } from "lucide-react";
import { api } from "../../api/client";

type Props = {
  onBack: () => void;
};

type GoalType = "travel" | "wedding" | "car" | "house" | "emergency_fund" | "custom";

const GOAL_OPTIONS: { value: GoalType; label: string; emoji: string }[] = [
  { value: "travel", label: "سفر", emoji: "✈️" },
  { value: "wedding", label: "زواج", emoji: "💍" },
  { value: "car", label: "سيارة", emoji: "🚗" },
  { value: "house", label: "منزل", emoji: "🏠" },
  { value: "emergency_fund", label: "صندوق طوارئ", emoji: "🆘" },
  { value: "custom", label: "هدف آخر", emoji: "🎯" },
];

const CATEGORY_EMOJI: Record<string, string> = {
  flights: "✈️", flight: "✈️", "تذاكر": "✈️",
  accommodation: "🏨", hotel: "🏨", "إقامة": "🏨", "فنادق": "🏨",
  food: "🍽️", "طعام": "🍽️",
  transportation: "🚕", transport: "🚕", "مواصلات": "🚕",
  shopping: "🛍️", "تسوق": "🛍️",
  buffer: "🛡️", emergency: "🆘", "طوارئ": "🆘",
  venue: "🏛️", catering: "🍽️", attire: "👗", photography: "📸",
  misc: "📦", other: "📦",
};

function pickEmoji(category: string) {
  const key = category.trim().toLowerCase();
  return CATEGORY_EMOJI[key] ?? "💰";
}

interface Allocation {
  category: string;
  amount: number;
  percentage: number;
  rationale: string;
}

interface WalletResult {
  id: number;
  icon_key: string;
  target_amount: number;
  monthly_target: number;
  remaining_months: number | null;
  currency: string;
  allocations: Allocation[];
  summary: string;
}

export default function WalletGenerator({ onBack }: Props) {
  const [goalType, setGoalType] = useState<GoalType>("travel");
  const [description, setDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [monthlyBudget, setMonthlyBudget] = useState("");
  const [timeframeMonths, setTimeframeMonths] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WalletResult | null>(null);

  const isValid =
    Number(targetAmount) > 0 &&
    Number(monthlyBudget) > 0 &&
    (goalType !== "custom" || description.trim().length > 0);

  async function handleGenerate() {
    if (!isValid) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<WalletResult>("/wallets/generate", {
        goal_type: goalType,
        goal_description: description.trim() || null,
        target_amount: Number(targetAmount),
        monthly_budget: Number(monthlyBudget),
        timeframe_months: timeframeMonths ? Number(timeframeMonths) : null,
        currency: "SAR",
      });
      setResult(data);
    } catch (e: any) {
      setError(
        e?.response?.data?.detail
          ? String(e.response.data.detail)
          : "تعذر توليد المحفظة، حاولي مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  }

  function handleStartOver() {
    setResult(null);
    setError(null);
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#F7F4EC",
        fontFamily: "'IBM Plex Sans Arabic', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: 64,
        paddingBottom: 90,
        paddingLeft: 16,
        paddingRight: 16,
        gap: 14,
      }}
      dir="rtl"
    >
      {/* ── App Bar ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row-reverse", height: 50, flexShrink: 0 }}>
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(79,107,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
        >
          <ArrowRight size={17} color="#4F6B55" strokeWidth={2} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1C2B22", lineHeight: 1.2 }}>محفظة ذكية جديدة</div>
          <div style={{ fontSize: 12, color: "#7A8B82", fontWeight: 400, lineHeight: 1.2 }}>
            {result ? "الخطة جاهزة" : "أخبرينا عن هدفك"}
          </div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Sparkles size={17} color="#C9B06B" strokeWidth={1.8} />
        </div>
      </div>

      {/* ── Loading state ─────────────────────────────────────────── */}
      {loading && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14 }}>
          <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 size={26} color="#C9B06B" strokeWidth={2} className="animate-spin" style={{ animation: "spin 1s linear infinite" }} />
          </div>
          <div style={{ fontSize: 13, color: "#4A5E52", fontWeight: 600, textAlign: "center" }}>
            نبحث عن أفضل توزيع لميزانيتك...
            <br />
            <span style={{ fontSize: 11, color: "#7A8B82", fontWeight: 400 }}>قد يستغرق هذا بضع ثوانٍ</span>
          </div>
        </div>
      )}

      {/* ── Form state ─────────────────────────────────────────────── */}
      {!loading && !result && (
        <>
          {/* Goal type picker */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B22", marginBottom: 10 }}>نوع الهدف</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {GOAL_OPTIONS.map((opt) => {
                const active = goalType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setGoalType(opt.value)}
                    style={{
                      borderRadius: 14,
                      padding: "10px 6px",
                      border: active ? "1.5px solid #4F6B55" : "1.5px solid rgba(79,107,85,0.12)",
                      backgroundColor: active ? "rgba(79,107,85,0.08)" : "#fff",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{opt.emoji}</span>
                    <span style={{ fontSize: 10.5, fontWeight: active ? 700 : 500, color: active ? "#4F6B55" : "#4A5E52" }}>
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B22", marginBottom: 8 }}>
              وصف الهدف {goalType === "custom" && <span style={{ color: "#C9856B" }}>*</span>}
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="مثال: رحلة إلى اليابان لشخصين لمدة أسبوع"
              rows={3}
              style={{
                width: "100%",
                borderRadius: 14,
                border: "1.5px solid rgba(79,107,85,0.12)",
                padding: "10px 12px",
                fontSize: 12.5,
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                color: "#1C2B22",
                resize: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Amounts */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4A5E52", marginBottom: 6 }}>المبلغ المستهدف (ر.س)</div>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="15000"
                style={{
                  width: "100%", borderRadius: 14, border: "1.5px solid rgba(79,107,85,0.12)",
                  padding: "10px 12px", fontSize: 13, fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  color: "#1C2B22", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4A5E52", marginBottom: 6 }}>الميزانية الشهرية المتاحة (ر.س)</div>
              <input
                type="number"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="3000"
                style={{
                  width: "100%", borderRadius: 14, border: "1.5px solid rgba(79,107,85,0.12)",
                  padding: "10px 12px", fontSize: 13, fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  color: "#1C2B22", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#4A5E52", marginBottom: 6 }}>
                المدة الزمنية بالأشهر <span style={{ fontWeight: 400, color: "#9AA79E" }}>(اختياري)</span>
              </div>
              <input
                type="number"
                value={timeframeMonths}
                onChange={(e) => setTimeframeMonths(e.target.value)}
                placeholder="6"
                style={{
                  width: "100%", borderRadius: 14, border: "1.5px solid rgba(79,107,85,0.12)",
                  padding: "10px 12px", fontSize: 13, fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                  color: "#1C2B22", outline: "none", boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {error && (
            <div style={{ background: "#FBEAE7", borderRadius: 14, padding: "10px 14px", fontSize: 11.5, color: "#B04A3A" }}>
              {error}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!isValid}
            style={{
              borderRadius: 18,
              padding: "14px",
              border: "none",
              background: isValid ? "linear-gradient(145deg,#4F6B55 0%,#3A5040 100%)" : "rgba(79,107,85,0.3)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "'IBM Plex Sans Arabic', sans-serif",
              cursor: isValid ? "pointer" : "not-allowed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: isValid ? "0 12px 24px rgba(79,107,85,0.25)" : "none",
            }}
          >
            <Sparkles size={16} color="#C9B06B" strokeWidth={2} />
            توليد المحفظة الذكية
          </button>
        </>
      )}

      {/* ── Result state ─────────────────────────────────────────────── */}
      {!loading && result && (
        <>
          <div style={{ borderRadius: 24, background: "linear-gradient(145deg,#4F6B55 0%,#3A5040 100%)", padding: "18px 20px", boxShadow: "0 12px 32px rgba(79,107,85,0.3)" }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginBottom: 4 }}>الهدف الكلي</div>
            <div style={{ fontSize: 24, color: "#fff", fontWeight: 700, marginBottom: 12 }}>
              {result.target_amount.toLocaleString()} <span style={{ fontSize: 13 }}>{result.currency}</span>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>الميزانية الشهرية</div>
                <div style={{ fontSize: 15, color: "#C9B06B", fontWeight: 700 }}>
                  {result.monthly_target.toLocaleString()} <span style={{ fontSize: 11 }}>{result.currency}</span>
                </div>
              </div>
              {result.remaining_months && (
                <>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.15)", borderRadius: 1, alignSelf: "stretch" }} />
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>المدة</div>
                    <div style={{ fontSize: 15, color: "#fff", fontWeight: 700 }}>{result.remaining_months} أشهر</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 22, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row-reverse", marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B22" }}>توزيع الميزانية الذكي</div>
                <div style={{ fontSize: 10, color: "#7A8B82", marginTop: 1 }}>تم توليده بواسطة الذكاء الاصطناعي</div>
              </div>
              <div style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Sparkles size={13} color="#C9B06B" strokeWidth={1.8} />
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {result.allocations.map((a) => (
                <div key={a.category} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <div className="flex items-center gap-2.5" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: "center" }}>{pickEmoji(a.category)}</span>
                    <span style={{ fontSize: 11.5, color: "#1C2B22", fontWeight: 600, flex: 1 }}>{a.category}</span>
                    <span style={{ fontSize: 11.5, color: "#4F6B55", fontWeight: 700 }}>
                      {a.amount.toLocaleString()} {result.currency}
                    </span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, backgroundColor: "rgba(79,107,85,0.1)" }}>
                    <div style={{ height: "100%", borderRadius: 3, width: `${a.percentage}%`, backgroundColor: "#4F6B55" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#7A8B82", paddingRight: 30 }}>{a.rationale}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px solid rgba(79,107,85,0.1)", display: "flex", justifyContent: "space-between", flexDirection: "row-reverse" }}>
              <span style={{ fontSize: 11, color: "#7A8B82", fontWeight: 500 }}>إجمالي الميزانية الشهرية</span>
              <span style={{ fontSize: 13, color: "#4F6B55", fontWeight: 700 }}>
                {result.monthly_target.toLocaleString()} {result.currency}
              </span>
            </div>
          </div>

          <div style={{ borderRadius: 20, background: "linear-gradient(135deg,#EDF4F0 0%,#E5EDEA 100%)", border: "1px solid rgba(79,107,85,0.14)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse" }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Sparkles size={14} color="#C9B06B" strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4F6B55", marginBottom: 2 }}>ملخص الخطة</div>
              <div style={{ fontSize: 10.5, color: "#4A5E52", lineHeight: 1.5 }}>{result.summary}</div>
            </div>
          </div>

          <button
            onClick={handleStartOver}
            style={{
              borderRadius: 16, padding: "12px", border: "1.5px solid rgba(79,107,85,0.2)",
              background: "#fff", color: "#4F6B55", fontSize: 13, fontWeight: 700,
              fontFamily: "'IBM Plex Sans Arabic', sans-serif", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            <RefreshCcw size={14} strokeWidth={2} />
            إنشاء محفظة أخرى
          </button>
        </>
      )}
    </div>
  );
}

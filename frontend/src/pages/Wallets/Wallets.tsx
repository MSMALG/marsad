import { ArrowRight, Plane, Sparkles, CalendarDays, Clock3, MapPin } from "lucide-react";

function CircularProgress({ percent }: { percent: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)", display: "block" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="#C9B06B" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0">
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500, lineHeight: 1 }}>نسبة</span>
        <span style={{ fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.1 }}>%{percent}</span>
      </div>
    </div>
  );
}

function BudgetRow({ emoji, name, allocated, usedPct }: { emoji: string; name: string; allocated: string; usedPct: number }) {
  return (
    <div className="flex items-center gap-2.5" dir="rtl" style={{ height: 26 }}>
      <span style={{ fontSize: 14, lineHeight: 1, width: 20, textAlign: "center" }}>{emoji}</span>
      <span style={{ fontSize: 11, color: "#1C2B22", fontWeight: 500, width: 90, flexShrink: 0 }}>{name}</span>
      <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: "rgba(79,107,85,0.1)" }}>
        <div className="h-full rounded-full" style={{ width: `${usedPct}%`, backgroundColor: usedPct === 0 ? "rgba(79,107,85,0.2)" : "#4F6B55" }} />
      </div>
      <span style={{ fontSize: 11, color: "#4F6B55", fontWeight: 600, width: 54, textAlign: "left", flexShrink: 0 }}>{allocated}</span>
    </div>
  );
}

export default function Wallets() {
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
        gap: 10,
      }}
    >
      {/* ── App Bar ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row-reverse", height: 50, flexShrink: 0 }}>
        <button style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(79,107,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}>
          <ArrowRight size={17} color="#4F6B55" strokeWidth={2} />
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#1C2B22", lineHeight: 1.2 }}>محفظة السفر</div>
          <div style={{ fontSize: 12, color: "#7A8B82", fontWeight: 400, lineHeight: 1.2 }}>تركيا • 6 أشهر</div>
        </div>
        <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Plane size={17} color="#C9B06B" strokeWidth={1.8} />
        </div>
      </div>

      {/* ── Hero Card ─────────────────────────────────────────────── */}
      <div style={{ borderRadius: 24, background: "linear-gradient(145deg,#4F6B55 0%,#3A5040 100%)", padding: "18px 20px", boxShadow: "0 12px 32px rgba(79,107,85,0.3)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", gap: 16 }}>
          <CircularProgress percent={45} />

          <div style={{ flex: 1 }} dir="rtl">
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 500, marginBottom: 2 }}>الهدف الكلي</div>
            <div style={{ fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>15,000 <span style={{ fontSize: 13 }}>ر.س</span></div>

            <div style={{ display: "flex", gap: 12 }}>
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>المدخر</div>
                <div style={{ fontSize: 15, color: "#C9B06B", fontWeight: 700 }}>6,750 <span style={{ fontSize: 11 }}>ر.س</span></div>
              </div>
              <div style={{ width: 1, background: "rgba(255,255,255,0.15)", borderRadius: 1, alignSelf: "stretch" }} />
              <div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 500 }}>المتبقي</div>
                <div style={{ fontSize: 15, color: "#fff", fontWeight: 700 }}>8,250 <span style={{ fontSize: 11 }}>ر.س</span></div>
              </div>
            </div>

            <div style={{ marginTop: 14, background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "7px 12px", display: "inline-flex", gap: 6, alignItems: "center", flexDirection: "row-reverse" }}>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>الهدف الشهري</span>
              <span style={{ fontSize: 14, color: "#C9B06B", fontWeight: 700 }}>1,125 ر.س</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Info Row ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", gap: 8, flexDirection: "row-reverse", flexShrink: 0 }}>
        {[
          { icon: <CalendarDays size={14} strokeWidth={1.8} />, label: "تاريخ البدء", value: "يوليو 2025" },
          { icon: <MapPin size={14} strokeWidth={1.8} />, label: "تاريخ السفر", value: "يناير 2026" },
          { icon: <Clock3 size={14} strokeWidth={1.8} />, label: "المتبقي", value: "6 أشهر" },
        ].map((c) => (
          <div key={c.label} style={{ flex: 1, background: "#fff", borderRadius: 18, padding: "10px 8px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <div style={{ color: "#4F6B55", display: "flex", justifyContent: "center", marginBottom: 3 }}>{c.icon}</div>
            <div style={{ fontSize: 9.5, color: "#7A8B82", fontWeight: 500, marginBottom: 2 }}>{c.label}</div>
            <div style={{ fontSize: 11, color: "#1C2B22", fontWeight: 700 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* ── Budget Distribution Card ───────────────────────────────── */}
      <div style={{ background: "#fff", borderRadius: 22, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.05)", flexShrink: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row-reverse", marginBottom: 12 }}>
          <div dir="rtl">
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B22", lineHeight: 1.2 }}>توزيع الميزانية الذكي</div>
            <div style={{ fontSize: 10, color: "#7A8B82", fontWeight: 400, marginTop: 1 }}>تم توليده بواسطة الذكاء الاصطناعي</div>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: 9, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={13} color="#C9B06B" strokeWidth={1.8} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <BudgetRow emoji="✈️" name="تذاكر الطيران" allocated="3,500 ر.س" usedPct={0} />
          <BudgetRow emoji="🏨" name="الفنادق" allocated="5,000 ر.س" usedPct={0} />
          <BudgetRow emoji="🍽️" name="الطعام" allocated="2,500 ر.س" usedPct={0} />
          <BudgetRow emoji="🚕" name="المواصلات" allocated="1,500 ر.س" usedPct={0} />
          <BudgetRow emoji="🛍️" name="التسوق" allocated="1,500 ر.س" usedPct={0} />
          <BudgetRow emoji="🆘" name="الطوارئ" allocated="1,000 ر.س" usedPct={0} />
        </div>

        <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(79,107,85,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row-reverse" }}>
          <span style={{ fontSize: 11, color: "#7A8B82", fontWeight: 500 }}>إجمالي الميزانية</span>
          <span style={{ fontSize: 13, color: "#4F6B55", fontWeight: 700 }}>15,000 ر.س</span>
        </div>
      </div>

      {/* ── AI Recommendation ─────────────────────────────────────── */}
      <div style={{ borderRadius: 20, background: "linear-gradient(135deg,#EDF4F0 0%,#E5EDEA 100%)", border: "1px solid rgba(79,107,85,0.14)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse", flexShrink: 0 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Sparkles size={14} color="#C9B06B" strokeWidth={1.8} />
        </div>
        <div dir="rtl">
          <div style={{ fontSize: 11, fontWeight: 700, color: "#4F6B55", marginBottom: 2 }}>توصية الذكاء الاصطناعي</div>
          <div style={{ fontSize: 10.5, color: "#4A5E52", lineHeight: 1.5 }}>
            أنت في المسار الصحيح. إذا ادخرت 1,125 ر.س شهرياً ستصل لهدفك قبل موعد السفر.
          </div>
        </div>
      </div>
    </div>
  );
}
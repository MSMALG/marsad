import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { PortfolioItem, Transaction } from "../../app/App";

const CustomXTick = ({ x, y, payload }: any) => {
  if (!payload.value) return null;
  return (
    <text
      x={x}
      y={y + 10}
      textAnchor="middle"
      fill="#b0a898"
      fontSize={8}
      fontFamily="Tajawal, sans-serif"
    >
      {payload.value}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "white",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          padding: "3px 8px",
          fontSize: 10,
          color: "#43674F",
          fontFamily: "Tajawal, sans-serif",
          direction: "rtl",
          pointerEvents: "none",
        }}
      >
        {payload[0].value.toLocaleString("ar-SA")} ر.س
      </div>
    );
  }
  return null;
};

function StockIllustration() {
  return (
    <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="34" cy="34" r="34" fill="#EBF5F4" />
      <rect x="9" y="40" width="6" height="15" rx="2" fill="#9FC3BE" />
      <rect x="19" y="31" width="6" height="24" rx="2" fill="#43674F" />
      <rect x="29" y="36" width="6" height="19" rx="2" fill="#9FC3BE" />
      <rect x="39" y="24" width="6" height="31" rx="2" fill="#43674F" />
      <rect x="49" y="29" width="6" height="26" rx="2" fill="#9FC3BE" />
      <polyline
        points="12,41 22,31 32,36 42,25 52,20"
        stroke="#43674F"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <circle cx="52" cy="17" r="4.5" fill="#43674F" />
      <path
        d="M50.3 18.3 L52 16.2 L53.7 18.3"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="52" y1="16.2" x2="52" y2="19.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AlinmaMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 3C9.03 3 5 7.03 5 12C5 15.18 6.68 17.97 9.2 19.6L9.2 22H18.8V19.6C21.32 17.97 23 15.18 23 12C23 7.03 18.97 3 14 3Z"
        fill="#1B4332"
      />
      <rect x="8" y="22" width="12" height="2.5" rx="1.25" fill="#1B4332" />
      <path
        d="M14 6.5C10.96 6.5 8.5 8.96 8.5 12C8.5 13.93 9.49 15.63 11 16.65V19H17V16.65C18.51 15.63 19.5 13.93 19.5 12C19.5 8.96 17.04 6.5 14 6.5Z"
        fill="#2D6A4F"
      />
      <rect x="12.5" y="12" width="3" height="7" rx="1" fill="#1B4332" />
    </svg>
  );
}

// ── تنسيق الأرقام (نفس أسلوب صديقك) ──
const fmtNum = (n: number) => Math.round(n).toLocaleString("en-US");

// ⬇️⬇️⬇️ الأرقام كلها الحين تجي جاهزة من App.tsx بدل ما تكون ثابتة هنا ⬇️⬇️⬇️
type Props = {
  onStartSimulation: () => void;
  onOpenDetails: () => void;
  initialBalance: number;
  currentValue: number;
  profit: number;
  profitPct: number;
  isProfit: boolean;
  tradesCount: number;
  rangeHigh: number;
  rangeLow: number;
  chartData: { day: number; value: number; label: string }[];
};

export default function Investment({
  onStartSimulation,
  onOpenDetails,
  initialBalance,
  currentValue,
  profit,
  profitPct,
  isProfit,
  tradesCount,
  rangeHigh,
  rangeLow,
  chartData,
}: Props) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflowY: "auto",
        fontFamily: "Tajawal, sans-serif",
      }}
      dir="rtl"
    >
      {/* ── Screen title ── */}
      <div style={{ padding: "64px 20px 8px", textAlign: "right" }}>
        <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>
          الاستثمار
        </h1>
        <p style={{ fontSize: 11, color: "#9a9a8a", margin: "2px 0 0" }}>
          تعلم الاستثمار بأموال افتراضية دون أي مخاطرة.
        </p>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          padding: "0 16px 90px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {/* Card 1 — What is simulation? */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: "14px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexDirection: "row-reverse" }}>
            <div style={{ flexShrink: 0 }}>
              <StockIllustration />
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: "0 0 5px" }}>
                ما هي المحاكاة؟
              </p>
              <p style={{ fontSize: 11, color: "#666", lineHeight: 1.7, margin: 0 }}>
                المحاكاة هي تجربة استثمار افتراضية تساعدك على تعلم شراء الأسهم
                ومتابعة الأرباح واتخاذ القرارات دون استخدام أموال حقيقية.
              </p>
            </div>
          </div>
          <button
            onClick={onStartSimulation}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "10px 0",
              background: "#43674F",
              color: "white",
              border: "none",
              borderRadius: 16,
              fontSize: 13,
              fontWeight: 700,
              fontFamily: "Tajawal, sans-serif",
              cursor: "pointer",
            }}
          >
            ابدأ محاكاة جديدة
          </button>
        </div>

        {/* Card 2 — Current simulation (بيانات حقيقية) */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: "14px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <span
              style={{
                background: "#EBF5F4",
                color: "#43674F",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 10px",
                borderRadius: 20,
              }}
            >
              نشطة
            </span>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "right" }}>
              محاكاتي الحالية
            </p>
          </div>

          <div style={{ background: "#F6F1E8", borderRadius: 18, padding: "10px 12px", marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
                direction: "rtl",
              }}
            >
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "right" }}>
                  استثمار أسهم الإنماء
                </p>
                <p style={{ fontSize: 10, color: "#9a9a8a", margin: "2px 0 0", textAlign: "right" }}>
                  محاكاة واحدة
                </p>
              </div>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  flexShrink: 0,
                }}
              >
                <AlinmaMark />
              </div>
            </div>

            {/* Stats row — القيم الحين حقيقية */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 6,
                marginBottom: 8,
                direction: "rtl",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#43674F", margin: 0 }}>{fmtNum(initialBalance)}</p>
                <p style={{ fontSize: 9, color: "#9a9a8a", margin: "1px 0 0" }}>ر.س</p>
                <p style={{ fontSize: 9, color: "#9a9a8a", margin: "2px 0 0" }}>الرصيد الابتدائي</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#43674F", margin: 0 }}>{fmtNum(currentValue)}</p>
                <p style={{ fontSize: 9, color: "#9a9a8a", margin: "1px 0 0" }}>ر.س</p>
                <p style={{ fontSize: 9, color: "#9a9a8a", margin: "2px 0 0" }}>القيمة الحالية</p>
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: isProfit ? "#16a34a" : "#dc2626", margin: 0 }}>
                  {isProfit ? "+" : "−"}{fmtNum(Math.abs(profit))}
                </p>
                <p style={{ fontSize: 9, color: isProfit ? "#16a34a" : "#dc2626", margin: "1px 0 0" }}>
                  ({isProfit ? "+" : "−"}{Math.abs(profitPct).toFixed(1)}%)
                </p>
                <p style={{ fontSize: 9, color: "#9a9a8a", margin: "2px 0 0" }}>{isProfit ? "الربح" : "الخسارة"}</p>
              </div>
            </div>

            {/* Chart — بيانات حقيقية من سجل قيمة المحفظة */}
            <div style={{ height: 80, marginLeft: -4, marginRight: -4 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 4, right: 6, bottom: 18, left: 6 }}>
                  <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.06)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} tick={<CustomXTick />} interval={0} />
                  <YAxis hide domain={["dataMin - 100", "dataMax + 100"]} />
                  <Tooltip
                    content={<CustomTooltip />}
                    cursor={{ stroke: "#3B82F6", strokeWidth: 1, strokeDasharray: "4 2" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "#3B82F6", stroke: "white", strokeWidth: 2 }}
                    strokeLinecap="round"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <button
            onClick={onOpenDetails}
            style={{
              width: "100%",
              padding: "9px 0",
              background: "transparent",
              color: "#43674F",
              border: "1.5px solid #43674F",
              borderRadius: 16,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "Tajawal, sans-serif",
              cursor: "pointer",
            }}
          >
            عرض تفاصيل المحاكاة
          </button>
        </div>

        {/* Card 3 — Performance stats (بيانات حقيقية) */}
        <div
          style={{
            background: "white",
            borderRadius: 24,
            padding: "12px 16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, color: "#1a1a1a", margin: "0 0 10px", textAlign: "right" }}>
            أداؤك في المحاكاة الحالية
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { val: String(tradesCount), unit: "", label: "عدد الصفقات", color: "#43674F", large: true },
              { val: fmtNum(rangeHigh), unit: "ر.س", label: "أعلى قيمة وصلت لها", color: "#43674F", large: false },
              { val: fmtNum(rangeLow), unit: "ر.س", label: "أقل قيمة وصلت لها", color: "#888", large: false },
            ].map((stat, i) => (
              <div key={i} style={{ background: "#F6F1E8", borderRadius: 14, padding: "8px 6px", textAlign: "center" }}>
                <p style={{ fontSize: stat.large ? 18 : 11, fontWeight: 800, color: stat.color, margin: 0 }}>
                  {stat.val}
                </p>
                {stat.unit && <p style={{ fontSize: 9, color: "#9a9a8a", margin: "1px 0 0" }}>{stat.unit}</p>}
                <p style={{ fontSize: 9, color: "#9a9a8a", margin: "3px 0 0", lineHeight: 1.3 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer disclaimer */}
        <p style={{ textAlign: "center", fontSize: 10, color: "#b0a898", margin: 0, paddingBottom: 2 }}>
          هذه المحاكاة للتعليم فقط ولا تعكس أداءً استثمارياً حقيقياً.
        </p>
      </div>
    </div>
  );
}

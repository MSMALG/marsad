import { C, F } from "./constants";
import {
  AlertTriangle,
  Shield,
  ShieldX,
} from "lucide-react";

export default function SecurityAlert({ onNavigate }: { onNavigate: () => void }) {
  const reasons = ["تحويل في وقت غير معتاد", "جهاز جديد غير معروف", "مبلغ أعلى من نمط الإنفاق"];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: 64,
        paddingBottom: 90,
        backgroundColor: C.bg,
      }}
    >
      {/* Header */}
      <div style={{ padding: "0 20px 8px", flexShrink: 0 }} dir="rtl">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <div style={{ width: 36, height: 36, borderRadius: 12, background: C.dangerBg, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${C.dangerBorder}` }}>
            <AlertTriangle size={18} color={C.danger} strokeWidth={1.8} />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0, fontFamily: F, lineHeight: 1.2 }}>تنبيه أمني</h1>
            <p style={{ fontSize: 11, color: C.muted, margin: 0, fontFamily: F, lineHeight: 1.4, marginTop: 1 }}>
              تم اكتشاف عملية مالية مشبوهة وإيقافها تلقائياً بالذكاء الاصطناعي.
            </p>
          </div>
        </div>
      </div>

      {/* Warning Card */}
      <div style={{ padding: "0 16px", flexShrink: 0 }} dir="rtl">
        <div style={{
          background: C.card, borderRadius: 24, padding: "16px 18px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldX size={18} color={C.danger} strokeWidth={1.8} />
              <span style={{ fontSize: 13, fontWeight: 600, color: C.text, fontFamily: F }}>العملية المشبوهة</span>
            </div>
            <div style={{
              background: C.dangerBg, border: `1px solid ${C.dangerBorder}`,
              borderRadius: 20, padding: "3px 10px",
              fontSize: 11, fontWeight: 600, color: C.danger, fontFamily: F,
            }}>
              تم الإيقاف
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 16px", marginBottom: 14 }}>
            {[
              { label: "المبلغ", value: "5,000 ر.س", highlight: true },
              { label: "التاريخ", value: "08 يوليو 2026" },
              { label: "الوقت", value: "03:00 ص" },
              { label: "الموقع", value: "الرياض" },
              { label: "الجهاز", value: "جهاز غير معروف" },
              { label: "النوع", value: "تحويل خارجي" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ fontSize: 10, color: C.muted, fontFamily: F, fontWeight: 500, marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: item.highlight ? C.danger : C.text, fontFamily: F, fontWeight: item.highlight ? 700 : 600 }}>{item.value}</div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: C.border, marginBottom: 12 }} />

          <div style={{ fontSize: 11, fontWeight: 600, color: C.muted, fontFamily: F, marginBottom: 8 }}>أسباب الاشتباه</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {reasons.map((r) => (
              <div key={r} style={{ display: "flex", alignItems: "center", gap: 7, flexDirection: "row-reverse" }}>
                <div style={{ width: 18, height: 18, borderRadius: 6, background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <AlertTriangle size={11} color={C.danger} strokeWidth={2} />
                </div>
                <span style={{ fontSize: 11.5, color: C.text, fontFamily: F, fontWeight: 400 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Buttons */}
      <div style={{ padding: "12px 16px 0", display: "flex", flexDirection: "column", gap: 9, flexShrink: 0 }} dir="rtl">
        <button style={{
          width: "100%", height: 50, borderRadius: 16, background: C.primary,
          border: "none", cursor: "pointer", fontSize: 14, fontWeight: 600,
          color: "#fff", fontFamily: F, boxShadow: `0 8px 24px rgba(78,107,83,0.3)`,
        }}>
          أنا من قام بهذه العملية
        </button>
        <button style={{
          width: "100%", height: 50, borderRadius: 16, background: "transparent",
          border: `1.5px solid ${C.danger}`, cursor: "pointer", fontSize: 14,
          fontWeight: 600, color: C.danger, fontFamily: F,
        }}>
          الإبلاغ عن عملية مشبوهة
        </button>
        <button
          onClick={onNavigate}
          style={{
            width: "100%", height: 44, borderRadius: 14, background: C.greenBg,
            border: `1.5px solid ${C.border}`, cursor: "pointer", fontSize: 13,
            fontWeight: 600, color: C.primary, fontFamily: F,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <Shield size={15} color={C.primary} strokeWidth={1.8} />
          <span>عرض سجل البلوكتشين</span>
        </button>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { C, F } from "./constants";

import {
  ChevronLeft,
  Shield,
  ShieldAlert,
  Lock,
} from "lucide-react";

export default function BlockchainRecords({ onBack }: { onBack: () => void }) {

  const [records, setRecords] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/security/logs")
      .then((res) => {
        setRecords(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

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
      <div style={{ padding: "0 20px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row-reverse", flexShrink: 0 }}>
        <div dir="rtl">
          <h1 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0, fontFamily: F, lineHeight: 1.2 }}>سجل البلوكتشين</h1>
          <p style={{ fontSize: 11, color: C.muted, margin: 0, fontFamily: F, marginTop: 2 }}>العمليات المشبوهة كأدلة قانونية محمية</p>
        </div>
        <button
          onClick={onBack}
          style={{ width: 36, height: 36, borderRadius: 12, background: C.card, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <ChevronLeft size={18} color={C.primary} strokeWidth={2} />
        </button>
      </div>

      {/* Hero Dark Card */}
      <div style={{ padding: "0 16px 10px", flexShrink: 0 }}>
        <div style={{
          background: `linear-gradient(140deg, ${C.primary} 0%, ${C.primaryDark} 100%)`,
          borderRadius: 22, padding: "16px 18px",
          boxShadow: `0 12px 32px rgba(78,107,83,0.32)`,
          display: "flex", alignItems: "center", gap: 14, flexDirection: "row-reverse",
        }} dir="rtl">
          <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={26} color={C.gold} strokeWidth={1.6} />
          </div>
          <div>
            <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.92)", fontFamily: F, margin: 0, lineHeight: 1.6, fontWeight: 400 }}>
              كل عملية مشبوهة يتم تسجيلها على البلوكتشين
              <br />كدليل قانوني <strong style={{ color: C.gold }}>لا يمكن حذفه أو تعديله.</strong>
            </p>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {["موثق", "مشفر", "دائم"].map((tag) => (
                <div key={tag} style={{ background: "rgba(216,193,139,0.2)", border: "1px solid rgba(216,193,139,0.4)", borderRadius: 20, padding: "2px 9px", fontSize: 10, color: C.gold, fontFamily: F, fontWeight: 600 }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Records */}
      <div style={{ padding: "0 16px", display: "flex", 
        flexDirection: "column", gap: 7, flexShrink: 0 }} dir="rtl">
          <p style={{ color: "red" }}>
  عدد السجلات: {records.length}
</p>
        {records.map((rec, i) => (
          <div key={i} style={{
            background: C.card, borderRadius: 16, padding: "10px 14px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.05)", border: `1px solid ${C.border}`,
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ width: 7, height: 7, borderRadius: 4, background: C.primary, flexShrink: 0 }} />

            <div style={{ width: 34, height: 34, borderRadius: 11, background: C.dangerBg, border: `1px solid ${C.dangerBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ShieldAlert size={16} color={C.danger} strokeWidth={1.8} />
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ fontSize: 10, color: C.muted, fontFamily: F }}>{rec.timestamp} </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: F }}>{rec.event_type === "suspicious_transaction" ? "عملية مشبوهة" : rec.event_type}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: 11, color: C.text, fontFamily: F, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 240 }}>
                  {rec.details}
                </div>
                <div style={{ fontSize: 9.5, color: C.secondary, fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                  {rec.hash}
                </div>
                <div style={{
                  background: C.greenBg, border: `1px solid rgba(78,107,83,0.2)`,
                  borderRadius: 20, padding: "1px 8px",
                  fontSize: 10, color: C.primary, fontFamily: F, fontWeight: 600, flexShrink: 0,
                }}>
                  موثق
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Card */}
      <div style={{ padding: "10px 16px 8px", flexShrink: 0 }} dir="rtl">
        <div style={{
          background: C.card, borderRadius: 18, padding: "11px 14px",
          border: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: C.greenBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Lock size={16} color={C.primary} strokeWidth={1.8} />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text, fontFamily: F, marginBottom: 2, display: "flex", alignItems: "center", gap: 5 }}>
              <span>خصوصيتك محمية بالكامل</span>
              <Lock size={12} color={C.primary} strokeWidth={2} />
            </div>
            <div style={{ fontSize: 10.5, color: C.muted, fontFamily: F, lineHeight: 1.5 }}>
              جميع السجلات مشفرة ومحفوظة على شبكة بلوكتشين خاصة ولا يمكن تعديلها أو حذفها.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
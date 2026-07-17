import { Shield, Plane } from "lucide-react";
import { C, F } from "./constants";

type PageKey =
  | "dashboard"
  | "expenses"
  | "wallets"
  | "cheaper-alternative"
  | "security"
  | "travel"
  | "more";

export default function More({
  onNavigate,
}: {
  onNavigate: (page: PageKey) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        paddingTop: 80,
        paddingBottom: 90,
        background: C.bg,
      }}
      dir="rtl"
    >
      <div style={{ padding: "0 18px" }}>
        <h2
          style={{
            fontFamily: F,
            fontSize: 22,
            fontWeight: 700,
            marginBottom: 22,
            color: C.text,
          }}
        >
          المزيد
        </h2>

        <button
          onClick={() => onNavigate("security")}
          style={{
            width: "100%",
            height: 70,
            borderRadius: 18,
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 18px",
            cursor: "pointer",
            marginBottom: 14,
          }}
        >
          <Shield size={24} color={C.primary} />
          <span
            style={{
              fontFamily: F,
              fontSize: 15,
              fontWeight: 600,
              color: C.text,
            }}
          >
            التنبيه الأمني
          </span>
        </button>

        <button
          onClick={() => onNavigate("travel")}
          style={{
            width: "100%",
            height: 70,
            borderRadius: 18,
            border: `1px solid ${C.border}`,
            background: C.card,
            display: "flex",
            alignItems: "center",
            gap: 14,
            padding: "0 18px",
            cursor: "pointer",
          }}
        >
          <Plane size={24} color={C.primary} />
          <span
            style={{
              fontFamily: F,
              fontSize: 15,
              fontWeight: 600,
              color: C.text,
            }}
          >
            السفر والعملات
          </span>
        </button>
      </div>
    </div>
  );
}
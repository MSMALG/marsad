import { useState, useEffect } from "react";
import { Plane, Heart, Car, Home as HomeIcon, ShieldAlert, Target, Plus } from "lucide-react";
import logo from "../../assets/mersad-robot.png";

type Props = {
  onOpenWallet: (id: number) => void;
  onCreateNew?: () => void;
  onOpenChat?: () => void;
};

type Wallet = {
  id: number;
  name: string;
  icon_key: string;
  subtitle: string;
  currency: string;
  target_amount: number;
  saved: number;
  progress: number;
};

const API_BASE = "http://127.0.0.1:8000";

const ICON_MAP: Record<string, JSX.Element> = {
  travel: <Plane size={20} strokeWidth={1.8} color="#fff" />,
  wedding: <Heart size={20} strokeWidth={1.8} color="#fff" />,
  car: <Car size={20} strokeWidth={1.8} color="#fff" />,
  house: <HomeIcon size={20} strokeWidth={1.8} color="#fff" />,
  emergency_fund: <ShieldAlert size={20} strokeWidth={1.8} color="#fff" />,
  custom: <Target size={20} strokeWidth={1.8} color="#fff" />,
};

// Card-style gradients, all rooted in the project palette
// (olive / sage / gold / deep green) instead of the generic blue-purple-pink look.
const CARD_GRADIENTS: Record<string, string> = {
  travel: "linear-gradient(135deg, #87867c 0%, #323a21 100%)",
  wedding: "linear-gradient(135deg, #6B4F55 0%, #C9A06B 100%)",
  car: "linear-gradient(135deg, #2E3E52 0%, #414359 100%)",
  house: "linear-gradient(135deg, #3A4A3E 0%, #5eb08f 100%)",
  emergency_fund: "linear-gradient(135deg, #4A2E2E 0%, #C98F6B 100%)",
  custom: "linear-gradient(135deg, #91c9c8 0%, #88847a 100%)",
};

function WalletCard({ wallet, onClick }: { wallet: Wallet; onClick: () => void }) {
  const gradient = CARD_GRADIENTS[wallet.icon_key] ?? CARD_GRADIENTS.custom;
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        border: "none",
        cursor: "pointer",
        textAlign: "right",
        borderRadius: 40,
        padding: "18px 20px",
        background: gradient,
        boxShadow: "0 10px 26px rgba(0,0,0,0.16)",
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 110%, rgba(255,255,255,0.12), transparent 55%)", pointerEvents: "none" }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexDirection: "row-reverse", zIndex: 1, position: "relative" }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {ICON_MAP[wallet.icon_key] ?? ICON_MAP.custom}
        </div>
        <div style={{ flex: 1, marginRight: 12, textAlign: "right" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: "'SF Arabic', sans-serif" }}>{wallet.name}</div>
          <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.7)", fontFamily: "'SF Arabic', sans-serif", marginTop: 1 }}>{wallet.subtitle}</div>
        </div>
      </div>

      <div style={{ marginTop: 18, zIndex: 1, position: "relative" }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "'SF Arabic', sans-serif" }}>
          {wallet.saved.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 400, color: "rgba(255,255,255,0.65)" }}>{wallet.currency === "SAR" ? "ر.س" : wallet.currency}</span>
        </div>
        <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.65)", fontFamily: "'SF Arabic', sans-serif", marginTop: 2 }}>
          من أصل {wallet.target_amount.toLocaleString()} {wallet.currency === "SAR" ? "ر.س" : wallet.currency}
        </div>

        <div style={{ marginTop: 10, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)" }}>
          <div style={{ height: "100%", borderRadius: 3, width: `${Math.min(wallet.progress, 100)}%`, background: "#fff" }} />
        </div>
      </div>
    </button>
  );
}

export default function WalletsOverview({ onOpenWallet, onCreateNew, onOpenChat }: Props) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetch(`${API_BASE}/wallets`)
    .then((r) => r.json())
      .then((data: Wallet[]) => {
        setWallets(data);
        setLoading(false);
      })
      .catch(() => {
        setError("تعذر تحميل المحافظ، تأكدي إن السيرفر شغّال");
        setLoading(false);
      });
  }, []);

  return (
    <div
      dir="rtl"
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#F7F4EC",
        fontFamily: "'SF Arabic', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: 36,
        paddingBottom: 90,
        paddingLeft: 16,
        paddingRight: 16,
        gap: 14,
      }}
    >
      {/* ── Logo + Title ─────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, flexShrink: 0, marginBottom: 4 }}>
        <div
        
        >
          <img src={logo} alt="مرصاد" style={{ width: 32, height: 32, objectFit: "contain" }} />
        </div>
        <div style={{ fontSize: 19, fontWeight: 700, color: "#1C2B22" }}>المحافظ الذكية</div>
      </div>

      {/* ── Ask Mersad Hero Banner ──────────────────────────────── */}
      {onOpenChat && (
        <button
          onClick={onOpenChat}
          style={{
            width: "100%", border: "none", cursor: "pointer", textAlign: "right", borderRadius: 26,
            padding: "20px 18px", background: "linear-gradient(135deg, #618669 0%, #6d8b73 100%)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 14px 32px rgba(55,70,58,0.28)", position: "relative", overflow: "hidden", flexShrink: 0,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 20%, rgba(201,176,107,0.25), transparent 55%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>✨ اسأل مرصاد</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", maxWidth: 150, lineHeight: 1.5 }}>
              كيف تدخر أكثر من محفظتك؟
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.14)", borderRadius: 12, padding: "7px 12px", marginTop: 2, width: "fit-content" }}>
              <span style={{ fontSize: 11.5, color: "#fff", fontWeight: 600 }}>ابدأ المحادثة</span>
            </div>
          </div>
          <img src={logo} alt="مرصاد" style={{ width: 160, height: 160, objectFit: "contain" }} />
        </button>
      )}

      {loading && <div style={{ textAlign: "center", padding: 30, color: "#7A8B82", fontSize: 12.5 }}>جارٍ تحميل محافظك...</div>}
      {error && <div style={{ background: "#FBEAE7", borderRadius: 14, padding: "10px 14px", fontSize: 11.5, color: "#B04A3A" }}>{error}</div>}

      {/* ── Wallet Cards ─────────────────────────────────────────── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* ── Create New Smart Wallet ─────────────────────────────────── */}
        {onCreateNew && (
          <button
            onClick={onCreateNew}
            style={{
              borderRadius: 18, padding: "13px", border: "1.5px dashed rgba(79,107,85,0.35)",
              background: "rgba(79,107,85,0.05)", color: "#4F6B55", fontSize: 13, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0,
            }}
          >
            <Plus size={16} strokeWidth={2.2} />
            إنشاء محفظة ذكية جديدة
          </button>
        )}
        </div>
        {wallets.map((w) => (
          <WalletCard key={w.id} wallet={w} onClick={() => onOpenWallet(w.id)} />
        ))}
      </div>

  );
}
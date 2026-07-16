import { useState, useEffect } from "react";
import {
  ArrowRight, ArrowLeft, Plane, Heart, Car, Home as HomeIcon, ShieldAlert, Target,
  Sparkles, CalendarDays, Clock3, MapPin, Plus,
} from "lucide-react";
import logo from "../../assets/logo.png";

type Props = {
  onCreateNew?: () => void;
  onOpenChat?: () => void;
  initialWalletId?: number;
  onBack?: () => void;
};

type Allocation = {
  category: string;
  amount: number;
  percentage: number;
  rationale: string;
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
  monthly_target: number;
  start_date: string;
  target_date: string | null;
  remaining_months: number | null;
  allocations: Allocation[];
  summary: string;
};

const API_BASE = "http://127.0.0.1:8000";

const ICON_MAP: Record<string, JSX.Element> = {
  travel: <Plane size={17} strokeWidth={1.8} />,
  wedding: <Heart size={17} strokeWidth={1.8} />,
  car: <Car size={17} strokeWidth={1.8} />,
  house: <HomeIcon size={17} strokeWidth={1.8} />,
  emergency_fund: <ShieldAlert size={17} strokeWidth={1.8} />,
  custom: <Target size={17} strokeWidth={1.8} />,
};

const CATEGORY_EMOJI: Record<string, string> = {
  "تذاكر الطيران": "✈️", "الفنادق": "🏨", "الإقامة": "🏨", "الطعام": "🍽️",
  "المواصلات": "🚕", "التسوق": "🛍️", "الطوارئ": "🆘", "احتياطي": "🛡️",
  "القاعة والتنظيم": "🏛️", "الضيافة": "🍽️", "الملابس": "👗", "التصوير": "📸", "أخرى": "📦",
};
function pickEmoji(category: string) {
  return CATEGORY_EMOJI[category] ?? "💰";
}

// A richer, blended gradient per goal type instead of flat dark green —
// each still rooted in the app's palette (olive/sage/gold/navy) so it stays
// on-brand, just less monotone.
const HERO_GRADIENTS: Record<string, string> = {
  travel: "linear-gradient(135deg, #3E5C52 0%, #4F6B55 45%, #6B7A4A 75%, #8A9B5E 100%)",
  wedding: "linear-gradient(135deg, #4A3E52 0%, #6B4F55 45%, #9B6B5E 75%, #C9A06B 100%)",
  car: "linear-gradient(135deg, #2E3E52 0%, #3E5266 45%, #4F6B7A 75%, #6B8A8F 100%)",
  house: "linear-gradient(135deg, #3A4A3E 0%, #4F6B55 45%, #7A8B5E 75%, #B0A05E 100%)",
  emergency_fund: "linear-gradient(135deg, #4A2E2E 0%, #6B3E3E 45%, #8A5E4A 75%, #C98F6B 100%)",
  custom: "linear-gradient(135deg, #37463A 0%, #4F6B55 45%, #6B7A5E 75%, #C9B06B 100%)",
};

function CircularProgress({ percent }: { percent: number }) {
  const size = 96;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(percent, 100) / 100) * circ;
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
        <span style={{ fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.1 }}>%{Math.round(percent)}</span>
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

function formatMonthYear(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("ar-SA-u-nu-latn", { year: "numeric", month: "long" });
}

export default function Wallets({ onCreateNew, onOpenChat, initialWalletId, onBack }: Props) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/wallets`)
      .then((r) => r.json())
      .then((data: Wallet[]) => {
        setWallets(data);
        if (initialWalletId != null) {
          const foundIndex = data.findIndex((w) => w.id === initialWalletId);
          setIndex(foundIndex >= 0 ? foundIndex : data.length - 1);
        } else {
          setIndex(data.length - 1); // land on the most recently created wallet
        }
        setLoading(false);
      })
      .catch(() => {
        setError("تعذر تحميل المحافظ، تأكدي إن السيرفر شغّال");
        setLoading(false);
      });
  }, []);

  const wallet = wallets[index];
  const remaining = wallet ? wallet.target_amount - wallet.saved : 0;
  const gradient = wallet ? (HERO_GRADIENTS[wallet.icon_key] ?? HERO_GRADIENTS.custom) : HERO_GRADIENTS.custom;

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
        <button onClick={onBack} style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "rgba(79,107,85,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: onBack ? "pointer" : "default" }}>
          <ArrowRight size={17} color="#4F6B55" strokeWidth={2} />
        </button>

        {/* Browse between wallets */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexDirection: "row-reverse" }}>
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index <= 0}
            style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: "transparent", cursor: index > 0 ? "pointer" : "default", opacity: index > 0 ? 1 : 0.25, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ArrowRight size={15} color="#4F6B55" strokeWidth={2} />
          </button>
          <div style={{ textAlign: "center", minWidth: 110 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: "#1C2B22", lineHeight: 1.2 }}>{wallet?.name ?? "..."}</div>
            <div style={{ fontSize: 12, color: "#7A8B82", fontWeight: 400, lineHeight: 1.2 }}>{wallet?.subtitle ?? ""}</div>
          </div>
          <button
            onClick={() => setIndex((i) => Math.min(wallets.length - 1, i + 1))}
            disabled={index >= wallets.length - 1}
            style={{ width: 26, height: 26, borderRadius: 8, border: "none", background: "transparent", cursor: index < wallets.length - 1 ? "pointer" : "default", opacity: index < wallets.length - 1 ? 1 : 0.25, display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <ArrowLeft size={15} color="#4F6B55" strokeWidth={2} />
          </button>
        </div>

        <div style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center", color: "#C9B06B" }}>
          {ICON_MAP[wallet?.icon_key ?? "custom"]}
        </div>
      </div>

      {/* ── Ask Mersad Hero Banner ──────────────────────────────── */}
      {onOpenChat && (
        <button
          onClick={onOpenChat}
          style={{
            width: "100%", border: "none", cursor: "pointer", textAlign: "right", borderRadius: 26,
            padding: "20px 18px", background: "linear-gradient(135deg, #4F6B55 0%, #37463A 100%)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            boxShadow: "0 14px 32px rgba(55,70,58,0.28)", position: "relative", overflow: "hidden", flexShrink: 0,
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 20%, rgba(201,176,107,0.25), transparent 55%)", pointerEvents: "none" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 8, zIndex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", fontFamily: "'SF Arabic', sans-serif" }}>✨ اسأل مرصاد</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", fontFamily: "'SF Arabic', sans-serif", maxWidth: 150, lineHeight: 1.5 }}>
              كيف تدخر أكثر من محفظتك؟
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.14)", borderRadius: 12, padding: "7px 12px", marginTop: 2, width: "fit-content" }}>
              <span style={{ fontSize: 11.5, color: "#fff", fontWeight: 600, fontFamily: "'SF Arabic', sans-serif" }}>ابدأ المحادثة</span>
              <ArrowRight size={13} color="#fff" style={{ transform: "rotate(180deg)" }} />
            </div>
          </div>
          <div style={{ zIndex: 1, flexShrink: 0 }}>
            <img src={logo} alt="مرصاد" style={{ width: 84, height: 84, objectFit: "contain" }} />
          </div>
        </button>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: 30, color: "#7A8B82", fontSize: 12.5 }}>جارٍ تحميل محافظك...</div>
      )}
      {error && (
        <div style={{ background: "#FBEAE7", borderRadius: 14, padding: "10px 14px", fontSize: 11.5, color: "#B04A3A" }}>{error}</div>
      )}

      {wallet && (
        <>
          {/* ── Hero Card (blended gradient, per goal type) ──────────── */}
          <div style={{ borderRadius: 24, background: gradient, padding: "18px 20px", boxShadow: "0 12px 32px rgba(55,70,58,0.3)", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", flexDirection: "row-reverse", gap: 16 }}>
              <CircularProgress percent={wallet.progress} />
              <div style={{ flex: 1 }} dir="rtl">
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 2 }}>الهدف الكلي</div>
                <div style={{ fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.2, marginBottom: 14 }}>
                  {wallet.target_amount.toLocaleString()} <span style={{ fontSize: 13 }}>{wallet.currency === "SAR" ? "ر.س" : wallet.currency}</span>
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>المدخر</div>
                    <div style={{ fontSize: 15, color: "#F0DFA8", fontWeight: 700 }}>{wallet.saved.toLocaleString()} <span style={{ fontSize: 11 }}>ر.س</span></div>
                  </div>
                  <div style={{ width: 1, background: "rgba(255,255,255,0.2)", borderRadius: 1, alignSelf: "stretch" }} />
                  <div>
                    <div style={{ fontSize: 10, color: "rgba(255,255,255,0.55)", fontWeight: 500 }}>المتبقي</div>
                    <div style={{ fontSize: 15, color: "#fff", fontWeight: 700 }}>{remaining.toLocaleString()} <span style={{ fontSize: 11 }}>ر.س</span></div>
                  </div>
                </div>
                <div style={{ marginTop: 14, background: "rgba(255,255,255,0.14)", borderRadius: 12, padding: "7px 12px", display: "inline-flex", gap: 6, alignItems: "center", flexDirection: "row-reverse" }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.65)", fontWeight: 500 }}>الهدف الشهري</span>
                  <span style={{ fontSize: 14, color: "#F0DFA8", fontWeight: 700 }}>{wallet.monthly_target.toLocaleString()} ر.س</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Info Row ─────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 8, flexDirection: "row-reverse", flexShrink: 0 }}>
            {[
              { icon: <CalendarDays size={14} strokeWidth={1.8} />, label: "تاريخ البدء", value: formatMonthYear(wallet.start_date) },
              { icon: <MapPin size={14} strokeWidth={1.8} />, label: "الموعد المستهدف", value: formatMonthYear(wallet.target_date) },
              { icon: <Clock3 size={14} strokeWidth={1.8} />, label: "المتبقي", value: wallet.remaining_months ? `${wallet.remaining_months} أشهر` : "—" },
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
              {wallet.allocations.map((a) => (
                <BudgetRow key={a.category} emoji={pickEmoji(a.category)} name={a.category} allocated={`${a.amount.toLocaleString()} ر.س`} usedPct={0} />
              ))}
            </div>

            <div style={{ marginTop: 10, paddingTop: 8, borderTop: "1px solid rgba(79,107,85,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexDirection: "row-reverse" }}>
              <span style={{ fontSize: 11, color: "#7A8B82", fontWeight: 500 }}>إجمالي الميزانية</span>
              <span style={{ fontSize: 13, color: "#4F6B55", fontWeight: 700 }}>{wallet.monthly_target.toLocaleString()} ر.س</span>
            </div>
          </div>

          {/* ── AI Recommendation ─────────────────────────────────────── */}
          {wallet.summary && (
            <div style={{ borderRadius: 20, background: "linear-gradient(135deg,#EDF4F0 0%,#E5EDEA 100%)", border: "1px solid rgba(79,107,85,0.14)", padding: "12px 14px", display: "flex", alignItems: "center", gap: 10, flexDirection: "row-reverse", flexShrink: 0 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: "#4F6B55", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Sparkles size={14} color="#C9B06B" strokeWidth={1.8} />
              </div>
              <div dir="rtl">
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4F6B55", marginBottom: 2 }}>توصية الذكاء الاصطناعي</div>
                <div style={{ fontSize: 10.5, color: "#4A5E52", lineHeight: 1.5 }}>{wallet.summary}</div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Create New Smart Wallet ─────────────────────────────────── */}
      {onCreateNew && (
        <button
          onClick={onCreateNew}
          style={{
            borderRadius: 18, padding: "13px", border: "1.5px dashed rgba(79,107,85,0.35)",
            background: "rgba(79,107,85,0.05)", color: "#4F6B55", fontSize: 13, fontWeight: 700,
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexShrink: 0,
          }}
        >
          <Plus size={16} strokeWidth={2.2} />
          إنشاء محفظة ذكية جديدة
        </button>
      )}
    </div>
  );
}
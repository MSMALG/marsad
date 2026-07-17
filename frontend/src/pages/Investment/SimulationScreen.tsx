import { useState, useEffect } from "react";
import type { PortfolioItem, Transaction } from "./App";

// ── ألوان مرصاد ──────────────────────────────────
const C = {
  bg:       "#F5F2EB",
  card:     "#FFFFFF",
  primary:  "#273534",
  teal:     "#7FA6A1",
  olive:    "#5E6A44",
  gold:     "#C9B057",
  muted:    "#8A9185",
  danger:   "#C0392B",
  success:  "#27AE60",
  border:   "#EAE5DA",
};

// ── نوع السهم ─────────────────────────────────────
type Stock = {
  id: number;
  name: string;
  symbol: string;
  price: number;
  basePrice: number;
  change: number;   // نسبة مئوية
  high: number;
  low: number;
  volume: string;
};

// ── AI توصية بناءً على نسبة التغيير ──────────────
function getAITip(stock: Stock): { text: string; color: string; icon: string } {
  const ch = stock.change;
  if (ch > 1.5)
    return { icon: "🚀", color: C.success, text: `${stock.name} في ارتفاع قوي — قد يكون وقت مناسب للشراء قبل استمرار الصعود.` };
  if (ch > 0)
    return { icon: "📈", color: C.olive,   text: `${stock.name} يرتفع بثبات — مؤشر إيجابي على المدى القصير.` };
  if (ch > -1)
    return { icon: "⚖️", color: C.gold,    text: `${stock.name} مستقر مع ميل للانخفاض — انتظر إشارة واضحة قبل الدخول.` };
  return { icon: "⚠️", color: C.danger,   text: `${stock.name} ينخفض — تأكد من تحليل السبب قبل الشراء.` };
}

// ── مساعد: تنسيق رقم ──────────────────────────────
const fmt = (n: number) => n.toLocaleString("ar-SA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ⬇️⬇️⬇️ صار الـ state يجي من App.tsx بدل ما يكون داخلي هنا ⬇️⬇️⬇️
type Props = {
  balance: number;
  setBalance: React.Dispatch<React.SetStateAction<number>>;
  portfolio: PortfolioItem[];
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioItem[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  onBack: () => void;
};

export default function SimulationScreen({
  balance,
  setBalance,
  portfolio,
  setPortfolio,
  transactions,
  setTransactions,
  onBack,
}: Props) {
  const [shares, setShares]             = useState(1);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [tab, setTab]                   = useState<"stocks" | "portfolio" | "history">("stocks");
  const [toast, setToast]               = useState<string | null>(null);

  const [stocks, setStocks] = useState<Stock[]>([
    { id:1, name:"مصرف الإنماء",  symbol:"1150", price:27.90,  basePrice:27.90,  change:1.35,  high:28.40, low:27.50, volume:"1.2M" },
    { id:2, name:"مصرف الراجحي", symbol:"1120", price:101.40, basePrice:101.40, change:-0.42, high:102.0, low:100.8, volume:"3.1M" },
    { id:3, name:"أرامكو",        symbol:"2222", price:24.80,  basePrice:24.80,  change:0.61,  high:25.10, low:24.60, volume:"8.4M" },
    { id:4, name:"STC",           symbol:"7010", price:45.70,  basePrice:45.70,  change:0.90,  high:46.20, low:45.30, volume:"0.9M" },
    { id:5, name:"سابك",          symbol:"2010", price:64.20,  basePrice:64.20,  change:-1.10, high:65.00, low:63.80, volume:"2.2M" },
  ]);

  // ── محاكاة تحديث الأسعار كل 3 ثوانٍ ─────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prev => prev.map(s => {
        const delta   = (Math.random() - 0.49) * 0.3;
        const newPrice = Math.max(s.price + delta, s.basePrice * 0.8);
        const change   = ((newPrice - s.basePrice) / s.basePrice) * 100;
        return { ...s, price: +newPrice.toFixed(2), change: +change.toFixed(2) };
      }));

      // تحديث السعر الحالي في المحفظة (يرفع Card 2 و Card 3 في الشاشة الرئيسية تلقائيًا)
      setPortfolio(prev => prev.map(item => {
        const live = stocks.find(s => s.id === item.id);
        return live ? { ...item, currentPrice: live.price } : item;
      }));

      // تحديث السهم المختار إن كان مفتوحاً
      setSelectedStock(prev => {
        if (!prev) return null;
        const live = stocks.find(s => s.id === prev.id);
        return live ? { ...prev, price: live.price, change: live.change } : prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [stocks, setPortfolio]);

  // ── toast ──────────────────────────────────────
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // ── شراء ────────────────────────────────────────
  const handleBuy = () => {
    if (!selectedStock) return;
    const total = shares * selectedStock.price;
    if (balance < total) { showToast("❌ رصيدك غير كافٍ"); return; }
    setBalance(b => b - total);
    setPortfolio(p => [...p, {
      id: selectedStock.id,
      name: selectedStock.name,
      symbol: selectedStock.symbol,
      buyPrice: selectedStock.price,
      currentPrice: selectedStock.price,
      shares,
    }]);
    setTransactions(t => [{ type:"شراء", stock:selectedStock.name, shares, price:selectedStock.price,
      time: new Date().toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"}) }, ...t]);
    showToast(`✅ تم شراء ${shares} سهم من ${selectedStock.name}`);
    setSelectedStock(null);
    setShares(1);
  };

  // ── بيع ─────────────────────────────────────────
  const handleSell = (index: number) => {
    const item = portfolio[index];
    setBalance(b => b + item.currentPrice * item.shares);
    setTransactions(t => [{ type:"بيع", stock:item.name, shares:item.shares, price:item.currentPrice,
      time: new Date().toLocaleTimeString("ar-SA",{hour:"2-digit",minute:"2-digit"}) }, ...t]);
    setPortfolio(p => p.filter((_,i) => i !== index));
    showToast(`✅ تم بيع أسهم ${item.name}`);
  };

  // ── قيمة المحفظة الكلية ─────────────────────────
  const portfolioValue = portfolio.reduce((s,i) => s + i.currentPrice * i.shares, 0);
  const totalPnL       = portfolio.reduce((s,i) => s + (i.currentPrice - i.buyPrice) * i.shares, 0);

  // ═══════════════════════════════════════════════
  // صفحة السهم المختار
  // ═══════════════════════════════════════════════
  if (selectedStock) {
    const tip    = getAITip(selectedStock);
    const isUp   = selectedStock.change >= 0;
    const total  = shares * selectedStock.price;
    const canBuy = balance >= total;

    return (
      <div style={styles.screen}>
        <div style={styles.detailHeader}>
          <button onClick={() => { setSelectedStock(null); setShares(1); }} style={styles.backBtn}>
            ← رجوع
          </button>
        </div>

        <div style={styles.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
            <div>
              <p style={{ margin:0, color:C.muted, fontSize:12, fontWeight:600 }}>{selectedStock.symbol}</p>
              <h2 style={{ margin:"4px 0 0", color:C.primary, fontSize:20 }}>{selectedStock.name}</h2>
            </div>
            <div style={{ textAlign:"left" }}>
              <h2 style={{ margin:0, fontSize:24, color:C.primary }}>{fmt(selectedStock.price)}</h2>
              <p style={{ margin:"4px 0 0", color:isUp?C.success:C.danger, fontWeight:700, fontSize:13 }}>
                {isUp?"▴":"▾"} {Math.abs(selectedStock.change).toFixed(2)}%
              </p>
            </div>
          </div>

          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            {[
              { label:"أعلى سعر", val: fmt(selectedStock.high) },
              { label:"أدنى سعر", val: fmt(selectedStock.low) },
              { label:"حجم التداول", val: selectedStock.volume },
            ].map(item => (
              <div key={item.label} style={styles.statChip}>
                <p style={{ margin:0, fontSize:10, color:C.muted }}>{item.label}</p>
                <p style={{ margin:"3px 0 0", fontWeight:700, fontSize:13, color:C.primary }}>{item.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...styles.card, background:C.primary, display:"flex", gap:12, alignItems:"flex-start" }}>
          <div style={styles.aiBot}>🤖</div>
          <div>
            <span style={styles.aiBadge}>توصية AI</span>
            <p style={{ margin:"6px 0 0", fontSize:13, color:"rgba(255,255,255,0.88)", lineHeight:1.7 }}>
              {tip.icon} {tip.text}
            </p>
          </div>
        </div>

        <div style={styles.card}>
          <p style={{ margin:"0 0 12px", fontWeight:700, color:C.primary }}>عدد الأسهم</p>
          <div style={styles.counter}>
            <button style={styles.counterBtn} onClick={() => shares > 1 && setShares(s => s-1)}>−</button>
            <span style={{ fontSize:22, fontWeight:900, color:C.primary }}>{shares}</span>
            <button style={styles.counterBtn} onClick={() => setShares(s => s+1)}>+</button>
          </div>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:16, padding:"12px 0", borderTop:`1px solid ${C.border}` }}>
            <span style={{ color:C.muted, fontSize:13 }}>إجمالي الشراء</span>
            <span style={{ fontWeight:900, fontSize:16, color:C.primary }}>{fmt(total)} ر.س</span>
          </div>
          <button
            onClick={handleBuy}
            style={{ ...styles.primaryBtn, opacity: canBuy ? 1 : 0.4, cursor: canBuy?"pointer":"not-allowed" }}
          >
            شراء
          </button>
        </div>

        {toast && <div style={styles.toast}>{toast}</div>}
      </div>
    );
  }

  // ═══════════════════════════════════════════════
  // الصفحة الرئيسية للمحاكاة
  // ═══════════════════════════════════════════════
  return (
    <div style={styles.screen}>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 0 8px" }}>
        <div>
          <h2 style={{ margin:0, color:C.primary, fontSize:20 }}>محاكاة السوق السعودي 📈</h2>
          <p style={{ margin:"4px 0 0", color:C.muted, fontSize:12 }}>تعلّم الاستثمار بدون مخاطرة</p>
        </div>
        {/* ⬇️ زر رجوع فعلي للشاشة الرئيسية */}
        <button onClick={onBack} style={styles.backBtn}>رجوع ←</button>
      </div>

      <div style={{ ...styles.card, background:C.primary }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <div>
            <p style={{ margin:0, color:"rgba(255,255,255,0.55)", fontSize:12, fontWeight:600 }}>الرصيد الافتراضي</p>
            <h1 style={{ margin:"6px 0 0", color:"#fff", fontSize:28, letterSpacing:-1 }}>{fmt(balance)} ر.س</h1>
          </div>
          <div style={{ textAlign:"left" }}>
            <p style={{ margin:0, color:"rgba(255,255,255,0.55)", fontSize:12 }}>قيمة المحفظة</p>
            <p style={{ margin:"6px 0 0", color:C.gold, fontWeight:900, fontSize:18 }}>{fmt(portfolioValue)} ر.س</p>
            <p style={{ margin:"4px 0 0", color: totalPnL>=0?C.teal:C.danger, fontSize:12, fontWeight:700 }}>
              {totalPnL>=0?"▴":"▾"} {fmt(Math.abs(totalPnL))} ر.س
            </p>
          </div>
        </div>
      </div>

      <div style={styles.tabRow}>
        {(["stocks","portfolio","history"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ ...styles.tabBtn, ...(tab===t ? styles.tabActive : {}) }}>
            {{ stocks:"الأسهم", portfolio:`محفظتي (${portfolio.length})`, history:"العمليات" }[t]}
          </button>
        ))}
      </div>

      {tab === "stocks" && (
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {stocks.map(stock => {
            const up = stock.change >= 0;
            return (
              <div key={stock.id} onClick={() => setSelectedStock(stock)} style={styles.stockRow}>
                <div style={{ ...styles.stockLogo, background: up?"#e8f5e9":"#fdecea" }}>
                  <span style={{ fontSize:16 }}>{up?"📈":"📉"}</span>
                </div>
                <div style={{ flex:1 }}>
                  <p style={{ margin:0, fontWeight:700, color:C.primary, fontSize:14 }}>{stock.name}</p>
                  <p style={{ margin:"3px 0 0", color:C.muted, fontSize:11 }}>{stock.symbol} • {stock.volume}</p>
                </div>
                <div style={{ textAlign:"left" }}>
                  <p style={{ margin:0, fontWeight:900, color:C.primary, fontSize:15 }}>{fmt(stock.price)}</p>
                  <p style={{ margin:"3px 0 0", color:up?C.success:C.danger, fontWeight:700, fontSize:12 }}>
                    {up?"+":""}{stock.change.toFixed(2)}%
                  </p>
                </div>
              </div>
            );
          })}
          <p style={{ textAlign:"center", color:C.muted, fontSize:11, marginTop:4 }}>
            🔄 الأسعار تتحدث كل 3 ثوانٍ (بيانات تجريبية)
          </p>
        </div>
      )}

      {tab === "portfolio" && (
        portfolio.length === 0
          ? <div style={styles.empty}><p style={{ fontSize:32 }}>💼</p><p style={{ color:C.muted }}>محفظتك فارغة — ابدأ بشراء سهم!</p></div>
          : <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {portfolio.map((item, i) => {
                const pnl  = (item.currentPrice - item.buyPrice) * item.shares;
                const pct  = ((item.currentPrice - item.buyPrice) / item.buyPrice) * 100;
                const up   = pnl >= 0;
                return (
                  <div key={i} style={styles.card}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <div>
                        <p style={{ margin:0, fontWeight:700, color:C.primary }}>{item.name}</p>
                        <p style={{ margin:"3px 0 0", color:C.muted, fontSize:12 }}>{item.shares} سهم • سعر الشراء: {fmt(item.buyPrice)}</p>
                      </div>
                      <div style={{ textAlign:"left" }}>
                        <p style={{ margin:0, fontWeight:900, color:C.primary }}>{fmt(item.currentPrice * item.shares)} ر.س</p>
                        <p style={{ margin:"3px 0 0", color:up?C.success:C.danger, fontWeight:700, fontSize:13 }}>
                          {up?"+":""}{fmt(pnl)} ({pct.toFixed(1)}%)
                        </p>
                      </div>
                    </div>
                    <button onClick={() => handleSell(i)} style={styles.sellBtn}>بيع الآن</button>
                  </div>
                );
              })}
            </div>
      )}

      {tab === "history" && (
        transactions.length === 0
          ? <div style={styles.empty}><p style={{ fontSize:32 }}>📋</p><p style={{ color:C.muted }}>لا توجد عمليات بعد</p></div>
          : <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {transactions.map((t, i) => (
                <div key={i} style={{ ...styles.card, display:"flex", alignItems:"center", gap:12, padding:"14px 16px" }}>
                  <div style={{ ...styles.stockLogo,
                    background: t.type==="شراء"?"#e8f5e9":"#fdecea",
                    fontSize:18 }}>
                    {t.type==="شراء"?"🟢":"🔴"}
                  </div>
                  <div style={{ flex:1 }}>
                    <p style={{ margin:0, fontWeight:700, fontSize:13, color:C.primary }}>{t.type} • {t.stock}</p>
                    <p style={{ margin:"3px 0 0", color:C.muted, fontSize:12 }}>{t.shares} سهم • {fmt(t.price)} ر.س</p>
                  </div>
                  <p style={{ margin:0, fontSize:11, color:C.muted }}>{t.time}</p>
                </div>
              ))}
            </div>
      )}

      {toast && <div style={styles.toast}>{toast}</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════
// Styles
// ═══════════════════════════════════════════════
const styles: Record<string, React.CSSProperties> = {
  screen: {
    padding: "20px 16px 28px",
    background: C.bg,
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl",
  },
  card: {
    background: C.card,
    borderRadius: 20,
    padding: 18,
    boxShadow: "0 2px 14px rgba(0,0,0,0.06)",
  },
  detailHeader: {
    display: "flex",
    alignItems: "center",
  },
  backBtn: {
    border: "none",
    background: "transparent",
    color: C.primary,
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Cairo', sans-serif",
  },
  statChip: {
    flex: 1,
    background: C.bg,
    borderRadius: 12,
    padding: "10px 12px",
    textAlign: "center",
  },
  aiBot: {
    width: 42, height: 42,
    background: "rgba(255,255,255,0.1)",
    borderRadius: 14,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },
  aiBadge: {
    background: C.gold,
    color: C.primary,
    fontSize: 10,
    fontWeight: 800,
    padding: "2px 8px",
    borderRadius: 6,
    display: "inline-block",
  },
  counter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: C.bg,
    borderRadius: 14,
    padding: "12px 20px",
  },
  counterBtn: {
    width: 36, height: 36,
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    background: C.card,
    fontSize: 20,
    cursor: "pointer",
    color: C.primary,
    fontWeight: 700,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  primaryBtn: {
    width: "100%",
    marginTop: 14,
    background: C.primary,
    color: "#fff",
    border: "none",
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    fontWeight: 900,
    fontFamily: "'Cairo', sans-serif",
  },
  sellBtn: {
    width: "100%",
    marginTop: 12,
    background: "transparent",
    color: C.danger,
    border: `1.5px solid ${C.danger}`,
    padding: "10px 0",
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Cairo', sans-serif",
  },
  tabRow: {
    display: "flex",
    background: "#EAE5DA",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "9px 4px",
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 700,
    color: C.muted,
    cursor: "pointer",
    fontFamily: "'Cairo', sans-serif",
    transition: "all .2s",
  },
  tabActive: {
    background: C.primary,
    color: "#fff",
  },
  stockRow: {
    background: C.card,
    borderRadius: 16,
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: 14,
    cursor: "pointer",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
  },
  stockLogo: {
    width: 42, height: 42,
    borderRadius: 13,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  empty: {
    textAlign: "center",
    padding: "40px 0",
    color: C.muted,
  },
  toast: {
    position: "fixed",
    bottom: 100,
    right: "50%",
    transform: "translateX(50%)",
    background: C.primary,
    color: "#fff",
    padding: "12px 24px",
    borderRadius: 16,
    fontSize: 14,
    fontWeight: 700,
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    zIndex: 999,
    fontFamily: "'Cairo', sans-serif",
    whiteSpace: "nowrap",
  },
};
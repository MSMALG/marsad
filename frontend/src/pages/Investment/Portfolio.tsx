type Holding = {
  stock: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
};

export default function Portfolio({
  onBack,
}: {
  onBack: () => void;
}) {
  const holdings: Holding[] = [
    {
      stock: "الإنماء",
      shares: 20,
      avgPrice: 50,
      currentPrice: 54.25,
    },
    {
      stock: "أرامكو",
      shares: 12,
      avgPrice: 28.5,
      currentPrice: 31.1,
    },
    {
      stock: "STC",
      shares: 8,
      avgPrice: 44,
      currentPrice: 42.8,
    },
  ];

  const total = holdings.reduce(
    (sum, item) => sum + item.currentPrice * item.shares,
    0
  );

  return (
    <div
      dir="rtl"
      style={{
        padding: 20,
        fontFamily: "Tajawal,sans-serif",
      }}
    >
      <h2>محفظتي الاستثمارية</h2>

      <div
        style={{
          marginTop: 20,
          background: "#43674F",
          color: "white",
          borderRadius: 20,
          padding: 20,
        }}
      >
        <p>القيمة الحالية للمحفظة</p>

        <h1>{total.toLocaleString()} ر.س</h1>
      </div>

      <div style={{ marginTop: 25 }}>
        {holdings.map((item) => {
          const profit =
            (item.currentPrice - item.avgPrice) * item.shares;

          return (
            <div
              key={item.stock}
              style={{
                background: "white",
                borderRadius: 18,
                padding: 18,
                marginBottom: 15,
                boxShadow: "0 2px 8px rgba(0,0,0,.06)",
              }}
            >
              <h3>{item.stock}</h3>

              <p>عدد الأسهم: {item.shares}</p>

              <p>
                متوسط الشراء: {item.avgPrice.toFixed(2)} ر.س
              </p>

              <p>
                السعر الحالي: {item.currentPrice.toFixed(2)} ر.س
              </p>

              <p
                style={{
                  color:
                    profit >= 0 ? "#16a34a" : "#dc2626",
                  fontWeight: "bold",
                }}
              >
                {profit >= 0 ? "+" : ""}
                {profit.toFixed(2)} ر.س
              </p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onBack}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 14,
          border: "1px solid #43674F",
          background: "white",
          color: "#43674F",
          cursor: "pointer",
        }}
      >
        رجوع
      </button>
    </div>
  );
}
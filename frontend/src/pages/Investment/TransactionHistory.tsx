type Transaction = {
  id: number;
  type: "شراء" | "بيع";
  stock: string;
  quantity: number;
  price: number;
  date: string;
};

export default function TransactionHistory({
  onBack,
}: {
  onBack: () => void;
}) {
  const transactions: Transaction[] = [
    {
      id: 1,
      type: "شراء",
      stock: "الإنماء",
      quantity: 20,
      price: 50,
      date: "30 يوليو 2026",
    },
    {
      id: 2,
      type: "شراء",
      stock: "أرامكو",
      quantity: 10,
      price: 28.5,
      date: "28 يوليو 2026",
    },
    {
      id: 3,
      type: "بيع",
      stock: "STC",
      quantity: 5,
      price: 44,
      date: "25 يوليو 2026",
    },
  ];

  return (
    <div
      dir="rtl"
      style={{
        padding: 20,
        fontFamily: "Tajawal,sans-serif",
      }}
    >
      <h2>سجل العمليات</h2>

      <div style={{ marginTop: 20 }}>
        {transactions.map((item) => (
          <div
            key={item.id}
            style={{
              background: "white",
              borderRadius: 18,
              padding: 18,
              marginBottom: 15,
              boxShadow: "0 2px 8px rgba(0,0,0,.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>{item.stock}</strong>

              <span
                style={{
                  color:
                    item.type === "شراء"
                      ? "#16a34a"
                      : "#dc2626",
                  fontWeight: "bold",
                }}
              >
                {item.type}
              </span>
            </div>

            <p>الكمية: {item.quantity} سهم</p>

            <p>السعر: {item.price} ر.س</p>

            <p
              style={{
                color: "#777",
                fontSize: 13,
              }}
            >
              {item.date}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={onBack}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 14,
          background: "white",
          color: "#43674F",
          border: "1px solid #43674F",
          cursor: "pointer",
        }}
      >
        رجوع
      </button>
    </div>
  );
}
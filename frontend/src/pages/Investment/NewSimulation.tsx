import { useState } from "react";

export default function NewSimulation({
  onStart,
  onBack,
}: {
  onStart: (simulation: {
    capital: number;
    stock: string;
  }) => void;
  onBack: () => void;
}) {
  const [capital, setCapital] = useState(10000);
  const [stock, setStock] = useState("الإنماء");

  const stocks = [
    "الإنماء",
    "الراجحي",
    "أرامكو",
    "سابك",
    "STC",
    "معادن",
    "بنك الرياض",
  ];

  return (
    <div
      dir="rtl"
      style={{
        padding: 20,
        fontFamily: "Tajawal,sans-serif",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>
        إنشاء محاكاة استثمار جديدة
      </h2>

      <div style={{ marginBottom: 20 }}>
        <label>رأس المال</label>

        <input
          type="number"
          value={capital}
          onChange={(e) => setCapital(Number(e.target.value))}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div style={{ marginBottom: 30 }}>
        <label>اختر السهم</label>

        <select
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        >
          {stocks.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <button
        onClick={() =>
          onStart({
            capital,
            stock,
          })
        }
        style={{
          width: "100%",
          padding: 14,
          border: "none",
          borderRadius: 14,
          background: "#43674F",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        بدء المحاكاة
      </button>

      <button
        onClick={onBack}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 14,
          borderRadius: 14,
          background: "white",
          border: "1px solid #43674F",
          color: "#43674F",
          cursor: "pointer",
        }}
      >
        رجوع
      </button>
    </div>
  );
}

import { useState } from "react";

export default function SellStock({
  onBack,
}: {
  onBack: () => void;
}) {
  const [stock, setStock] = useState("الإنماء");
  const [quantity, setQuantity] = useState(1);

  const owned = 20;
  const price = 54.25;

  return (
    <div
      dir="rtl"
      style={{
        padding: 20,
        fontFamily: "Tajawal,sans-serif",
      }}
    >
      <h2>بيع الأسهم</h2>

      <div
        style={{
          marginTop: 20,
          background: "#F6F1E8",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <h3>{stock}</h3>

        <p>الأسهم المملوكة: {owned}</p>

        <p>سعر السهم الحالي: {price} ر.س</p>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>عدد الأسهم المراد بيعها</label>

        <input
          type="number"
          value={quantity}
          min={1}
          max={owned}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            borderRadius: 12,
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          background: "#fff",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 2px 10px rgba(0,0,0,.06)",
        }}
      >
        <p>المبلغ المستلم</p>

        <h1
          style={{
            color: "#16a34a",
          }}
        >
          {(quantity * price).toFixed(2)} ر.س
        </h1>
      </div>

      <button
        style={{
          width: "100%",
          marginTop: 25,
          padding: 15,
          background: "#c0392b",
          color: "white",
          border: "none",
          borderRadius: 14,
          cursor: "pointer",
        }}
      >
        تأكيد البيع
      </button>

      <button
        onClick={onBack}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 15,
          background: "white",
          color: "#43674F",
          border: "1px solid #43674F",
          borderRadius: 14,
          cursor: "pointer",
        }}
      >
        رجوع
      </button>
    </div>
  );
}
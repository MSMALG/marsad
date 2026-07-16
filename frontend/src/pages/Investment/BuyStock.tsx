import { useState } from "react";

export default function BuyStock({
  onBack,
}: {
  onBack: () => void;
}) {
  const [stock, setStock] = useState("الإنماء");
  const [quantity, setQuantity] = useState(1);

  const price = 50;

  return (
    <div
      dir="rtl"
      style={{
        padding: 20,
        fontFamily: "Tajawal,sans-serif",
      }}
    >
      <h2>شراء سهم</h2>

      <div style={{ marginTop: 20 }}>
        <label>الشركة</label>

        <select
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            borderRadius: 12,
          }}
        >
          <option>الإنماء</option>
          <option>أرامكو</option>
          <option>الراجحي</option>
          <option>سابك</option>
          <option>STC</option>
        </select>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>عدد الأسهم</label>

        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          style={{
            width: "100%",
            padding: 12,
            marginTop: 8,
            borderRadius: 12,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 18,
          borderRadius: 16,
          background: "#F6F1E8",
        }}
      >
        <h3>الإجمالي</h3>

        <h1>{price * quantity} ر.س</h1>
      </div>

      <button
        style={{
          width: "100%",
          marginTop: 25,
          padding: 15,
          background: "#43674F",
          color: "white",
          border: "none",
          borderRadius: 14,
          cursor: "pointer",
        }}
      >
        تأكيد الشراء
      </button>

      <button
        onClick={onBack}
        style={{
          width: "100%",
          marginTop: 10,
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
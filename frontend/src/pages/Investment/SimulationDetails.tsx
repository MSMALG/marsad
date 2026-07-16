import { useState } from "react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Trade = {
  type: "شراء" | "بيع";
  stock: string;
  quantity: number;
  price: number;
};

export default function SimulationDetails({
  capital,
  stock,
  onBuy,
  onSell,
  onPortfolio,
  onHistory,
}: {
  capital: number;
  stock: string;
  onBuy: () => void;
  onSell: () => void;
  onPortfolio: () => void;
  onHistory: () => void;
}) {
  const [currentValue] = useState(capital + 850);

  const profit = currentValue - capital;

  const chartData = [
    { day: "1", value: capital },
    { day: "5", value: capital + 120 },
    { day: "10", value: capital + 240 },
    { day: "15", value: capital + 410 },
    { day: "20", value: capital + 600 },
    { day: "25", value: capital + 720 },
    { day: "30", value: capital + 850 },
  ];

  const trades: Trade[] = [
    {
      type: "شراء",
      stock,
      quantity: 20,
      price: 50,
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
      <h2>المحاكاة الحالية</h2>

      <div
        style={{
          background: "#fff",
          padding: 18,
          borderRadius: 18,
          marginTop: 20,
        }}
      >
        <h3>{stock}</h3>

        <p>الرصيد الابتدائي: {capital} ر.س</p>

        <p>القيمة الحالية: {currentValue} ر.س</p>

        <p
          style={{
            color: profit >= 0 ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          الربح {profit} ر.س
        </p>        <div
          style={{
            width: "100%",
            height: 220,
            marginTop: 20,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="day" />
              <YAxis hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#43674F"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 20,
        }}
      >
        <button
          onClick={onBuy}
          style={{
            background: "#43674F",
            color: "white",
            border: "none",
            borderRadius: 14,
            padding: 14,
            cursor: "pointer",
          }}
        >
          شراء سهم
        </button>

        <button
          onClick={onSell}
          style={{
            background: "#c0392b",
            color: "white",
            border: "none",
            borderRadius: 14,
            padding: 14,
            cursor: "pointer",
          }}
        >
          بيع سهم
        </button>

        <button
          onClick={onPortfolio}
          style={{
            background: "#f4f4f4",
            borderRadius: 14,
            border: "none",
            padding: 14,
            cursor: "pointer",
          }}
        >
          المحفظة
        </button>

        <button
          onClick={onHistory}
          style={{
            background: "#f4f4f4",
            borderRadius: 14,
            border: "none",
            padding: 14,
            cursor: "pointer",
          }}
        >
          سجل العمليات
        </button>
      </div>      <div
        style={{
          marginTop: 25,
          background: "#fff",
          borderRadius: 18,
          padding: 18,
        }}
      >
        <h3
          style={{
            marginBottom: 15,
          }}
        >
          آخر العمليات
        </h3>

        {trades.map((trade, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0",
              borderBottom:
                index !== trades.length - 1
                  ? "1px solid #eee"
                  : "none",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: "bold",
                }}
              >
                {trade.type}
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#777",
                }}
              >
                {trade.stock}
              </div>
            </div>

            <div
              style={{
                textAlign: "left",
              }}
            >
              <div>{trade.quantity} سهم</div>

              <div
                style={{
                  fontSize: 12,
                  color: "#43674F",
                }}
              >
                {trade.price} ر.س
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
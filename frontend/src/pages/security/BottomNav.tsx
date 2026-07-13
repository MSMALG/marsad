import {
  Home,
  TrendingUp,
  LayoutGrid,
  Receipt,
  Plus,
} from "lucide-react";

import { C, F } from "./constants";

interface BottomNavProps {
  activeTab?: string;
}

export default function BottomNav({
  activeTab = "more",
}: BottomNavProps) {
  const tabs = [
    {
      id: "home",
      label: "الرئيسية",
      Icon: Home,
    },
    {
      id: "expenses",
      label: "المصروفات",
      Icon: Receipt,
    },
    {
      id: "invest",
      label: "الاستثمار",
      Icon: TrendingUp,
    },
    {
      id: "more",
      label: "المزيد",
      Icon: LayoutGrid,
    },
  ];

  const items: React.ReactNode[] = [];

  tabs.forEach((tab, i) => {
    if (i === 2) {
      items.push(
        <div
          key="fab"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 16,
              background: C.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow:
                "0 6px 20px rgba(78,107,83,0.35)",
            }}
          >
            <Plus
              size={22}
              color="#fff"
              strokeWidth={2}
            />
          </div>
        </div>
      );
    }

    const isActive = tab.id === activeTab;

    items.push(
      <button
        key={tab.id}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "4px 10px",
          flex: 1,
        }}
      >
        <tab.Icon
          size={20}
          color={
            isActive ? C.primary : C.muted
          }
          strokeWidth={isActive ? 2 : 1.6}
        />

        <span
          style={{
            fontSize: 10,
            color: isActive
              ? C.primary
              : C.muted,
            fontWeight: isActive
              ? 600
              : 400,
            fontFamily: F,
          }}
        >
          {tab.label}
        </span>

        {isActive && (
          <div
            style={{
              width: 4,
              height: 4,
              borderRadius: 2,
              background: C.primary,
              marginTop: -2,
            }}
          />
        )}
      </button>
    );
  });

  return (
    <div
      style={{
        height: 72,
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "0 4px",
        flexShrink: 0,
      }}
    >
      {items}
    </div>
  );
}
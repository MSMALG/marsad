
import {
  Home,
  PieChart,
  Plane,
  Grid3x3,
  PlusCircle,
  ChartColumn,
} from "lucide-react";
type PageKey =
  | "dashboard"
  | "expenses"
  | "investment"
  | "wallets"
  | "wallet-detail"
  | "wallet-generator"
  | "ai-chat"
  | "cheaper-alternative"
  | "security"
  | "travel";
export default function BottomNav({
  active,
  onNavigate,
}: {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
}) {
  const items: { key: PageKey; label: string; icon: any }[] = [
    { key: "dashboard", label: "الرئيسية", icon: Home },
    { key: "expenses", label: "المصروفات", icon: PieChart },
    { key: "travel", label: "السفر", icon: Plane },
    { key: "investment", label: "الاستثمار", icon: ChartColumn },
    { key: "security", label: "المزيد", icon: Grid3x3 },
  ];
  

  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around z-30"
      style={{ height: 66, paddingLeft: 20, paddingRight: 20 }}
    >
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="flex flex-col items-center"
            style={{ gap: 2 }}
          >
            <Icon
              size={20}
              color={isActive ? "#2F3E34" : "#999999"}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              style={{
                fontFamily: "'readex-pro-vf', sans-serif",
                color: isActive ? "#2F3E34" : "#999999",
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
      <button
        onClick={() => onNavigate("wallets")}
        className="flex flex-col items-center"
        style={{ marginTop: -16 }}
      >
        <div
          className="rounded-full bg-[#2F3E34] flex items-center justify-center shadow-lg"
          style={{ width: 46, height: 46 }}
        >
          <PlusCircle size={22} color="#FFFFFF" fill="#2F3E34" />
        </div>
      </button>
    </div>
  );
}
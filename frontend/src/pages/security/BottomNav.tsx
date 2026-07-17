import { Home, PieChart, Plane, Grid3x3, PlusCircle } from "lucide-react";

type PageKey =
  | "dashboard"
  | "expenses"
  | "wallets"
  | "cheaper-alternative"
  | "security"
  | "travel"
  | "more";

export default function BottomNav({
  active,
  onNavigate,
}: {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
}) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around z-30"
      style={{ height: 66, paddingLeft: 20, paddingRight: 20 }}
    >
      {/* الرئيسية */}
      <button
        onClick={() => onNavigate("dashboard")}
        className="flex flex-col items-center"
        style={{ gap: 2 }}
      >
        <Home
          size={20}
          color={active === "dashboard" ? "#2F3E34" : "#999999"}
        />
        <span
          style={{
            fontSize: 10,
            color: active === "dashboard" ? "#2F3E34" : "#999999",
          }}
        >
          الرئيسية
        </span>
      </button>

      {/* المصروفات */}
      <button
        onClick={() => onNavigate("expenses")}
        className="flex flex-col items-center"
        style={{ gap: 2 }}
      >
        <PieChart
          size={20}
          color={active === "expenses" ? "#2F3E34" : "#999999"}
        />
        <span
          style={{
            fontSize: 10,
            color: active === "expenses" ? "#2F3E34" : "#999999",
          }}
        >
          المصروفات
        </span>
      </button>

      {/* زر المحافظ بالنص */}
      <button
        onClick={() => onNavigate("wallets")}
        className="flex flex-col items-center"
        style={{ marginTop: -18 }}
      >
        <div
          className="rounded-full bg-[#2F3E34] flex items-center justify-center shadow-lg"
          style={{ width: 48, height: 48 }}
        >
          <PlusCircle size={22} color="#FFFFFF" fill="#2F3E34" />
        </div>
      </button>

      {/* الاستثمار */}
      <button
        onClick={() => onNavigate("travel")}
        className="flex flex-col items-center"
        style={{ gap: 2 }}
      >
        <Plane
          size={20}
          color={active === "travel" ? "#2F3E34" : "#999999"}
        />
        <span
          style={{
            fontSize: 10,
            color: active === "travel" ? "#2F3E34" : "#999999",
          }}
        >
          الاستثمار
        </span>
      </button>

      {/* المزيد */}
      <button
        onClick={() => onNavigate("more")}
        className="flex flex-col items-center"
        style={{ gap: 2 }}
      >
        <Grid3x3
          size={20}
          color={active === "more" ? "#2F3E34" : "#999999"}
        />
        <span
          style={{
            fontSize: 10,
            color: active === "more" ? "#2F3E34" : "#999999",
          }}
        >
          المزيد
        </span>
      </button>
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "../../api/client";

import {
  Bell,
  User,
  Eye,
  Target,
  Flame,
  AlertTriangle,
  Shield,
  Plane,
  Heart,
  Car,
  Home as HomeIcon,
  ShieldAlert,
} from "lucide-react";

type DashboardData = {
  user: string;
  balance: number;
  income: number;
  expenses: number;
  savings: number;
  risk: string;
  recommendation: string;
};

type WalletData = {
  id: number;
  name: string;
  icon_key: string;
  saved: number;
  target_amount: number;
  progress: number;
};

type AlertData = {
  النوع: string;
  العنوان: string;
  التفاصيل: string;
};

type Props = {
  onNavigate: (page: string) => void;
  onOpenWallet?: (id: number) => void;
};

type BudgetData = {
  الرصيد_الحالي: number;
  التوفير_هذا_الشهر: number;
  المتوقع_نهاية_الشهر: number;
  هدف_الميزانية: number;
  عدد_الأيام_الملتزم_بها: number;
};

const WALLET_COLORS = ["#43674F", "#7FA6A1", "#C9B57A", "#4F7C5B"];

// Thresholds and limits for dashboard wallets
const NEAR_COMPLETION_THRESHOLD = 80; // percent
const MAX_DASHBOARD_WALLETS = 3;

// Map wallet icon keys to lucide-react icons
const WALLET_ICON_MAP: Record<string, any> = {
  savings: Heart,
  travel: Plane,
  home: HomeIcon,
  car: Car,
  custom: ShieldAlert,
};

// Simple gradient map for wallet backgrounds
const WALLET_GRADIENT_MAP: Record<string, string> = {
  savings: 'linear-gradient(135deg,#43674F 0%,#7FA6A1 100%)',
  travel: 'linear-gradient(135deg,#7FA6A1 0%,#C9B57A 100%)',
  home: 'linear-gradient(135deg,#C9B57A 0%,#4F7C5B 100%)',
  car: 'linear-gradient(135deg,#4F7C5B 0%,#43674F 100%)',
  custom: WALLET_COLORS[2],
};

export default function Dashboard({ onNavigate, onOpenWallet }: Props) {

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [wallets, setWallets] = useState<WalletData[] | null>(null);
  const [alerts, setAlerts] = useState<AlertData[] | null>(null);
  const [budget, setBudget] = useState<BudgetData | null>(null);

  useEffect(() => {
    api.get("/dashboard").then((res) => setDashboard(res.data)).catch(console.error);
    api.get("/wallets").then((res) => setWallets(res.data)).catch(console.error);
    api.get("/alerts").then((res) => setAlerts(res.data)).catch(console.error);
    api.get("/budget").then((res) => setBudget(res.data)).catch(console.error);
  }, []);

  if (!dashboard) {
    return (
      <div className="absolute inset-0 flex items-center justify-center" style={{ paddingTop: 64 }}>
        Loading...
      </div>
    );
  }

  const budgetAlert = alerts?.find((a) => a.النوع === "تنبيه الميزانية");
  const securityAlert = alerts?.find((a) => a.النوع === "تنبيه أمني");

  return (
    <div className="absolute inset-0 overflow-y-auto" dir="rtl" style={{ paddingTop: 64, paddingBottom: 90 }}>

      {/* Header */}
      <div className="px-5" style={{ paddingBottom: 8 }}>
        <div className="flex items-start justify-between" style={{ marginBottom: 7 }}>
          <div className="flex-1">
            <h1 className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 17, lineHeight: '22px', marginBottom: 2 }}>
              أهلاً {dashboard.user}
            </h1>
            <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 11, lineHeight: '15px' }}>
              يرصد فلوسك ويصون مستقبلك
            </p>
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <button className="flex items-center justify-center" style={{ width: 34, height: 34 }}>
              <Bell size={18} color="#333333" />
            </button>
            <button
              className="rounded-full bg-[#7FA6A1] flex items-center justify-center"
              style={{ width: 34, height: 34 }}
            >
              <User size={16} color="#FFFFFF" />
            </button>
          </div>
        </div>
        <div
          onClick={() => onNavigate("rewards")}
          className="inline-block bg-[#FBF8F0] rounded-full cursor-pointer"
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 3,
            paddingBottom: 3,
          }}
        >
          <span
            style={{
              fontFamily: "readex-pro-vf, sans-serif",
              color: "#C9B57A",
              fontSize: 10,
              fontWeight: 600,
            }}
          >
            1,240 نقطة
          </span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-5" style={{ marginBottom: 7 }}>
        <div className="bg-[#43674F] relative" style={{ borderRadius: 18, padding: 14 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
            <p style={{ fontFamily: 'Cairo, sans-serif', color: '#FFFFFF', fontSize: 11 }}>الرصيد الحالي</p>
            <button><Eye size={16} color="#FFFFFF" /></button>
          </div>
          <div
            className="font-bold"
            style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 28, lineHeight: '36px', marginBottom: 10 }}
          >
            {dashboard.balance.toLocaleString()} ر.س
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <div className="flex-1 bg-[#F2EDE2]" style={{ borderRadius: 10, padding: 8 }}>
              <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 9, lineHeight: '13px', marginBottom: 2 }}>وفرتِ هذا الشهر</p>
              <p className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#2F3E34', fontSize: 13, lineHeight: '17px' }}>
                {dashboard.savings.toLocaleString()} ر.س
              </p>
            </div>
            <div className="flex-1 bg-[#F2EDE2]" style={{ borderRadius: 10, padding: 8 }}>
              <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 9, lineHeight: '13px', marginBottom: 2 }}>المتوقع نهاية الشهر</p>
              <p className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 13, lineHeight: '17px' }}>18,100 ر.س</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Goal Card */}
      <div className="px-5" style={{ marginBottom: 7 }}>
        <div className="bg-white" style={{ borderRadius: 18, padding: '9px 12px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <h3 className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 12 }}>هدف الميزانية</h3>
            <Target size={14} color="#2F3E34" />
          </div>
          <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px', marginBottom: 5 }}>
            ملتزمة بميزانيتك {budget?.هدف_الميزانية ?? 0}%
          </p>
          <div className="w-full bg-gray-200 rounded-full" style={{ height: 5, marginBottom: 5 }}>
            <div className="bg-[#2F3E34] rounded-full" style={{ height: 5, width: `${budget?.هدف_الميزانية ?? 0}%` }} />
          </div>
          <div className="flex items-center" style={{ gap: 5 }}>
            <Flame size={11} color="#C9B57A" />
            <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
              {budget?.عدد_الأيام_الملتزم_بها ?? 0} يوم متتالي
            </p>
          </div>
        </div>
      </div>

      {/* Budget Warning Card */}
      {budgetAlert && (
        <div className="px-5" style={{ marginBottom: 7 }}>
          <div
            className="bg-[#FFF9E6] border-r-[3px] border-[#C9B57A]"
            style={{ borderRadius: 18, padding: '8px 12px' }}
          >
            <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
              <AlertTriangle size={14} color="#C9B57A" className="shrink-0" />
              <div className="flex-1">
                <h4
                  className="font-bold"
                  style={{ fontFamily: 'Tajawal, sans-serif', color: '#333333', fontSize: 11, lineHeight: '15px', marginBottom: 1 }}
                >
                  {budgetAlert.العنوان}
                </h4>
                <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                  {budgetAlert.التفاصيل}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("cheaper-alternative")}
              className="bg-[#C9B57A] text-white font-medium"
              style={{ fontFamily: 'readex-pro-vf, sans-serif', fontSize: 10, borderRadius: 8, padding: '4px 12px' }}
            >
              شوفي البديل
            </button>
          </div>
        </div>
      )}

      {/* Security Alert Card */}
      {securityAlert && (
        <div className="px-5" style={{ marginBottom: 7 }}>
          <div
            className="bg-[#FFF0F0] border-r-[3px] border-[#8B2020]"
            style={{ borderRadius: 18, padding: '8px 12px' }}
          >
            <div className="flex items-center" style={{ gap: 8, marginBottom: 6 }}>
              <Shield size={14} color="#8B2020" className="shrink-0" />
              <div className="flex-1">
                <h4
                  className="font-bold"
                  style={{ fontFamily: 'Tajawal, sans-serif', color: '#8B2020', fontSize: 11, lineHeight: '15px', marginBottom: 1 }}
                >
                  {securityAlert.العنوان}
                </h4>
                <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                  {securityAlert.التفاصيل}
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate("security")}
              className="bg-[#2F3E34] text-white font-medium"
              style={{ fontFamily: 'readex-pro-vf, sans-serif', fontSize: 10, borderRadius: 8, padding: '4px 12px' }}
            >
              عرض التفاصيل
            </button>
          </div>
        </div>
      )}

      {/* Smart Wallets */}
      <div className="px-5">
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#333333', fontSize: 15 }}>
            محافظتي
          </h3>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
          </svg>
        </div>

        {!wallets && (
          <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 11, marginBottom: 8 }}>
            جارِ تحميل المحافظ...
          </p>
        )}

        {wallets && wallets
          .filter((w) => w.progress >= NEAR_COMPLETION_THRESHOLD)
          .sort((a, b) => b.progress - a.progress)
          .slice(0, MAX_DASHBOARD_WALLETS)
          .map((w) => {
          const Icon = WALLET_ICON_MAP[w.icon_key] ?? WALLET_ICON_MAP.custom;
          const gradient = WALLET_GRADIENT_MAP[w.icon_key] ?? WALLET_GRADIENT_MAP.custom;
            function onOpenWallet(id: number): void {
              throw new Error("Function not implemented.");
            }

          return (
            <div key={w.id} style={{ background: gradient, borderRadius: 18, padding: 12, marginBottom: 7, boxShadow: "0 6px 16px rgba(0,0,0,0.12)" }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 5 }}>
                <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 13, lineHeight: '18px' }}>
                  {w.name}
                </h4>
                <Icon size={15} color="#FFFFFF" />
              </div>
              <p style={{ fontFamily: 'Cairo, sans-serif', color: '#FFFFFF', fontSize: 11, lineHeight: '16px', marginBottom: 5 }}>
                {w.saved.toLocaleString()} / {w.target_amount.toLocaleString()} ر.س
              </p>
              <div className="w-full rounded-full" style={{ height: 5, marginBottom: 7, backgroundColor: "rgba(0,0,0,0.15)" }}>
                <div className="bg-[#C9B57A] rounded-full" style={{ height: 5, width: `${w.progress}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onOpenWallet?.(w.id)}
                  className="border border-white text-white"
                  style={{ fontFamily: 'Cairo, sans-serif', fontSize: 10, borderRadius: 8, padding: '3px 10px', cursor: onOpenWallet ? "pointer" : "default" }}
                >
                  عرض التفاصيل
                </button>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 12 }}>
                  {w.progress}%
                </span>
              </div>
            </div>
          );
        })}

        {wallets && wallets.filter((w) => w.progress >= NEAR_COMPLETION_THRESHOLD).length === 0 && (
          <p style={{ fontFamily: 'Cairo, sans-serif', color: '#999999', fontSize: 11, textAlign: 'center', padding: '12px 0' }}>
            لا توجد محافظ قريبة من هدفها حاليًا
          </p>
        )}
      </div>
    </div>
  );
}
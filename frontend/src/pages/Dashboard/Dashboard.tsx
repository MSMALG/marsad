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
  Diamond,
  Plane,
  Plus,
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
  saved: number;
  goal: number;
  progress: number;
};

type AlertData = {
  النوع: string;
  العنوان: string;
  التفاصيل: string;
};

const WALLET_COLORS = ["#43674F", "#7FA6A1", "#C9B57A", "#4F7C5B"];
const WALLET_ICONS = [Diamond, Plane, Diamond, Plane];

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [wallets, setWallets] = useState<WalletData[] | null>(null);
  const [alerts, setAlerts] = useState<AlertData[] | null>(null);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setDashboard(res.data))
      .catch(console.error);

    api
      .get("/wallets")
      .then((res) => setWallets(res.data))
      .catch(console.error);

    api
      .get("/alerts")
      .then((res) => setAlerts(res.data))
      .catch(console.error);
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
    <div
      className="absolute inset-0 overflow-y-auto"
      dir="rtl"
      style={{ paddingTop: 64, paddingBottom: 90 }}
    >
      {/* Header */}
      <div className="px-5" style={{ paddingBottom: 8 }}>
        <div className="flex items-start justify-between" style={{ marginBottom: 7 }}>
          <div className="flex-1">
            <h1
              className="font-bold"
              style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 17, lineHeight: '22px', marginBottom: 2 }}
            >
             أهلاً {dashboard.user}
            </h1>
            <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 11, lineHeight: '15px' }}>
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
          className="inline-block bg-[#FBF8F0] rounded-full"
          style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 3, paddingBottom: 3 }}
        >
          <span style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#C9B57A', fontSize: 10, fontWeight: 600 }}>
            1,240 نقطة
          </span>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-5" style={{ marginBottom: 7 }}>
        <div className="bg-[#43674F] relative" style={{ borderRadius: 18, padding: 14 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 5 }}>
            <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#FFFFFF', fontSize: 11 }}>الرصيد الحالي</p>
            <button><Eye size={16} color="#FFFFFF" /></button>
          </div>
          <div
            className="font-bold"
            style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#FFFFFF', fontSize: 28, lineHeight: '36px', marginBottom: 10 }}
          >
            {dashboard.balance.toLocaleString()} ر.س
          </div>
          <div className="flex" style={{ gap: 8 }}>
            <div className="flex-1 bg-[#F2EDE2]" style={{ borderRadius: 10, padding: 8 }}>
              <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 9, lineHeight: '13px', marginBottom: 2 }}>
                وفرتِ هذا الشهر
              </p>
              <p className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#2F3E34', fontSize: 13, lineHeight: '17px' }}>
                {dashboard.savings.toLocaleString()} ر.س
              </p>
            </div>
            <div className="flex-1 bg-[#F2EDE2]" style={{ borderRadius: 10, padding: 8 }}>
              <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 9, lineHeight: '13px', marginBottom: 2 }}>
                المتوقع نهاية الشهر
              </p>
              <p className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 13, lineHeight: '17px' }}>
                18,100 ر.س
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Goal Card */}
      <div className="px-5" style={{ marginBottom: 7 }}>
        <div className="bg-white" style={{ borderRadius: 18, padding: '9px 12px' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
            <h3 className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 12 }}>
              هدف الميزانية
            </h3>
            <Target size={14} color="#2F3E34" />
          </div>
          <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px', marginBottom: 5 }}>
            ملتزمة بميزانيتك 78%
          </p>
          <div className="w-full bg-gray-200 rounded-full" style={{ height: 5, marginBottom: 5 }}>
            <div className="bg-[#2F3E34] rounded-full" style={{ height: 5, width: '78%' }} />
          </div>
          <div className="flex items-center" style={{ gap: 5 }}>
            <Flame size={11} color="#C9B57A" />
            <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
              12 يوم متتالي
            </p>
          </div>
        </div>
      </div>

      {/* Budget Warning Card — now from /alerts */}
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
                  style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 11, lineHeight: '15px', marginBottom: 1 }}
                >
                  {budgetAlert.العنوان}
                </h4>
                <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                  {budgetAlert.التفاصيل}
                </p>
              </div>
            </div>
            <button
              className="bg-[#C9B57A] text-white font-medium"
              style={{
                fontFamily: 'readex-pro-vf, sans-serif',
                fontSize: 10,
                borderRadius: 8,
                padding: '4px 12px'
              }}
            >
              شوفي البديل
            </button>
          </div>
        </div>
      )}

      {/* Security Alert Card — now from /alerts */}
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
                  style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#8B2020', fontSize: 11, lineHeight: '15px', marginBottom: 1 }}
                >
                  {securityAlert.العنوان}
                </h4>
                <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                  {securityAlert.التفاصيل}
                </p>
              </div>
            </div>
            <button
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
          <h3 className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#333333', fontSize: 15 }}>
            محافظتي
          </h3>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2F3E34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
            <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
            <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
          </svg>
        </div>

        {!wallets && (
          <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#666666', fontSize: 11, marginBottom: 8 }}>
            جارِ تحميل المحافظ...
          </p>
        )}

        {wallets && wallets.map((w, i) => {
          const Icon = WALLET_ICONS[i % WALLET_ICONS.length];
          const color = WALLET_COLORS[i % WALLET_COLORS.length];
          return (
            <div key={w.id} style={{ backgroundColor: color, borderRadius: 18, padding: 12, marginBottom: 7 }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 5 }}>
                <h4 className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#FFFFFF', fontSize: 13, lineHeight: '18px' }}>
                  {w.name}
                </h4>
                <Icon size={15} color="#FFFFFF" />
              </div>
              <p style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#FFFFFF', fontSize: 11, lineHeight: '16px', marginBottom: 5 }}>
                {w.saved.toLocaleString()} / {w.goal.toLocaleString()} ر.س
              </p>
              <div className="w-full rounded-full" style={{ height: 5, marginBottom: 7, backgroundColor: "rgba(0,0,0,0.15)" }}>
                <div className="bg-[#C9B57A] rounded-full" style={{ height: 5, width: `${w.progress}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="border border-white text-white"
                  style={{ fontFamily: 'readex-pro-vf, sans-serif', fontSize: 10, borderRadius: 8, padding: '3px 10px' }}
                >
                  عرض التفاصيل
                </button>
                <span className="font-bold" style={{ fontFamily: 'tarif-arabic, sans-serif', color: '#FFFFFF', fontSize: 12 }}>
                  {w.progress}%
                </span>
              </div>
            </div>
          );
        })}

        <button
          className="w-full bg-[#F2EDE2] border-2 border-dashed border-[#C9B57A] flex items-center justify-center"
          style={{ height: 38, borderRadius: 18, gap: 6 }}
        >
          <Plus size={14} color="#2F3E34" />
          <span style={{ fontFamily: 'readex-pro-vf, sans-serif', color: '#2F3E34', fontSize: 11, fontWeight: 500 }}>
            إضافة محفظة جديدة
          </span>
        </button>
      </div>
    </div>
  );
}
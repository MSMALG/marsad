import { useEffect, useState } from "react";
import { api } from "../api/client";

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
  Home,
  TrendingUp,
  Grid3x3,
  PieChart,
  PlusCircle,
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

export default function App() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setDashboard(res.data))
      .catch(console.error);
  }, []);

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="size-full flex items-center justify-center bg-gray-100" dir="rtl">
      {/* iPhone 14 Frame */}
      <div className="relative w-[390px] h-[844px] bg-[#F2EDE2] overflow-hidden">

        {/* ── Scrollable content, padded so nothing hides under nav ── */}
        <div className="h-full overflow-y-auto" style={{ paddingBottom: 66 }}>

          {/* ── Header ~88px ── */}
          <div className="px-5" style={{ paddingTop: 14, paddingBottom: 8 }}>
            <div className="flex items-start justify-between" style={{ marginBottom: 7 }}>
              <div className="flex-1">
                <h1
                  className="font-bold"
                  style={{ fontFamily: 'Tajawal, sans-serif', color: '#333333', fontSize: 17, lineHeight: '22px', marginBottom: 2 }}
                >
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
              className="inline-block bg-[#FBF8F0] rounded-full"
              style={{ paddingLeft: 12, paddingRight: 12, paddingTop: 3, paddingBottom: 3 }}
            >
              <span style={{ fontFamily: 'Cairo, sans-serif', color: '#C9B57A', fontSize: 10, fontWeight: 600 }}>
                1,240 نقطة
              </span>
            </div>
          </div>

          {/* ── Balance Card ~134px ── */}
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
                  <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 9, lineHeight: '13px', marginBottom: 2 }}>
                    وفرتِ هذا الشهر
                  </p>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#2F3E34', fontSize: 13, lineHeight: '17px' }}>
                    {dashboard.savings.toLocaleString()} ر.س
                  </p>
                </div>
                <div className="flex-1 bg-[#F2EDE2]" style={{ borderRadius: 10, padding: 8 }}>
                  <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 9, lineHeight: '13px', marginBottom: 2 }}>
                    المتوقع نهاية الشهر
                  </p>
                  <p className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#333333', fontSize: 13, lineHeight: '17px' }}>
                    18,100 ر.س
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Budget Goal Card ~74px ── */}
          <div className="px-5" style={{ marginBottom: 7 }}>
            <div className="bg-white" style={{ borderRadius: 18, padding: '9px 12px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                <h3 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#333333', fontSize: 12 }}>
                  هدف الميزانية
                </h3>
                <Target size={14} color="#2F3E34" />
              </div>
              <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px', marginBottom: 5 }}>
                ملتزمة بميزانيتك 78%
              </p>
              <div className="w-full bg-gray-200 rounded-full" style={{ height: 5, marginBottom: 5 }}>
                <div className="bg-[#2F3E34] rounded-full" style={{ height: 5, width: '78%' }} />
              </div>
              <div className="flex items-center" style={{ gap: 5 }}>
                <Flame size={11} color="#C9B57A" />
                <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                  12 يوم متتالي
                </p>
              </div>
            </div>
          </div>

          {/* ── Budget Warning Card ~64px ── */}
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
                    تنبيه الميزانية
                  </h4>
                  <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                   {dashboard.recommendation}
                  </p>
                </div>
              </div>
              <button
                className="bg-[#C9B57A] text-white font-medium"
                style={{ fontFamily: 'Cairo, sans-serif', fontSize: 10, borderRadius: 8, padding: '4px 12px' }}
              >
                شوفي البديل
              </button>
            </div>
          </div>

          {/* ── Security Alert Card ~64px ── */}
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
                    تنبيه أمني
                  </h4>
                  <p style={{ fontFamily: 'Cairo, sans-serif', color: '#666666', fontSize: 10, lineHeight: '14px' }}>
                    تم اكتشاف عملية مشبوهة
                  </p>
                </div>
              </div>
              <button
                className="bg-[#2F3E34] text-white font-medium"
                style={{ fontFamily: 'Cairo, sans-serif', fontSize: 10, borderRadius: 8, padding: '4px 12px' }}
              >
                عرض التفاصيل
              </button>
            </div>
          </div>

          {/* ── Smart Wallets ── */}
          <div className="px-5">
            {/* Section header */}
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

            {/* Wallet 1 – Wedding ~100px */}
            <div className="bg-[#43674F]" style={{ borderRadius: 18, padding: 12, marginBottom: 7 }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 5 }}>
                <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 13, lineHeight: '18px' }}>
                  محفظة الزواج
                </h4>
                <Diamond size={15} color="#FFFFFF" />
              </div>
              <p style={{ fontFamily: 'Cairo, sans-serif', color: '#FFFFFF', fontSize: 11, lineHeight: '16px', marginBottom: 5 }}>
                2,500 / 10,000 ر.س
              </p>
              <div className="w-full bg-[#2D4D38] rounded-full" style={{ height: 5, marginBottom: 7 }}>
                <div className="bg-[#C9B57A] rounded-full" style={{ height: 5, width: '25%' }} />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="border border-white text-white"
                  style={{ fontFamily: 'Cairo, sans-serif', fontSize: 10, borderRadius: 8, padding: '3px 10px' }}
                >
                  عرض التفاصيل
                </button>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 12 }}>
                  25%
                </span>
              </div>
            </div>

            {/* Wallet 2 – Travel ~100px */}
            <div className="bg-[#7FA6A1]" style={{ borderRadius: 18, padding: 12, marginBottom: 7 }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 5 }}>
                <h4 className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 13, lineHeight: '18px' }}>
                  محفظة السفر
                </h4>
                <Plane size={15} color="#FFFFFF" />
              </div>
              <p style={{ fontFamily: 'Cairo, sans-serif', color: '#FFFFFF', fontSize: 11, lineHeight: '16px', marginBottom: 5 }}>
                4,000 / 10,000 ر.س
              </p>
              <div className="w-full bg-[#6A8E89] rounded-full" style={{ height: 5, marginBottom: 7 }}>
                <div className="bg-white rounded-full" style={{ height: 5, width: '40%' }} />
              </div>
              <div className="flex items-center justify-between">
                <button
                  className="border border-white text-white"
                  style={{ fontFamily: 'Cairo, sans-serif', fontSize: 10, borderRadius: 8, padding: '3px 10px' }}
                >
                  عرض التفاصيل
                </button>
                <span className="font-bold" style={{ fontFamily: 'Tajawal, sans-serif', color: '#FFFFFF', fontSize: 12 }}>
                  40%
                </span>
              </div>
            </div>

            {/* Add Wallet Button ~38px */}
            <button
              className="w-full bg-[#F2EDE2] border-2 border-dashed border-[#C9B57A] flex items-center justify-center"
              style={{ height: 38, borderRadius: 18, gap: 6 }}
            >
              <Plus size={14} color="#2F3E34" />
              <span style={{ fontFamily: 'Cairo, sans-serif', color: '#2F3E34', fontSize: 11, fontWeight: 500 }}>
                إضافة محفظة جديدة
              </span>
            </button>
          </div>

        </div>

        {/* ── Bottom Navigation 66px ── */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around"
          style={{ height: 66, paddingLeft: 20, paddingRight: 20 }}
        >
          <button className="flex flex-col items-center" style={{ gap: 2 }}>
            <Home size={20} color="#2F3E34" strokeWidth={2.5} />
            <span style={{ fontFamily: 'Cairo, sans-serif', color: '#2F3E34', fontSize: 10, fontWeight: 600 }}>الرئيسية</span>
          </button>
          <button className="flex flex-col items-center" style={{ gap: 2 }}>
            <PieChart size={20} color="#999999" strokeWidth={2} />
            <span style={{ fontFamily: 'Cairo, sans-serif', color: '#999999', fontSize: 10 }}>المصروفات</span>
          </button>
          <button className="flex flex-col items-center" style={{ marginTop: -16 }}>
            <div
              className="rounded-full bg-[#2F3E34] flex items-center justify-center shadow-lg"
              style={{ width: 46, height: 46 }}
            >
              <PlusCircle size={22} color="#FFFFFF" fill="#2F3E34" />
            </div>
          </button>
          <button className="flex flex-col items-center" style={{ gap: 2 }}>
            <TrendingUp size={20} color="#999999" strokeWidth={2} />
            <span style={{ fontFamily: 'Cairo, sans-serif', color: '#999999', fontSize: 10 }}>الاستثمار</span>
          </button>
          <button className="flex flex-col items-center" style={{ gap: 2 }}>
            <Grid3x3 size={20} color="#999999" strokeWidth={2} />
            <span style={{ fontFamily: 'Cairo, sans-serif', color: '#999999', fontSize: 10 }}>المزيد</span>
          </button>
        </div>

      </div>
    </div>
  );
}

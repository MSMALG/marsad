import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer } from "recharts";
import { Bell } from "lucide-react";

const T = {
  green:     "#365C4B",
  greenMid:  "#7FA6A1",
  greenPale: "#D4E8E4",
  gold:      "#C9A857",
  bg:        "#FAF8F3",
  card:      "#FFFFFF",
  txt:       "#2B2B2B",
  muted:     "#777777",
  segBg:     "#EDEAE1",
};

const tajawal = "tarif-arabic, sans-serif";
const cairo   = "readex-pro-vf, sans-serif";

const DONUT = [
  { label: "السكن",     pct: 32, color: "#365C4B" },
  { label: "المواصلات", pct: 25, color: "#7FA6A1" },
  { label: "المطاعم",   pct: 20, color: "#C9A857" },
  { label: "التسوق",    pct: 13, color: "#AECFCC" },
  { label: "الترفيه",   pct: 10, color: "#D6CBAA" },
];

type BarDatum  = { n: string; v: number };
type StatItem  = { l: string; v: string; v2?: string };
type ScreenDef = {
  tab:    string;
  total:  string;
  badge:  string;
  up:     boolean;
  bars:   BarDatum[];
  peak:   string;
  maxBar: number;
  stats:  StatItem[];
};

const SCREENS: ScreenDef[] = [
  {
    tab: "12 شهر", total: "22,860.75", badge: "↑6.2%", up: true,
    bars: [
      { n: "يناير",  v: 1320 }, { n: "فبراير",  v: 1480 },
      { n: "مارس",   v: 1260 }, { n: "أبريل",   v: 1720 },
      { n: "مايو",   v: 1840 }, { n: "يونيو",   v: 1610 },
      { n: "يوليو",  v: 2090 }, { n: "أغسطس",   v: 1760 },
      { n: "سبتمبر", v: 1910 }, { n: "أكتوبر",  v: 1680 },
      { n: "نوفمبر", v: 1530 }, { n: "ديسمبر",  v: 1660 },
    ],
    peak: "يوليو", maxBar: 26,
    stats: [
      { l: "إجمالي المصروفات", v: "22,860 ر.س" },
      { l: "المتوسط الشهري",   v: "1,905 ر.س"  },
      { l: "أعلى شهر",         v: "يوليو",       v2: "2,090 ر.س" },
      { l: "نسبة الادخار",     v: "22%"          },
    ],
  },
  {
    tab: "6 شهور", total: "9,450.75", badge: "↑4.1%", up: true,
    bars: [
      { n: "يناير",  v: 1320 }, { n: "فبراير", v: 1450 },
      { n: "مارس",   v: 1210 }, { n: "أبريل",  v: 1880 },
      { n: "مايو",   v: 1630 }, { n: "يونيو",  v: 1960 },
    ],
    peak: "يونيو", maxBar: 34,
    stats: [
      { l: "إجمالي المصروفات", v: "9,450 ر.س"  },
      { l: "المتوسط الشهري",   v: "1,575 ر.س"  },
      { l: "أعلى شهر",         v: "يونيو",       v2: "1,960 ر.س" },
      { l: "نسبة الادخار",     v: "24%"          },
    ],
  },
  {
    tab: "30 يوم", total: "5,420.80", badge: "↓2.3%", up: false,
    bars: [
      120, 95, 180, 140, 110, 200, 165, 145, 190, 130,
      175, 155, 210, 135, 160, 145, 195, 460, 170, 125,
      185, 140, 160, 175, 130, 195, 150, 165, 140, 120,
    ].map((v, i) => ({ n: `${i + 1}`, v })),
    peak: "18", maxBar: 7,
    stats: [
      { l: "إجمالي المصروفات", v: "5,420 ر.س"  },
      { l: "المتوسط اليومي",   v: "180.69 ر.س" },
      { l: "أعلى يوم",         v: "اليوم 18",    v2: "460 ر.س" },
      { l: "نسبة الادخار",     v: "31%"          },
    ],
  },
];

const TABS = ["12 شهر", "6 شهور", "30 يوم"];

function DonutChart({ size = 148 }: { size?: number }) {
  const cx = size / 2, cy = size / 2;
  const R  = size * 0.415;
  const ri = size * 0.268;
  const pt = (deg: number, r: number): [number, number] => [
    cx + r * Math.cos((deg * Math.PI) / 180),
    cy + r * Math.sin((deg * Math.PI) / 180),
  ];
  let angle = -90;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {DONUT.map((d, i) => {
        const sweep = (d.pct / 100) * 360;
        const a1 = angle;
        const a2 = angle + sweep - 0.8;
        angle   += sweep;
        const [x1, y1] = pt(a1, R);
        const [x2, y2] = pt(a2, R);
        const [x3, y3] = pt(a2, ri);
        const [x4, y4] = pt(a1, ri);
        const lg = sweep > 180 ? 1 : 0;
        return (
          <path
            key={i}
            fill={d.color}
            d={`M${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R},0,${lg},1,${x2.toFixed(2)},${y2.toFixed(2)} L${x3.toFixed(2)},${y3.toFixed(2)} A${ri},${ri},0,${lg},0,${x4.toFixed(2)},${y4.toFixed(2)}Z`}
          />
        );
      })}
    </svg>
  );
}

export default function Expenses() {
  const [activeIdx, setActiveIdx] = useState(0);
  const scr = SCREENS[activeIdx];
  const isMany = scr.bars.length > 12;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: T.bg,
        direction: "rtl",
        fontFamily: cairo,
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "64px 20px 6px",
      }}>
        <Bell size={19} color={T.muted} strokeWidth={1.5} />
        <h1 style={{
          fontFamily: tajawal, fontWeight: 700, fontSize: 20,
          color: T.txt, margin: 0,
        }}>المصروفات</h1>
        <div style={{ width: 19 }} />
      </div>

      {/* Segmented Control */}
      <div style={{ padding: "4px 20px 14px" }}>
        <div style={{
          backgroundColor: T.segBg,
          borderRadius: 14,
          padding: 4,
          display: "flex",
          gap: 4,
          direction: "rtl",
        }}>
          {TABS.map((tab, i) => {
            const on = i === activeIdx;
            return (
              <button
                key={tab}
                onClick={() => setActiveIdx(i)}
                style={{
                  flex: 1,
                  padding: "9px 4px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: cairo,
                  fontSize: 12,
                  fontWeight: on ? 700 : 500,
                  transition: "background-color 0.25s, color 0.25s, box-shadow 0.25s",
                  backgroundColor: on ? T.green : "transparent",
                  color: on ? "#FFFFFF" : T.muted,
                  boxShadow: on ? "0 2px 8px rgba(54,92,75,0.3)" : "none",
                }}
              >{tab}</button>
            );
          })}
        </div>
      </div>

      {/* Analytics Card */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{
          backgroundColor: T.card,
          borderRadius: 24,
          padding: "18px 18px 16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}>
          <p style={{ fontSize: 11, color: T.muted, margin: "0 0 8px 0" }}>إجمالي المصروفات</p>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, direction: "rtl" }}>
                <span style={{
                  fontFamily: tajawal, fontWeight: 800, fontSize: 27,
                  color: T.txt, lineHeight: 1.1,
                }}>{scr.total}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.muted }}>ر.س</span>
              </div>
              <p style={{ fontSize: 11, color: T.muted, margin: "4px 0 0 0" }}>
                مقارنة بالفترة السابقة
              </p>
            </div>
            <span style={{
              backgroundColor: scr.up ? "#E4F2EC" : "#FEF2F2",
              color: scr.up ? T.green : "#DC2626",
              fontSize: 11, fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 20,
              flexShrink: 0,
              marginTop: 2,
              fontFamily: cairo,
            }}>{scr.badge}</span>
          </div>

          <div style={{ height: 114, marginTop: 16 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={scr.bars}
                margin={{ top: 2, right: 4, left: 4, bottom: 0 }}
                barCategoryGap={isMany ? "12%" : "22%"}
              >
                <YAxis hide domain={[0, "auto"]} />
                <XAxis
                  dataKey="n"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontFamily: cairo, fontSize: isMany ? 7 : 8, fill: T.muted }}
                  tickFormatter={(value: string, index: number) => {
                    if (isMany) {
                      return [0, 4, 9, 14, 19, 24, 29].includes(index) ? value : "";
                    }
                    return value.length > 3 ? value.substring(0, 3) : value;
                  }}
                />
                <Bar dataKey="v" radius={[4, 4, 0, 0]} maxBarSize={scr.maxBar}>
                  {scr.bars.map((b, i) => (
                    <Cell key={i} fill={b.n === scr.peak ? T.green : T.greenPale} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ padding: "0 20px 12px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {scr.stats.map((s, i) => (
            <div key={i} style={{
              backgroundColor: T.card,
              borderRadius: 20,
              padding: "14px 14px",
              boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
            }}>
              <p style={{ fontSize: 10, color: T.muted, margin: "0 0 7px 0", lineHeight: 1.4 }}>{s.l}</p>
              {s.v2 ? (
                <>
                  <p style={{ fontFamily: tajawal, fontWeight: 700, fontSize: 14, color: T.green, margin: "0 0 2px 0", lineHeight: 1.3 }}>{s.v}</p>
                  <p style={{ fontFamily: tajawal, fontWeight: 600, fontSize: 13, color: T.txt,   margin: 0 }}>{s.v2}</p>
                </>
              ) : (
                <p style={{
                  fontFamily: tajawal,
                  fontWeight: 800,
                  fontSize: i === 3 ? 24 : 16,
                  color: i === 3 ? T.gold : T.txt,
                  margin: 0,
                }}>{s.v}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Donut Chart Card */}
      <div style={{ padding: "0 20px 100px" }}>
        <div style={{
          backgroundColor: T.card,
          borderRadius: 24,
          padding: "18px 18px 20px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}>
          <h3 style={{
            fontFamily: tajawal, fontWeight: 700, fontSize: 14,
            color: T.txt, margin: "0 0 16px 0",
          }}>المصروفات حسب الفئة</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1 }}>
              {DONUT.map((d, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  marginBottom: i < DONUT.length - 1 ? 10 : 0,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: d.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: T.muted, flex: 1 }}>{d.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: T.txt, fontFamily: tajawal }}>{d.pct}%</span>
                </div>
              ))}
            </div>
            <DonutChart size={146} />
          </div>
        </div>
      </div>
    </div>
  );
}
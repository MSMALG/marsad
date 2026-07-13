import { useState } from 'react'
import type { Country } from '../travel/types'

type Props = {
  onBack: () => void
  onSelect?: (c: Country) => void
}

const COUNTRIES: Country[] = [
  { flag: '🇺🇸', nameAr: 'الولايات المتحدة', currency: 'USD', rate: 3.75, rateTarget: 3.68 },
  { flag: '🇬🇧', nameAr: 'المملكة المتحدة', currency: 'GBP', rate: 4.72, rateTarget: 4.61 },
  { flag: '🇹🇷', nameAr: 'تركيا', currency: 'TRY', rate: 0.11, rateTarget: 0.10 },
  { flag: '🇫🇷', nameAr: 'فرنسا', currency: 'EUR', rate: 4.08, rateTarget: 3.99 },
  { flag: '🇩🇪', nameAr: 'ألمانيا', currency: 'EUR', rate: 4.08, rateTarget: 3.99 },
  { flag: '🇮🇹', nameAr: 'إيطاليا', currency: 'EUR', rate: 4.08, rateTarget: 3.99 },
  { flag: '🇪🇸', nameAr: 'إسبانيا', currency: 'EUR', rate: 4.08, rateTarget: 3.99 },
  { flag: '🇦🇪', nameAr: 'الإمارات', currency: 'AED', rate: 1.02, rateTarget: 0.99 },
  { flag: '🇰🇼', nameAr: 'الكويت', currency: 'KWD', rate: 12.21, rateTarget: 11.90 },
  { flag: '🇧🇭', nameAr: 'البحرين', currency: 'BHD', rate: 9.96, rateTarget: 9.71 },
  { flag: '🇶🇦', nameAr: 'قطر', currency: 'QAR', rate: 1.03, rateTarget: 1.00 },
  { flag: '🇴🇲', nameAr: 'عمان', currency: 'OMR', rate: 9.74, rateTarget: 9.50 },
  { flag: '🇪🇬', nameAr: 'مصر', currency: 'EGP', rate: 0.076, rateTarget: 0.073 },
  { flag: '🇯🇵', nameAr: 'اليابان', currency: 'JPY', rate: 0.025, rateTarget: 0.024 },
  { flag: '🇰🇷', nameAr: 'كوريا الجنوبية', currency: 'KRW', rate: 0.0028, rateTarget: 0.0027 },
  { flag: '🇨🇭', nameAr: 'سويسرا', currency: 'CHF', rate: 4.21, rateTarget: 4.10 },
  { flag: '🇨🇦', nameAr: 'كندا', currency: 'CAD', rate: 2.74, rateTarget: 2.68 },
  { flag: '🇦🇺', nameAr: 'أستراليا', currency: 'AUD', rate: 2.40, rateTarget: 2.35 },
  { flag: '🇸🇬', nameAr: 'سنغافورة', currency: 'SGD', rate: 2.80, rateTarget: 2.73 },
  { flag: '🇲🇾', nameAr: 'ماليزيا', currency: 'MYR', rate: 0.86, rateTarget: 0.83 },
]

export default function CountrySelectScreen({ onBack, onSelect }: Props) {
  const [query, setQuery] = useState('')

  const filtered = COUNTRIES.filter(
    (c) =>
      c.nameAr.includes(query) ||
      c.currency.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F2EDE2',
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
        animation: 'slideInRight 0.35s cubic-bezier(0.32,0.72,0,1) forwards',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          paddingTop: 56,
          paddingBottom: 16,
          paddingLeft: 20,
          paddingRight: 20,
          gap: 12,
        }}
      >
        <button
          onClick={() => onBack?.()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(47,62,52,0.08)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#2F3E34', fontSize: 20 }}>
            arrow_forward_ios
          </span>
        </button>
        <span style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E', flex: 1, textAlign: 'center' }}>
          اختاري الوجهة
        </span>
        <div style={{ width: 40 }} />
      </div>

      {/* Search */}
      <div style={{ paddingLeft: 20, paddingRight: 20, paddingBottom: 16 }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            border: '1.5px solid rgba(47,62,52,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingLeft: 16,
            paddingRight: 16,
            height: 50,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#9CA3AF', fontSize: 20 }}>
            search
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن دولة…"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: 15,
              color: '#1C1C1E',
              fontFamily: "'Noto Sans Arabic', system-ui, sans-serif",
              textAlign: 'right',
              direction: 'rtl',
            }}
          />
        </div>
      </div>

      {/* Country List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingLeft: 20,
          paddingRight: 20,
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          }}
        >
          {filtered.map((c, i) => (
            <button
              key={`${c.currency}-${i}`}
              onClick={() => onSelect?.(c)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 16px',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                cursor: 'pointer',
                direction: 'rtl',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 28, lineHeight: 1 }}>{c.flag}</span>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: '#1C1C1E', margin: 0 }}>
                    {c.nameAr}
                  </p>
                  <p style={{ fontSize: 12, color: '#9CA3AF', margin: 0, marginTop: 2 }}>
                    {c.currency}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined" style={{ color: '#D1D5DB', fontSize: 18 }}>
                arrow_back_ios
              </span>
            </button>
          ))}
        </div>
        <div style={{ height: 32 }} />
      </div>
    </div>
  )
}

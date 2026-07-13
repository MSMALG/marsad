import type { Country, Screen } from './types'

type Props = {
  country: Country
  animDir: 'forward' | 'back'
  prevScreen: Screen | null
  onOpenCountrySelect: () => void
  onOpenRewards: () => void
}

const card = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  backgroundColor: '#FFFFFF',
  borderRadius: 24,
  boxShadow: '0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
  ...extra,
})

export default function Travel({ country, animDir, prevScreen, onOpenCountrySelect, onOpenRewards }: Props) {
  const getAnim = () => {
    if (!prevScreen) return {}
    if (prevScreen === 'country-select') return { animation: 'slideInLeft 0.35s cubic-bezier(0.32,0.72,0,1) forwards' }
    if (prevScreen === 'rewards') return { animation: 'slideInLeft 0.35s cubic-bezier(0.32,0.72,0,1) forwards' }
    return {}
  }

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F2EDE2',
        display: 'flex',
        flexDirection: 'column',
        direction: 'rtl',
        ...getAnim(),
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 56,
          paddingBottom: 8,
          paddingLeft: 24,
          paddingRight: 24,
          position: 'relative',
        }}
      >
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1C1C1E',
            letterSpacing: '-0.3px',
          }}
        >
          السفر والعملات
        </span>
        <div
          style={{
            position: 'absolute',
            right: 24,
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(47,62,52,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#2F3E34', fontSize: 22 }}>
            flight
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          scrollbarWidth: 'none',
        }}
      >
        {/* Destination Card */}
        <div style={card({ padding: '20px 20px' })}>
          <p style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500, marginBottom: 14 }}>
            وين تبين تسافرين؟
          </p>
          <button
            onClick={onOpenCountrySelect}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#F9F7F3',
              border: '1.5px solid rgba(47,62,52,0.12)',
              borderRadius: 16,
              padding: '14px 16px',
              cursor: 'pointer',
              direction: 'rtl',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 26, lineHeight: 1 }}>{country.flag}</span>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#1C1C1E' }}>
                {country.nameAr}
              </span>
            </div>
            <span className="material-symbols-outlined" style={{ color: '#9CA3AF', fontSize: 20 }}>
              keyboard_arrow_down
            </span>
          </button>
        </div>

        {/* Exchange Rate Card */}
        <div style={card({ padding: '20px 20px' })}>
          <p style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, marginBottom: 16, textAlign: 'center' }}>
            سعر الصرف الحالي
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>{country.flag}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>{country.currency}</span>
              </div>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#1C1C1E', letterSpacing: '-0.5px' }}>1</span>
            </div>

            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(47,62,52,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span className="material-symbols-outlined" style={{ color: '#2F3E34', fontSize: 18 }}>
                currency_exchange
              </span>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 4 }}>
                <span style={{ fontSize: 20 }}>🇸🇦</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#6B7280' }}>SAR</span>
              </div>
              <span style={{ fontSize: 28, fontWeight: 700, color: '#2F3E34', letterSpacing: '-0.5px' }}>
                {country.rate.toFixed(2)}
              </span>
            </div>
          </div>
          <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 12 }}>
            1 {country.currency} = {country.rate.toFixed(2)} ريال سعودي
          </p>
        </div>

        {/* AI Prediction Card */}
        <div style={card({ padding: '18px 20px' })}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 10,
                  backgroundColor: 'rgba(79,124,91,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#4F7C5B', fontSize: 18 }}>
                  smart_toy
                </span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1C1C1E' }}>توقع الذكاء الاصطناعي</span>
            </div>
            <span
              style={{
                backgroundColor: 'rgba(79,124,91,0.1)',
                color: '#4F7C5B',
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                letterSpacing: '0.2px',
              }}
            >
              تحليل AI
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7, fontWeight: 400 }}>
            أفضل وقت للتحويل خلال 5–12 يوم.
          </p>
          <p style={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7 }}>
            يتوقع انخفاض السعر إلى{' '}
            <span style={{ fontWeight: 700, color: '#4F7C5B' }}>{country.rateTarget.toFixed(2)} ريال</span>.
          </p>
        </div>

        {/* Rewards Banner */}
        <div
          style={{
            backgroundColor: '#2F3E34',
            borderRadius: 24,
            padding: '18px 20px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -20,
              left: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              backgroundColor: 'rgba(201,181,122,0.08)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: 'rgba(201,181,122,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#C9B57A', fontSize: 20 }}>
                  card_giftcard
                </span>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#FFFFFF', marginBottom: 2 }}>
                  لديك 1,240 نقطة
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 400 }}>
                  تعادل 124 ريال
                </p>
              </div>
            </div>
            <button
              onClick={onOpenRewards}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                backgroundColor: 'rgba(201,181,122,0.18)',
                border: '1px solid rgba(201,181,122,0.3)',
                borderRadius: 12,
                padding: '8px 12px',
                cursor: 'pointer',
                direction: 'rtl',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 600, color: '#C9B57A', whiteSpace: 'nowrap' }}>
                شوفي كيف تستخدمينها
              </span>
              <span className="material-symbols-outlined" style={{ color: '#C9B57A', fontSize: 14 }}>
                arrow_back_ios
              </span>
            </button>
          </div>
        </div>

        <div style={{ height: 90 }} />
      </div>
    </div>
  )
}
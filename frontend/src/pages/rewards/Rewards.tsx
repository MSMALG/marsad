type Props = {
  onBack: () => void
}

const ACTIVITIES = [
  { icon: 'savings', label: 'التزمت بخطة الادخار', points: '+120 نقطة' },
  { icon: 'local_cafe', label: 'وفرت على القهوة', points: '+50 نقطة' },
  { icon: 'track_changes', label: 'أكملت هدف الادخار', points: '+70 نقطة' },
]

const REWARDS = [
  { icon: 'flight', title: 'خصم 15%', subtitle: 'تذاكر الطيران', points: '1,000 نقطة' },
  { icon: 'restaurant', title: 'خصم 20%', subtitle: 'المطاعم', points: '800 نقطة' },
  { icon: 'hotel', title: 'خصم 25%', subtitle: 'الفنادق', points: '1,200 نقطة' },
]

export default function RewardsScreen({ onBack }: Props) {
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
          paddingBottom: 12,
          paddingLeft: 20,
          paddingRight: 20,
          position: 'relative',
        }}
      >
        <button
          onClick={onBack}
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
            position: 'absolute',
            right: 20,
          }}
        >
          <span className="material-symbols-outlined" style={{ color: '#2F3E34', fontSize: 20 }}>
            arrow_forward_ios
          </span>
        </button>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#1C1C1E' }}>نقاط الإنماء</span>
          <span className="material-symbols-outlined" style={{ color: '#C9B57A', fontSize: 20 }}>
            card_giftcard
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '8px 20px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          scrollbarWidth: 'none',
        }}
      >
        {/* Balance Card */}
        <div
          style={{
            backgroundColor: '#2F3E34',
            borderRadius: 24,
            padding: '24px 24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: -30,
              left: -30,
              width: 130,
              height: 130,
              borderRadius: '50%',
              backgroundColor: 'rgba(201,181,122,0.07)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: -20,
              left: 40,
              width: 90,
              height: 90,
              borderRadius: '50%',
              backgroundColor: 'rgba(201,181,122,0.05)',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 8, fontWeight: 500 }}>
                رصيد نقاطك
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 38, fontWeight: 800, color: '#FFFFFF', letterSpacing: '-1px', lineHeight: 1 }}>
                  1,240
                </span>
                <span style={{ fontSize: 16, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>نقطة</span>
              </div>
              <p style={{ fontSize: 13, color: '#C9B57A', marginTop: 6, fontWeight: 600 }}>
                تعادل 124 ريال
              </p>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  backgroundColor: '#C9B57A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(201,181,122,0.4), inset 0 -3px 0 rgba(0,0,0,0.15)',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#2F3E34', fontSize: 30, fontVariationSettings: "'wght' 500" }}>
                  toll
                </span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#4F7C5B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span className="material-symbols-outlined" style={{ color: '#fff', fontSize: 12 }}>
                  star
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 24,
            padding: '18px 20px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1C1C1E' }}>كيف كسبت نقاطك</span>
            <button
              style={{
                backgroundColor: 'rgba(47,62,52,0.07)',
                border: 'none',
                borderRadius: 10,
                padding: '5px 12px',
                fontSize: 11,
                fontWeight: 600,
                color: '#2F3E34',
                cursor: 'pointer',
                fontFamily: "'Noto Sans Arabic', system-ui, sans-serif",
              }}
            >
              عرض الكل
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {ACTIVITIES.map((a, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: i < ACTIVITIES.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 11,
                      backgroundColor: 'rgba(79,124,91,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ color: '#4F7C5B', fontSize: 18 }}>
                      {a.icon}
                    </span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1C1C1E' }}>{a.label}</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#4F7C5B' }}>{a.points}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Redeem Section */}
        <div>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#1C1C1E', marginBottom: 10, paddingRight: 2 }}>
            استبدلي نقاطك لدى شركاء الإنماء
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            {REWARDS.map((r, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  borderRadius: 20,
                  padding: '16px 12px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 8,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 13,
                    backgroundColor: 'rgba(47,62,52,0.07)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: '#2F3E34', fontSize: 20 }}>
                    {r.icon}
                  </span>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 800, color: '#2F3E34', margin: 0, lineHeight: 1.2 }}>
                    {r.title}
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '3px 0 0', fontWeight: 400 }}>
                    {r.subtitle}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#C9B57A',
                    backgroundColor: 'rgba(201,181,122,0.12)',
                    padding: '4px 8px',
                    borderRadius: 8,
                  }}
                >
                  {r.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '14px 18px',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: 'rgba(201,181,122,0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span className="material-symbols-outlined" style={{ color: '#C9B57A', fontSize: 18 }}>
              toll
            </span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#4B5563' }}>
            كل{' '}
            <span style={{ color: '#2F3E34', fontWeight: 800 }}>10 نقاط</span>
            {' '}={' '}
            <span style={{ color: '#4F7C5B', fontWeight: 800 }}>1 ريال</span>
          </span>
        </div>

        <div style={{ height: 90 }} />
      </div>
    </div>
  )
}
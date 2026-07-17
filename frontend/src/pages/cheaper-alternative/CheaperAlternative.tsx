export default function CheaperAlternative() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F2EDE2',
        direction: 'rtl',
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
        overflowY: 'auto',
      }}
    >
      {/* Header */}
      <div
        style={{
          paddingInline: 20,
          paddingTop: 64,
          paddingBottom: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span className="material-symbols-outlined" style={{ fontSize: 21, color: '#2F3E34', cursor: 'pointer' }}>
          arrow_forward
        </span>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#2F3E34', letterSpacing: 0.2 }}>
            البديل الأذكى
          </div>
          <div style={{ fontSize: 11, color: '#7A7060', marginTop: 1 }}>
            اقتراح ذكي لتقليل مصروفاتك
          </div>
        </div>
        <span className="material-symbols-outlined" style={{ fontSize: 21, color: '#C9B57A' }}>
          lightbulb
        </span>
      </div>

      {/* Content */}
      <div
        style={{
          paddingInline: 14,
          paddingBottom: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {/* AI Detection Card */}
        <div
          style={{
            backgroundColor: '#EDEAE0',
            borderRadius: 18,
            padding: '11px 14px',
            border: '1px solid rgba(201,181,122,0.28)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: '#7A7060', marginBottom: 3, fontWeight: 500 }}>
                اكتشف الذكاء الاصطناعي
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#2F3E34', lineHeight: 1.35 }}>
                صرفت 420 ر.س على ستاربكس هذا الشهر
              </div>
              <div style={{ fontSize: 11, color: '#5C5445', marginTop: 3, lineHeight: 1.45 }}>
                يمكنك توفير 170 ر.س شهرياً باختيار بديل أقرب وأوفر
              </div>
            </div>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 26, color: '#C9B57A', flexShrink: 0 }}
            >
              auto_awesome
            </span>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
              backgroundColor: '#2F3E34',
              borderRadius: 20,
              paddingInline: 10,
              paddingBlock: 4,
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 12, color: '#C9B57A', fontVariationSettings: "'wght' 300" }}
            >
              auto_awesome
            </span>
            <span style={{ fontSize: 11, color: '#F2EDE2', fontWeight: 600, letterSpacing: 0.1 }}>
              اقتراح ذكي AI
            </span>
          </div>
        </div>

        {/* Comparison Section */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#2F3E34', marginBottom: 6, paddingInline: 2 }}>
            مقارنة بين الخيارات
          </div>

          {/* Starbucks — current / expensive */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: '10px 12px',
              marginBottom: 7,
              borderRight: '3px solid #C94C4C',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#C94C4C' }}>local_cafe</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2F3E34' }}>ستاربكس</span>
              </div>
              <span style={{ backgroundColor: '#FEF2F2', color: '#C94C4C', fontSize: 9, fontWeight: 700, borderRadius: 8, paddingInline: 7, paddingBlock: 3 }}>
                الأعلى تكلفة
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#C94C4C' }}>420</span>
                <span style={{ fontSize: 10, color: '#7A7060', marginRight: 3 }}>ر.س / شهر</span>
              </div>
              <span style={{ fontSize: 10, color: '#9A8F7E' }}>
                متوسط الكوب <span style={{ fontWeight: 600, color: '#5C5445' }}>≈ 25 ر.س</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#9A8F7E' }}>location_on</span>
              <span style={{ fontSize: 10, color: '#9A8F7E' }}>طريق الملك فهد</span>
            </div>
          </div>

          {/* Unwan — suggested alternative */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 14,
              padding: '10px 12px',
              borderRight: '3px solid #2F3E34',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#4F7C5B' }}>local_cafe</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#2F3E34' }}>عنوان القهوة</span>
              </div>
              <span style={{ backgroundColor: '#F0F7F3', color: '#4F7C5B', fontSize: 9, fontWeight: 700, borderRadius: 8, paddingInline: 7, paddingBlock: 3 }}>
                موصى به بواسطة AI
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#4F7C5B' }}>250</span>
                <span style={{ fontSize: 10, color: '#7A7060', marginRight: 3 }}>ر.س / شهر</span>
              </div>
              <span style={{ fontSize: 10, color: '#9A8F7E' }}>
                متوسط الكوب <span style={{ fontWeight: 600, color: '#5C5445' }}>≈ 15 ر.س</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 11, color: '#9A8F7E' }}>location_on</span>
                <span style={{ fontSize: 10, color: '#9A8F7E' }}>يبعد 300 متر فقط</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <span className="material-symbols-outlined" style={{ fontSize: 12, color: '#C9B57A' }}>star</span>
                <span style={{ fontSize: 10, fontWeight: 700, color: '#2F3E34' }}>4.7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Savings Card */}
        <div
          style={{
            backgroundColor: '#2F3E34',
            borderRadius: 18,
            padding: '11px 14px',
          }}
        >
          <div style={{ fontSize: 11, color: '#C9B57A', fontWeight: 600, marginBottom: 8, textAlign: 'center' }}>
            توفيرك المتوقع
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#C9B57A', display: 'block', marginBottom: 3 }}>calendar_month</span>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>2,040</div>
              <div style={{ fontSize: 9, color: '#C9B57A' }}>ر.س</div>
              <div style={{ fontSize: 9, color: '#9EAA9F', marginTop: 1 }}>سنوياً</div>
            </div>
            <div style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#C9B57A', display: 'block', marginBottom: 3 }}>account_balance_wallet</span>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>170</div>
              <div style={{ fontSize: 9, color: '#C9B57A' }}>ر.س</div>
              <div style={{ fontSize: 9, color: '#9EAA9F', marginTop: 1 }}>شهرياً</div>
            </div>
            <div style={{ width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <div style={{ textAlign: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#C9B57A', display: 'block', marginBottom: 3 }}>percent</span>
              <div style={{ fontSize: 19, fontWeight: 800, color: '#FFF', lineHeight: 1 }}>40%</div>
              <div style={{ fontSize: 9, color: '#9EAA9F', marginTop: 12 }}>توفير</div>
            </div>
          </div>
        </div>

        {/* Nearby Location Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '10px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ width: 70, height: 60, borderRadius: 10, backgroundColor: '#EAE6DC', flexShrink: 0, overflow: 'hidden' }}>
            <svg width="70" height="60" viewBox="0 0 70 60" fill="none">
              <line x1="0" y1="30" x2="70" y2="30" stroke="#D4CEBD" strokeWidth="6" />
              <line x1="35" y1="0" x2="35" y2="60" stroke="#D4CEBD" strokeWidth="4" />
              <line x1="0"  y1="45" x2="70" y2="45" stroke="#D4CEBD" strokeWidth="2" />
              <line x1="17" y1="0"  x2="17" y2="60" stroke="#D4CEBD" strokeWidth="2" />
              <path d="M 50 43 L 50 30 L 21 30" stroke="#4F7C5B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 2" />
              <circle cx="50" cy="45" r="5" fill="#C94C4C" />
              <circle cx="50" cy="45" r="2.5" fill="white" />
              <circle cx="19" cy="30" r="5" fill="#2F3E34" />
              <circle cx="19" cy="30" r="2.5" fill="white" />
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#2F3E34', marginBottom: 5 }}>الأقرب إليك</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#4F7C5B' }}>location_on</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#2F3E34' }}>يبعد 300 متر</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 13, color: '#7A7060' }}>directions_walk</span>
              <span style={{ fontSize: 10, color: '#7A7060' }}>4 دقائق مشياً</span>
            </div>
          </div>

          <button
  onClick={() =>
    window.open(
      "https://maps.app.goo.gl/CGrq1ubAvFcrdSHq7?g_st=ic",
      "_blank"
    )
  }
  style={{
    border: "1.5px solid #2F3E34",
    borderRadius: 10,
    backgroundColor: "transparent",
    color: "#2F3E34",
    fontSize: 10,
    fontWeight: 600,
    paddingInline: 9,
    paddingBlock: 6,
    cursor: "pointer",
    whiteSpace: "nowrap",
    flexShrink: 0,
  }}
>
  عرض الموقع
</button>
        </div>

        {/* AI Recommendation Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 18,
            padding: '10px 12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 9,
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#C9B57A', marginTop: 1, flexShrink: 0 }}>smart_toy</span>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#2F3E34', marginBottom: 3 }}>توصية الذكاء الاصطناعي</div>
            <div style={{ fontSize: 10.5, color: '#5C5445', lineHeight: 1.55 }}>
              إذا استبدلت ستاربكس بعنوان القهوة، يمكنك توفير 170 ر.س شهرياً دون تغيير عاداتك اليومية.
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ flex: 1, backgroundColor: '#2F3E34', color: '#F2EDE2', borderRadius: 14, border: 'none', paddingBlock: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#C9B57A' }}>bookmark</span>
            احفظ الاقتراح
          </button>
          <button style={{ flex: 1, backgroundColor: 'transparent', color: '#2F3E34', borderRadius: 14, border: '1.5px solid #2F3E34', paddingBlock: 12, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 15, color: '#2F3E34' }}>share</span>
            شاركي الاقتراح
          </button>
        </div>
      </div>
    </div>
  )
}
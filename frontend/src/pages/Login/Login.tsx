import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function MirsadIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="26" cy="26" r="23" stroke="rgba(255,255,255,0.32)" strokeWidth="1.2" strokeDasharray="2.5 3.5" />
      <circle cx="26" cy="26" r="15.5" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
      <path
        d="M5 26C10 16.5 42 16.5 47 26C42 35.5 10 35.5 5 26Z"
        stroke="white"
        strokeWidth="1.8"
        fill="none"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <circle cx="26" cy="26" r="6" stroke="white" strokeWidth="1.6" fill="none" />
      <circle cx="26" cy="26" r="3.5" stroke="rgba(255,255,255,0.45)" strokeWidth="0.8" fill="none" />
      <circle cx="26" cy="26" r="2" fill="white" />
      <path d="M3 13 L3 3 L13 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49 13 L49 3 L39 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 39 L3 49 L13 49" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M49 39 L49 49 L39 49" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <style>{`
        .mirsad-input::placeholder {
          color: #9A9690;
          font-family: 'Cairo', sans-serif;
          font-size: 13.5px;
        }
        .mirsad-input:focus { outline: none; }
        .login-btn { transition: all 0.25s ease; }
        .login-btn:hover {
          filter: brightness(1.09);
          transform: translateY(-1px);
          box-shadow: 0 16px 38px rgba(55,70,58,0.48), 0 5px 14px rgba(55,70,58,0.3) !important;
        }
        .login-btn:active { transform: scale(0.985); filter: brightness(0.94); }
        .bio-btn:hover { background: #EDE8DE !important; border-color: #C5BFB4 !important; }
        .bio-btn:active { transform: scale(0.93); }
        .bio-btn { transition: all 0.2s ease; }
        .eye-btn:hover { color: #4A5E4D !important; }
        .eye-btn { transition: color 0.2s; }
      `}</style>

      <div
        dir="rtl"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "70px 20px 36px",
          overflowY: "auto",
        }}
      >
        {/* Floating badge icon */}
        <div style={{ position: "relative", zIndex: 10, marginBottom: "-48px" }}>
          <div style={{
            width: "96px", height: "96px",
            borderRadius: "50%",
            background: "linear-gradient(145deg, #4A5E4D 0%, #37463A 100%)",
            boxShadow: "0 18px 52px rgba(55,70,58,0.54), 0 7px 18px rgba(55,70,58,0.36), 0 0 0 4px rgba(252,251,248,0.92), 0 0 0 5px rgba(229,223,212,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <MirsadIcon />
          </div>
        </div>

        {/* Card */}
        <div style={{
          width: "100%",
          background: "#FCFBF8",
          borderRadius: "36px",
          padding: "58px 26px 26px",
          boxShadow: "0 28px 72px rgba(55,70,58,0.14), 0 10px 28px rgba(55,70,58,0.09), 0 3px 8px rgba(55,70,58,0.05)",
          border: "1px solid rgba(229,223,212,0.78)",
          position: "relative",
        }}>
          <h1 style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "30px", fontWeight: "700",
            color: "#37463A",
            textAlign: "center",
            margin: "0 0 6px",
            letterSpacing: "-0.5px",
            lineHeight: "1.2",
            direction: "rtl",
          }}>
            مرصاد
          </h1>

          <p style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: "13.5px", fontWeight: "400",
            color: "#7D8078",
            textAlign: "center",
            lineHeight: "1.8",
            margin: "0 0 16px",
            direction: "rtl",
          }}>
            نرصد لأجلك...<br />
            لنحمي مستقبلك المالي
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, #E5DFD4 60%)" }} />
            <div style={{
              width: "7px", height: "7px",
              background: "#C7A96C",
              transform: "rotate(45deg)",
              flexShrink: 0,
              boxShadow: "0 1px 5px rgba(199,169,108,0.45)",
            }} />
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(270deg, transparent, #E5DFD4 60%)" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "12px" }}>
            {/* Username */}
            <div style={{
              height: "56px",
              display: "flex", alignItems: "center", gap: "11px",
              background: "#F5F1E8",
              borderRadius: "18px",
              border: "1.5px solid #E5DFD4",
              padding: "0 10px 0 12px",
            }}>
              <div style={{
                width: "40px", height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #4A5E4D, #37463A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 3px 9px rgba(55,70,58,0.32)",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6.5" r="3" stroke="white" strokeWidth="1.6" />
                  <path d="M2.5 15C2.5 12.1 5.5 9.5 9 9.5C12.5 9.5 15.5 12.1 15.5 15" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <input
                className="mirsad-input"
                type="text"
                placeholder="اسم المستخدم"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  flex: 1, minWidth: 0,
                  background: "transparent",
                  border: "none", outline: "none",
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "14px", fontWeight: "400",
                  color: "#2E352F",
                  direction: "rtl", textAlign: "right",
                }}
              />
            </div>

            {/* Password */}
            <div style={{
              height: "56px",
              display: "flex", alignItems: "center", gap: "11px",
              background: "#F5F1E8",
              borderRadius: "18px",
              border: "1.5px solid #E5DFD4",
              padding: "0 10px 0 12px",
            }}>
              <div style={{
                width: "40px", height: "40px",
                borderRadius: "12px",
                background: "linear-gradient(145deg, #4A5E4D, #37463A)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 3px 9px rgba(55,70,58,0.32)",
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="2.5" y="8" width="13" height="9" rx="2.5" stroke="white" strokeWidth="1.5" />
                  <path d="M5.5 8V6.5C5.5 4.57 7.07 3 9 3C10.93 3 12.5 4.57 12.5 6.5V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                  <circle cx="9" cy="12.5" r="1.3" fill="white" />
                </svg>
              </div>
              <input
                className="mirsad-input"
                type={showPassword ? "text" : "password"}
                placeholder="كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  flex: 1, minWidth: 0,
                  background: "transparent",
                  border: "none", outline: "none",
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: "14px", fontWeight: "400",
                  color: "#2E352F",
                  direction: "rtl", textAlign: "right",
                }}
              />
              <button
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px", color: "#9A9690",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "16px",
          }}>
            <div
              style={{ display: "flex", alignItems: "center", gap: "7px", cursor: "pointer", userSelect: "none" }}
              onClick={() => setRememberMe(!rememberMe)}
            >
              <div style={{
                width: "20px", height: "20px",
                borderRadius: "6px",
                background: rememberMe ? "linear-gradient(145deg, #4A5E4D, #37463A)" : "transparent",
                border: rememberMe ? "none" : "1.5px solid #C5BFB4",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}>
                {rememberMe && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.2L4 7.5L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: "13px", fontWeight: "500", color: "#2E352F",
                direction: "rtl",
              }}>
                تذكرني
              </span>
            </div>

            <button style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: "'Cairo', sans-serif",
              fontSize: "13px", fontWeight: "600",
              color: "#4A5E4D",
              direction: "rtl", padding: 0,
            }}>
              نسيت كلمة المرور؟
            </button>
          </div>

          <button
            className="login-btn"
            onClick={onLogin}
            style={{
              width: "100%", height: "56px",
              background: "linear-gradient(135deg, #4A5E4D 0%, #37463A 100%)",
              borderRadius: "18px", border: "none", cursor: "pointer",
              fontFamily: "'Cairo', sans-serif",
              fontSize: "16px", fontWeight: "700", color: "white",
              letterSpacing: "0.2px",
              boxShadow: "0 10px 28px rgba(55,70,58,0.38), 0 3px 8px rgba(55,70,58,0.22)",
              display: "flex", alignItems: "center", justifyContent: "center",
              direction: "rtl",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(199,169,108,0.14) 0%, transparent 45%)",
              borderRadius: "inherit",
              pointerEvents: "none",
            }} />
            تسجيل الدخول
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "14px" }}>
            <div style={{ flex: 1, height: "1px", background: "#E5DFD4" }} />
            <button
              className="bio-btn"
              title="تسجيل الدخول ببصمة الإصبع"
              style={{
                width: "44px", height: "44px",
                borderRadius: "14px",
                background: "#F5F1E8",
                border: "1.5px solid #E5DFD4",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                boxShadow: "0 2px 6px rgba(55,70,58,0.08)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M11 2C8.5 2 6.3 3.1 4.8 4.9" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M17.2 4.9C15.7 3.1 13.5 2 11 2" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 10.5C8 9 9.3 7.8 11 7.8C12.7 7.8 14 9 14 10.5V14" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 10.5C8 10.5 8 18 11 18" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M14 14C14 16.8 12.4 19.5 11 20.5" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4.5 9.5C4.5 9.5 3.5 13 6 16" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M17.5 9.5C17.5 9.5 18.5 14 17 17" stroke="#4A5E4D" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <div style={{ flex: 1, height: "1px", background: "#E5DFD4" }} />
          </div>
        </div>
      </div>
    </>
  );
}
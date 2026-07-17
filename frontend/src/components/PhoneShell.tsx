import { ReactNode } from "react";

export default function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      dir="rtl"
    >
      <div className="relative w-[390px] h-[844px] bg-[#F5F1E8] rounded-[54px] overflow-hidden shadow-2xl border border-black/10">
        {/* Dynamic Island */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 bg-black rounded-full z-20"
          style={{ width: 126, height: 37 }}
        />
        {/* Status bar */}
        <div
          dir="ltr"
          className="absolute top-0 left-0 right-0 flex items-end justify-between px-7 z-10"
          style={{ height: 59, paddingBottom: 11 }}
        >
          
         
         
        </div>

        {/* Scrollable page content, page controls its own top padding under status bar */}
        <div className="absolute inset-0 overflow-y-auto">{children}</div>

        {/* Home indicator */}
        <div
          className="absolute bottom-2.5 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 134, height: 5, background: "rgba(46,53,47,0.17)" }}
        />
      </div>
    </div>
  );
}
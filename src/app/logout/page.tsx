"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="min-h-screen bg-[#041d14] flex flex-col items-center justify-center text-emerald-100 p-4 font-sans">
      <div className="flex flex-col items-center space-y-4 bg-emerald-950/80 p-8 rounded-3xl border border-emerald-500/30 shadow-2xl backdrop-blur-md">
        <div className="w-12 h-12 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-bold text-emerald-200 tracking-wide">กำลังออกจากระบบ...</p>
        <p className="text-xs text-emerald-300/60">โปรดรอสักครู่ ระบบกำลังนำคุณกลับไปยังหน้าเข้าสู่ระบบ</p>
      </div>
    </div>
  );
}

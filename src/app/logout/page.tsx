"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 p-4 font-sans">
      <div className="flex flex-col items-center space-y-4 bg-white p-8 sm:p-10 rounded-3xl border border-emerald-200 shadow-xl text-center">
        <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-extrabold text-slate-900 tracking-tight">กำลังออกจากระบบ...</p>
        <p className="text-xs text-slate-500 font-medium">โปรดรอสักครู่ ระบบกำลังนำคุณกลับไปยังหน้าเข้าสู่ระบบ</p>
      </div>
    </div>
  );
}

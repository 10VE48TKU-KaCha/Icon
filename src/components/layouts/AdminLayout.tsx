"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const isTempAdmin = session?.user?.isTempAdmin || !!session?.user?.expiresAt;
  const expiresAtStr = session?.user?.expiresAt
    ? new Date(session.user.expiresAt).toLocaleString("th-TH")
    : null;

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "ยืนยันการออกจากระบบ",
      text: "คุณต้องการออกจากระบบใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "ใช่, ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#1e293b",
      background: "#041d14",
      color: "#ecfdf5",
      customClass: {
        popup: "border border-emerald-500/30 rounded-2xl shadow-2xl"
      }
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/login" });
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "งานซ่อมทั้งหมด", path: "/admin/repair-jobs", icon: "🔧" },
    { name: "จัดการผู้ใช้", path: "/admin/users", icon: "👥" },
    { name: "ตั้งค่าระบบ", path: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#041d14]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/60 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out glass-sidebar flex flex-col lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-20 border-b border-emerald-500/20 px-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30">
              I
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wider">
                <span className="text-emerald-400">ICON</span> ADMIN
              </h1>
              <span className="text-[10px] text-emerald-400/80 uppercase font-semibold tracking-widest block">
                Repair System
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? "bg-gradient-to-r from-emerald-600/30 to-emerald-500/10 text-emerald-300 border border-emerald-500/40 shadow-sm" 
                    : "text-emerald-100/70 hover:bg-emerald-800/30 hover:text-white"
                }`}
              >
                <span className="mr-3 text-xl">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-emerald-500/20 bg-emerald-950/40">
          <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/50 flex items-center justify-center text-white font-bold border border-emerald-400/40 shadow-md">
              {session?.user?.name?.charAt(0) || "A"}
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{session?.user?.name || "Admin"}</p>
              <p className="text-xs text-emerald-300/80 truncate">
                {isTempAdmin ? "Admin ชั่วคราว (Setup)" : "ผู้ดูแลระบบ"}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-sm text-red-300 bg-red-950/40 hover:bg-red-900/50 rounded-xl transition-colors border border-red-500/30 font-medium"
          >
            <span>🚪 ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Temp Admin Expiring Warning Banner */}
        {isTempAdmin && (
          <div className="bg-gradient-to-r from-amber-600 to-emerald-700 text-white px-6 py-3 text-xs sm:text-sm font-semibold flex flex-col sm:flex-row items-center justify-between shadow-lg z-20 border-b border-amber-400/30">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <span className="text-lg animate-bounce">⚡</span>
              <span>
                <strong>คุณกำลังใช้บัญชี ADMIN ชั่วคราวสำหรับจัดเตรียมระบบ (Setup)</strong>
                {expiresAtStr && <span className="ml-1 text-amber-200">(หมดอายุ: {expiresAtStr})</span>}
              </span>
            </div>
            <Link
              href="/admin/users"
              className="bg-white text-emerald-900 hover:bg-amber-100 font-bold px-3 py-1 rounded-lg text-xs transition shadow"
            >
              + สร้างบัญชี Admin หลักทันที
            </Link>
          </div>
        )}

        <header className="h-16 flex items-center justify-between px-6 lg:px-8 glass-sidebar border-b border-emerald-500/20 z-10">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-emerald-300 hover:text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex-1 flex items-center justify-end space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-900/60 border border-emerald-500/30 px-3 py-1.5 rounded-full text-xs text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{session?.user?.name || "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-red-300 hover:text-white bg-red-950/50 hover:bg-red-900/60 rounded-xl transition-all border border-red-500/30 font-medium"
              title="ออกจากระบบ"
            >
              <span>🚪</span>
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="animate-fadeIn">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}


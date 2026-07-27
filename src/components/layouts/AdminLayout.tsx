"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";
import { 
  LayoutDashboard, 
  Wrench, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  Zap, 
  User 
} from "lucide-react";

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
      cancelButtonColor: "#94a3b8",
      background: "#ffffff",
      color: "#0f172a",
      customClass: {
        popup: "border border-emerald-200 rounded-2xl shadow-xl"
      }
    });

    if (result.isConfirmed) {
      await signOut({ callbackUrl: "/login" });
    }
  };

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "งานซ่อมทั้งหมด", path: "/admin/repair-jobs", icon: Wrench },
    { name: "จัดการผู้ใช้", path: "/admin/users", icon: Users },
    { name: "ตั้งค่าระบบ", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-slate-900/40 lg:hidden backdrop-blur-xs"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out bg-white border-r border-slate-200 flex flex-col lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-20 border-b border-slate-100 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-md shadow-emerald-600/20">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 tracking-wider">
                <span className="text-emerald-600">ICON</span> ADMIN
              </h1>
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest block">
                Repair System
              </span>
            </div>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navLinks.map((link) => {
            const IconComp = link.icon;
            const isActive = pathname === link.path || (link.path !== '/admin' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold ${
                  isActive 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <IconComp className={`mr-3 w-5 h-5 ${isActive ? "text-emerald-600" : "text-slate-400"}`} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{session?.user?.name || "Admin"}</p>
                <p className="text-[11px] text-emerald-700 font-semibold truncate">
                  {isTempAdmin ? "Admin ชั่วคราว" : "ผู้ดูแลระบบ"}
                </p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-200 font-semibold"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Temp Admin Expiring Warning Banner */}
        {isTempAdmin && (
          <div className="bg-amber-500 text-white px-6 py-2.5 text-xs sm:text-sm font-semibold flex flex-col sm:flex-row items-center justify-between shadow-xs z-20">
            <div className="flex items-center space-x-2 mb-2 sm:mb-0">
              <Zap className="w-4 h-4 text-white animate-bounce" />
              <span>
                <strong>คุณกำลังใช้บัญชี ADMIN ชั่วคราวสำหรับจัดเตรียมระบบ (Setup)</strong>
                {expiresAtStr && <span className="ml-1 text-amber-100">(หมดอายุ: {expiresAtStr})</span>}
              </span>
            </div>
            <Link
              href="/admin/users"
              className="bg-white text-slate-900 hover:bg-amber-50 font-bold px-3 py-1 rounded-lg text-xs transition shadow-xs"
            >
              + สร้างบัญชี Admin หลักทันที
            </Link>
          </div>
        )}

        <header className="h-16 flex items-center justify-between px-6 lg:px-8 bg-white border-b border-slate-200 z-10">
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-slate-600 hover:text-slate-900 focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex-1 flex items-center justify-end space-x-3">
            <div className="hidden sm:flex items-center space-x-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full text-xs text-emerald-800 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{session?.user?.name || "Admin"}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all font-semibold"
              title="ออกจากระบบ"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-500" />
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

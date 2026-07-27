"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Swal from "sweetalert2";

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
    { name: "Dashboard", path: "/technician", icon: "📈" },
    { name: "จัดการลูกค้า", path: "/technician/customers", icon: "👥" },
    { name: "รับเรื่องซ่อมใหม่", path: "/technician/repair-jobs/new", icon: "📝" },
    { name: "ค้นหางานซ่อม", path: "/technician/search", icon: "🔍" },
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/30">
              T
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wider">
                <span className="text-emerald-400">ICON</span> TECH
              </h1>
              <span className="text-[10px] text-emerald-400/80 uppercase font-semibold tracking-widest block">
                Technician Panel
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/technician' && pathname.startsWith(link.path));
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
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-emerald-950/90 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-lg shadow-inner flex-shrink-0">
                {session?.user?.name?.charAt(0) || "T"}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{session?.user?.name || "Technician"}</p>
                <p className="text-xs text-emerald-400 font-medium truncate">ช่างซ่อมประจำศูนย์</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Log out (ออกจากระบบ)"
              className="p-2 text-red-400 hover:text-white hover:bg-red-500/20 rounded-xl transition-all border border-red-500/30 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 text-sm text-red-300 bg-red-950/40 hover:bg-red-900/60 rounded-xl transition-all border border-red-500/30 font-medium group"
          >
            <svg className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Log out (ออกจากระบบ)</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
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
              <span>{session?.user?.name || "Technician"}</span>
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


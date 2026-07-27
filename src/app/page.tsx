"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import StatusTimeline from "@/components/StatusTimeline";
import { 
  Search, 
  Wrench, 
  Smartphone, 
  Calendar, 
  ArrowRight, 
  LayoutDashboard, 
  LogOut, 
  Lock,
  Receipt,
  User,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const STATUS_MAP: Record<string, string> = {
  RECEIVED: "รับเครื่อง",
  DIAGNOSING: "กำลังตรวจสอบ",
  WAITING_PARTS: "รออะไหล่",
  REPAIRING: "กำลังซ่อม",
  COMPLETED: "ซ่อมเสร็จ",
  DELIVERED: "ส่งมอบแล้ว",
  CANCELLED: "ยกเลิก",
};

const STATUS_COLOR_MAP: Record<string, string> = {
  RECEIVED: "badge-received",
  DIAGNOSING: "badge-diagnosing",
  WAITING_PARTS: "badge-waiting",
  REPAIRING: "badge-repairing",
  COMPLETED: "badge-completed",
  DELIVERED: "badge-delivered",
  CANCELLED: "badge-cancelled",
};

export default function Home() {
  const { data: session } = useSession();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/track?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) {
        throw new Error("ไม่พบข้อมูลงานซ่อมสำหรับเบอร์โทรศัพท์นี้");
      }
      const data = await res.json();
      setResults(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8 md:p-12 relative overflow-hidden text-slate-800 font-sans">
      {/* Soft Background Gradient Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/60 via-slate-50 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      {/* User Session Bar */}
      {session?.user && (
        <div className="w-full max-w-4xl flex flex-wrap items-center justify-between bg-white border border-emerald-200/80 px-5 py-3 rounded-2xl shadow-sm z-20 mb-6 gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-700">
              เข้าสู่ระบบในชื่อ: <strong className="text-slate-900 font-semibold">{session.user.name}</strong> 
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {session.user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ช่างซ่อม'}
              </span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={session.user.role === 'ADMIN' ? '/admin' : '/technician'}
              className="inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>ไปยัง Dashboard</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-200 transition"
            >
              <LogOut className="w-4 h-4 text-slate-500" />
              <span>ออกจากระบบ</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-4xl flex flex-col items-center z-10 mt-2 sm:mt-6">
        {/* Brand Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 rounded-3xl mx-auto flex items-center justify-center text-white shadow-xl shadow-emerald-600/20 mb-5 border-2 border-white">
            <Wrench className="w-9 h-9 sm:w-11 sm:h-11" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-3 text-slate-900">
            ICON <span className="text-emerald-600">MULTIMEDIA</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-lg mx-auto">
            ระบบตรวจสอบสถานะงานซ่อมสำหรับลูกค้า (Repair Status Tracking Portal)
          </p>
        </div>

        {/* Hero Search Box */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-10 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
          <div className="relative flex flex-col sm:flex-row items-center bg-white rounded-2xl p-2.5 border border-emerald-200 shadow-xl">
            <div className="relative w-full flex items-center pl-4">
              <Search className="w-5 h-5 text-emerald-600 mr-2 flex-shrink-0" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="กรอกเบอร์โทรศัพท์เพื่อตรวจสอบ..."
                className="w-full bg-transparent py-3.5 pr-4 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto mt-2 sm:mt-0 btn-primary font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>กำลังค้นหา...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>ตรวจสอบสถานะ</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {error && (
          <div className="w-full max-w-2xl bg-red-50 border border-red-200 rounded-2xl p-5 text-center text-red-700 mb-8 font-medium shadow-sm flex items-center justify-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>{error}</span>
          </div>
        )}

        {/* Empty Result Notification */}
        {hasSearched && !loading && results.length === 0 && !error && (
          <div className="w-full max-w-2xl bg-white rounded-2xl p-10 text-center text-slate-500 font-medium border border-slate-200 shadow-sm">
            ไม่พบประวัติงานซ่อมสำหรับเบอร์โทรศัพท์นี้
          </div>
        )}

        {/* Search Results Display */}
        {hasSearched && !loading && results.length > 0 && (
          <div className="w-full max-w-2xl flex flex-col gap-6">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ผลการค้นหา ({results.length} รายการ)</span>
              </h2>
              <Link href={`/track/${encodeURIComponent(phone)}`} className="text-emerald-700 hover:text-emerald-800 text-sm font-semibold flex items-center gap-1.5 hover:underline">
                <span>ดูรายละเอียดแบบเต็ม</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {results.map((job) => (
              <div key={job.id} className="glass-card p-6 sm:p-8 hover:border-emerald-300 transition-all shadow-md">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold block uppercase">เลขที่ใบรับซ่อม</span>
                      <span className="text-xl font-extrabold text-emerald-700 font-mono tracking-wide">{job.ticketNumber}</span>
                    </div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${STATUS_COLOR_MAP[job.status] || "bg-slate-100 text-slate-700"}`}>
                    {STATUS_MAP[job.status] || job.status}
                  </div>
                </div>

                <StatusTimeline currentStatus={job.status} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm bg-slate-50/80 p-4 rounded-xl border border-slate-200/60">
                  <div className="flex items-start space-x-2.5">
                    <Smartphone className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">อุปกรณ์</div>
                      <div className="text-slate-900 font-semibold">{job.deviceType} {job.deviceBrand} {job.deviceModel || ''}</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2.5">
                    <Calendar className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">วันที่รับเครื่อง</div>
                      <div className="text-slate-800 font-medium">
                        {format(new Date(job.createdAt), "dd MMMM yyyy", { locale: th })}
                      </div>
                    </div>
                  </div>
                </div>

                {['COMPLETED', 'DELIVERED'].includes(job.status) && job.totalCost > 0 && (
                  <div className="mt-4 pt-4 border-t border-emerald-100 flex justify-between items-center bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60">
                    <span className="text-xs font-bold text-slate-700 uppercase">ยอดชำระสุทธิ</span>
                    <span className="text-xl font-extrabold text-emerald-700 font-mono">฿{job.totalCost.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full text-center mt-auto pt-12 pb-6 text-slate-500 text-xs z-10 flex flex-col gap-2">
        <div>&copy; {new Date().getFullYear()} Icon Multimedia Repair System. All rights reserved.</div>
        {session?.user ? (
          <div className="flex justify-center items-center space-x-3">
            <Link href={session.user.role === 'ADMIN' ? '/admin' : '/technician'} className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ไปยัง Dashboard ({session.user.role})</span>
            </Link>
            <span>•</span>
            <button onClick={handleLogout} className="text-red-600 hover:text-red-700 font-semibold transition-colors">
              ออกจากระบบ
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-emerald-700 hover:text-emerald-800 font-semibold transition-colors flex items-center justify-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>สำหรับเจ้าหน้าที่และผู้ดูแลระบบ</span>
          </Link>
        )}
      </footer>
    </div>
  );
}

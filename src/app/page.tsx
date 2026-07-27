"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { useSession, signOut } from "next-auth/react";
import Swal from "sweetalert2";
import StatusTimeline from "@/components/StatusTimeline";

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
  RECEIVED: "bg-sky-950/80 text-sky-300 border-sky-500/30",
  DIAGNOSING: "bg-purple-950/80 text-purple-300 border-purple-500/30",
  WAITING_PARTS: "bg-amber-950/80 text-amber-300 border-amber-500/30",
  REPAIRING: "bg-emerald-950/80 text-emerald-300 border-emerald-500/30",
  COMPLETED: "bg-emerald-600 text-white font-bold",
  DELIVERED: "bg-slate-800 text-slate-300 border-slate-700",
  CANCELLED: "bg-red-950/80 text-red-300 border-red-500/30",
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/track?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) {
        throw new Error("ไม่พบข้อมูล");
      }
      const data = await res.json();
      setResults(data);
      setHasSearched(true);
    } catch (err: any) {
      setError(err.message || "เกิดข้อผิดพลาด");
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#041d14] flex flex-col items-center p-4 sm:p-8 md:p-24 relative overflow-hidden text-emerald-100 font-sans">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-600/20 via-emerald-900/10 to-transparent blur-3xl -z-10"></div>
      
      {/* User Session Bar if logged in */}
      {session?.user && (
        <div className="w-full max-w-4xl flex items-center justify-between bg-emerald-950/80 border border-emerald-500/30 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md text-xs sm:text-sm z-20 mb-4">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-emerald-200">
              เข้าสู่ระบบในชื่อ: <strong className="text-white font-semibold">{session.user.name}</strong> ({session.user.role === 'ADMIN' ? 'ผู้ดูแลระบบ' : 'ช่างซ่อม'})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href={session.user.role === 'ADMIN' ? '/admin' : '/technician'}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl font-medium transition shadow-md"
            >
              📊 ไปยัง Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-950/60 hover:bg-red-900/80 text-red-300 hover:text-white px-3 py-1.5 rounded-xl font-medium border border-red-500/30 transition"
            >
              🚪 ออกจากระบบ
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-4xl flex flex-col items-center z-10 mt-4 md:mt-8">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black shadow-xl shadow-emerald-500/30 mb-6 border border-emerald-400/40">
            I
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white">
            ICON MULTIMEDIA
          </h1>
          <p className="text-lg md:text-xl text-emerald-200/80 font-medium tracking-wide">
            ระบบตรวจสอบสถานะงานซ่อมสำหรับลูกค้า
          </p>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mb-10 relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
          <div className="relative flex flex-col sm:flex-row items-center bg-emerald-950/90 rounded-2xl p-2.5 border border-emerald-500/40 shadow-2xl backdrop-blur-md">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="กรอกเบอร์โทรศัพท์ของคุณ..."
              className="w-full bg-transparent px-6 py-4 text-lg text-white placeholder:text-emerald-300/40 focus:outline-none"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto mt-2 sm:mt-0 btn-primary font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-emerald-600/40 whitespace-nowrap"
            >
              {loading ? "กำลังค้นหา..." : "🔍 ตรวจสอบสถานะ"}
            </button>
          </div>
        </form>

        {error && (
          <div className="w-full max-w-2xl bg-red-950/60 border border-red-500/40 rounded-2xl p-6 text-center text-red-200 mb-8 font-medium">
            {error}
          </div>
        )}

        {hasSearched && !loading && results.length === 0 && !error && (
          <div className="w-full max-w-2xl glass-card rounded-2xl p-8 text-center text-emerald-200/70 font-medium">
            ไม่พบประวัติงานซ่อมสำหรับเบอร์โทรศัพท์นี้
          </div>
        )}

        {hasSearched && !loading && results.length > 0 && (
          <div className="w-full max-w-2xl flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-xl font-bold text-white">ผลการค้นหา ({results.length} รายการ)</h2>
              <Link href={`/track/${phone}`} className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold flex items-center gap-1">
                <span>ดูหน้ารายละเอียดแบบเต็ม</span>
                <span>&rarr;</span>
              </Link>
            </div>
            {results.map((job) => (
              <div key={job.id} className="glass-card rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all shadow-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-emerald-300/70 uppercase font-semibold mb-1">เลขที่ใบรับซ่อม</div>
                    <div className="text-2xl font-black text-emerald-300 font-mono tracking-wide">{job.ticketNumber}</div>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${STATUS_COLOR_MAP[job.status] || "bg-emerald-900 text-emerald-200 border-emerald-700"}`}>
                    {STATUS_MAP[job.status] || job.status}
                  </div>
                </div>

                <StatusTimeline currentStatus={job.status} />
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 text-sm bg-emerald-950/50 p-4 rounded-xl border border-emerald-500/20">
                  <div>
                    <div className="text-xs text-emerald-300/70 font-medium">อุปกรณ์</div>
                    <div className="text-white font-semibold">{job.deviceType} {job.deviceBrand} {job.deviceModel || ''}</div>
                  </div>
                  <div>
                    <div className="text-xs text-emerald-300/70 font-medium">วันที่รับเครื่อง</div>
                    <div className="text-emerald-100">
                      {format(new Date(job.createdAt), "dd MMMM yyyy", { locale: th })}
                    </div>
                  </div>
                </div>

                {['COMPLETED', 'DELIVERED'].includes(job.status) && job.totalCost > 0 && (
                  <div className="mt-4 pt-4 border-t border-emerald-500/20 flex justify-between items-center">
                    <div className="text-xs text-emerald-200/80 font-medium">ยอดชำระสุทธิ</div>
                    <div className="text-xl font-black text-emerald-300">฿{job.totalCost.toLocaleString()}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="w-full text-center mt-auto pt-12 pb-6 text-emerald-300/60 text-xs z-10 flex flex-col gap-2">
        <div>&copy; {new Date().getFullYear()} Icon Multimedia Repair System. All rights reserved.</div>
        {session?.user ? (
          <div className="flex justify-center items-center space-x-3">
            <Link href={session.user.role === 'ADMIN' ? '/admin' : '/technician'} className="text-emerald-400 hover:text-white font-semibold transition-colors">
              📊 ไปยัง Dashboard ({session.user.role})
            </Link>
            <span>•</span>
            <button onClick={handleLogout} className="text-red-400 hover:text-red-300 font-semibold transition-colors">
              🚪 ออกจากระบบ
            </button>
          </div>
        ) : (
          <Link href="/login" className="text-emerald-400 hover:text-white font-semibold transition-colors">
            🔐 สำหรับเจ้าหน้าที่และผู้ดูแลระบบ
          </Link>
        )}
      </footer>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";

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
  RECEIVED: "bg-slate-700 text-slate-300",
  DIAGNOSING: "bg-cyan-900/50 text-cyan-300",
  WAITING_PARTS: "bg-orange-900/50 text-orange-300",
  REPAIRING: "bg-blue-900/50 text-blue-300",
  COMPLETED: "bg-green-900/50 text-green-300",
  DELIVERED: "bg-emerald-900/50 text-emerald-300",
  CANCELLED: "bg-red-900/50 text-red-300",
};

export default function SearchJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (status) params.append("status", status);
      if (type) params.append("type", type);

      const res = await fetch(`/api/technician/search?${params.toString()}`);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">ค้นหางานซ่อม</h1>
        <p className="text-slate-400">ค้นหาตามเลขที่ใบรับซ่อม, ชื่อลูกค้า, หรือเบอร์โทรศัพท์</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหา..."
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
          />
          
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">ทุกสถานะ</option>
            {Object.entries(STATUS_MAP).map(([key, val]) => (
              <option key={key} value={key}>{val}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="">ทุกอุปกรณ์</option>
            <option value="PC">PC</option>
            <option value="NOTEBOOK">Notebook</option>
            <option value="PRINTER">Printer</option>
            <option value="OTHER">Other</option>
          </select>

          <button 
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-cyan-900/20"
          >
            ค้นหา
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12 text-cyan-500">กำลังโหลด...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Link href={`/technician/repair-jobs/${job.id}`} key={job.id} className="block group">
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/50 transition-colors h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xl font-bold text-cyan-400 group-hover:text-cyan-300 transition-colors">{job.ticketNumber}</div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium border border-transparent ${STATUS_COLOR_MAP[job.status] || "bg-slate-800 text-slate-300"}`}>
                        {STATUS_MAP[job.status] || job.status}
                      </div>
                    </div>
                    
                    <div className="space-y-2 flex-1 mb-4">
                      <div>
                        <div className="text-xs text-slate-500">ลูกค้า</div>
                        <div className="text-sm text-slate-300">{job.customer.name} ({job.customer.phoneNumber})</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">อุปกรณ์</div>
                        <div className="text-sm text-slate-300">{job.deviceType} {job.deviceBrand}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500">อาการเสีย</div>
                        <div className="text-sm text-rose-400/90 line-clamp-2">{job.description}</div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
                      <span>{format(new Date(job.createdAt), "dd MMM yy", { locale: th })}</span>
                      <span className="text-cyan-600 group-hover:text-cyan-500 transition-colors">ดูรายละเอียด &rarr;</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-500 bg-slate-950 rounded-2xl border border-slate-800">
                ไม่พบงานซ่อมที่ตรงกับเงื่อนไข
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

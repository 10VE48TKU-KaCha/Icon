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
  RECEIVED: "bg-slate-800/80 text-slate-300 border-slate-700",
  DIAGNOSING: "bg-amber-950/60 text-amber-300 border-amber-500/30",
  WAITING_PARTS: "bg-orange-950/60 text-orange-300 border-orange-500/30",
  REPAIRING: "bg-blue-950/60 text-blue-300 border-blue-500/30",
  COMPLETED: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30",
  DELIVERED: "bg-teal-950/60 text-teal-300 border-teal-500/30",
  CANCELLED: "bg-rose-950/60 text-rose-300 border-rose-500/30",
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
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setJobs([]);
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

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "PC":
        return (
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case "NOTEBOOK":
        return (
          <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case "PRINTER":
        return (
          <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title with Icon */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">ค้นหางานซ่อม</h1>
          <p className="text-sm text-emerald-300/70">ค้นหาตามเลขที่ใบรับซ่อม, ชื่อลูกค้า, หรือเบอร์โทรศัพท์</p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="bg-emerald-950/30 border border-emerald-500/20 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Keyword Search Input with Icon */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/70">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาเลขใบซ่อม, ชื่อลูกค้า, หรือเบอร์โทร..."
              className="w-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 pl-11 pr-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-all placeholder:text-emerald-500/50 text-sm"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative md:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="" className="bg-emerald-950 text-emerald-200">ทุกสถานะ</option>
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <option key={key} value={key} className="bg-emerald-950 text-emerald-200">
                  {val}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-400/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Device Type Dropdown */}
          <div className="relative md:w-44">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-100 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-400 transition-all text-sm appearance-none cursor-pointer"
            >
              <option value="" className="bg-emerald-950 text-emerald-200">ทุกอุปกรณ์</option>
              <option value="PC" className="bg-emerald-950 text-emerald-200">PC Computer</option>
              <option value="NOTEBOOK" className="bg-emerald-950 text-emerald-200">Notebook</option>
              <option value="PRINTER" className="bg-emerald-950 text-emerald-200">Printer</option>
              <option value="OTHER" className="bg-emerald-950 text-emerald-200">Other (อื่นๆ)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-emerald-400/70">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-7 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 text-sm cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>ค้นหา</span>
          </button>
        </form>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-emerald-400 space-y-3">
            <svg className="w-8 h-8 animate-spin text-emerald-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-sm font-medium">กำลังค้นหาข้อมูล...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Link href={`/technician/repair-jobs/${job.id}`} key={job.id} className="block group">
                  <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-2xl p-5 hover:border-emerald-400/60 hover:bg-emerald-900/30 transition-all duration-300 h-full flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-emerald-950/50">
                    <div>
                      {/* Ticket Header & Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h10M7 12h10m-8 5h8" />
                            </svg>
                          </span>
                          <span className="text-lg font-extrabold text-emerald-300 group-hover:text-emerald-200 transition-colors">
                            {job.ticketNumber}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLOR_MAP[job.status] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                          {STATUS_MAP[job.status] || job.status}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-3 mb-4 text-xs">
                        {/* Customer */}
                        <div className="flex items-start space-x-2.5">
                          <span className="text-emerald-400 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </span>
                          <div>
                            <div className="text-[11px] text-emerald-400/60 font-medium">ลูกค้า</div>
                            <div className="text-emerald-100 font-medium">
                              {job.customer?.name || "-"} <span className="text-emerald-400/80">({job.customer?.phoneNumber || "-"})</span>
                            </div>
                          </div>
                        </div>

                        {/* Device */}
                        <div className="flex items-start space-x-2.5">
                          <span className="mt-0.5">
                            {getDeviceIcon(job.deviceType)}
                          </span>
                          <div>
                            <div className="text-[11px] text-emerald-400/60 font-medium">อุปกรณ์</div>
                            <div className="text-emerald-100 font-medium">
                              {job.deviceType} - {job.deviceBrand} {job.deviceModel || ""}
                            </div>
                          </div>
                        </div>

                        {/* Issue Description */}
                        <div className="flex items-start space-x-2.5">
                          <span className="text-rose-400/80 mt-0.5">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </span>
                          <div>
                            <div className="text-[11px] text-emerald-400/60 font-medium">อาการเสีย</div>
                            <div className="text-rose-300/90 font-medium line-clamp-2">
                              {job.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Date & Arrow */}
                    <div className="pt-3 border-t border-emerald-500/20 flex justify-between items-center text-[11px] text-emerald-400/70">
                      <div className="flex items-center space-x-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{format(new Date(job.createdAt), "dd MMM yyyy", { locale: th })}</span>
                      </div>
                      <span className="text-emerald-300 font-semibold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>รายละเอียด</span>
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-emerald-400/60 bg-emerald-950/40 rounded-2xl border border-emerald-500/20 flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500/50">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm font-medium">ไม่พบงานซ่อมที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


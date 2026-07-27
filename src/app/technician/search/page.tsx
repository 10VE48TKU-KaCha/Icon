"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Search, Monitor, Laptop, Printer as PrinterIcon, Cpu, User, ArrowRight, AlertTriangle, Calendar } from "lucide-react";

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
        return <Monitor className="w-4 h-4 text-emerald-600" />;
      case "NOTEBOOK":
        return <Laptop className="w-4 h-4 text-emerald-600" />;
      case "PRINTER":
        return <PrinterIcon className="w-4 h-4 text-emerald-600" />;
      default:
        return <Cpu className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Page Title */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <Search className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">ค้นหางานซ่อม (Search Repair Jobs)</h1>
          <p className="text-sm text-slate-500 font-medium">ค้นหาตามเลขที่ใบรับซ่อม, ชื่อลูกค้า, หรือเบอร์โทรศัพท์</p>
        </div>
      </div>

      {/* Main Search Panel */}
      <div className="glass-card p-5 md:p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Keyword Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="ค้นหาเลขใบซ่อม, ชื่อลูกค้า, หรือเบอร์โทร..."
              className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative md:w-48">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium cursor-pointer"
            >
              <option value="">ทุกสถานะ</option>
              {Object.entries(STATUS_MAP).map(([key, val]) => (
                <option key={key} value={key}>
                  {val}
                </option>
              ))}
            </select>
          </div>

          {/* Device Type Dropdown */}
          <div className="relative md:w-44">
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium cursor-pointer"
            >
              <option value="">ทุกอุปกรณ์</option>
              <option value="PC">PC Computer</option>
              <option value="NOTEBOOK">Notebook</option>
              <option value="PRINTER">Printer</option>
              <option value="OTHER">Other (อื่นๆ)</option>
            </select>
          </div>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="btn-primary font-bold px-7 py-2.5 rounded-xl flex items-center justify-center space-x-2 text-sm shadow-md cursor-pointer whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            <span>ค้นหา</span>
          </button>
        </form>

        {/* Results Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-emerald-700 space-y-3">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">กำลังค้นหาข้อมูล...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Link href={`/technician/repair-jobs/${job.id}`} key={job.id} className="block group">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-emerald-300 hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
                    <div>
                      {/* Ticket Header & Status Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-extrabold text-emerald-700 font-mono tracking-wide group-hover:text-emerald-800 transition-colors">
                            {job.ticketNumber}
                          </span>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLOR_MAP[job.status] || "bg-slate-100 text-slate-700"}`}>
                          {STATUS_MAP[job.status] || job.status}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="space-y-3 mb-4 text-xs">
                        {/* Customer */}
                        <div className="flex items-start space-x-2.5">
                          <User className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase">ลูกค้า</div>
                            <div className="text-slate-900 font-bold">
                              {job.customer?.name || "-"} <span className="text-emerald-700 font-mono">({job.customer?.phoneNumber || "-"})</span>
                            </div>
                          </div>
                        </div>

                        {/* Device */}
                        <div className="flex items-start space-x-2.5">
                          <span className="mt-0.5 flex-shrink-0">
                            {getDeviceIcon(job.deviceType)}
                          </span>
                          <div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase">อุปกรณ์</div>
                            <div className="text-slate-800 font-semibold">
                              {job.deviceType} - {job.deviceBrand} {job.deviceModel || ""}
                            </div>
                          </div>
                        </div>

                        {/* Issue Description */}
                        <div className="flex items-start space-x-2.5">
                          <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="text-[11px] text-slate-400 font-bold uppercase">อาการเสีย</div>
                            <div className="text-slate-800 font-medium line-clamp-2">
                              {job.description}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Date & Arrow */}
                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                      <div className="flex items-center space-x-1.5 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{format(new Date(job.createdAt), "dd MMM yyyy", { locale: th })}</span>
                      </div>
                      <span className="text-emerald-700 font-bold flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>รายละเอียด</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12 glass-card text-slate-400 font-medium flex flex-col items-center justify-center space-y-2">
                <Search className="w-8 h-8 text-slate-300" />
                <p>ไม่พบงานซ่อมที่ตรงกับเงื่อนไขการค้นหา</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

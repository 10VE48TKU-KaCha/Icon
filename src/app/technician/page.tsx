"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Plus, Search, Clock, Wrench, CheckCircle2, LayoutDashboard, ArrowRight } from "lucide-react";

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

export default function TechnicianDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/technician/dashboard")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard data", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-emerald-700 font-medium space-x-2">
        <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <span>กำลังโหลดข้อมูล...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-slate-800">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <LayoutDashboard className="w-7 h-7 text-emerald-600" />
          <span>ภาพรวมระบบงานซ่อม (Technician Dashboard)</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">สรุปข้อมูลสถานะงานซ่อมปัจจุบันของช่างประจำศูนย์</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Link href="/technician/repair-jobs/new" className="btn-primary px-6 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-md">
          <Plus className="w-4 h-4" />
          <span>+ เปิดบิลรับซ่อมใหม่</span>
        </Link>
        <Link href="/technician/search" className="bg-white hover:bg-slate-50 text-slate-800 px-6 py-3 rounded-xl font-bold text-sm border border-slate-300 transition flex items-center space-x-2 shadow-xs">
          <Search className="w-4 h-4 text-slate-500" />
          <span>ค้นหางานซ่อม</span>
        </Link>
      </div>

      {/* Summary Cards */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold">งานรอดำเนินการ</span>
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-amber-600 mt-2">{data.summary.pending}</div>
          </div>
          
          <div className="glass-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold">กำลังซ่อม</span>
              <Wrench className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-600 mt-2">{data.summary.repairing}</div>
          </div>
          
          <div className="glass-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs uppercase font-bold">ซ่อมเสร็จวันนี้</span>
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-700 mt-2">{data.summary.completedToday}</div>
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Wrench className="w-5 h-5 text-emerald-600" />
          <span>งานซ่อมล่าสุดของคุณ</span>
        </h2>

        {data?.recentJobs?.length > 0 ? (
          <div className="glass-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                    <th className="px-6 py-4">เลขที่ใบรับซ่อม</th>
                    <th className="px-6 py-4">ลูกค้า</th>
                    <th className="px-6 py-4">อุปกรณ์</th>
                    <th className="px-6 py-4">สถานะ</th>
                    <th className="px-6 py-4">อัปเดตล่าสุด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {data.recentJobs.map((job: any) => (
                    <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-extrabold">
                        <Link href={`/technician/repair-jobs/${job.id}`} className="text-emerald-700 hover:text-emerald-800 flex items-center space-x-1">
                          <span>{job.ticketNumber}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-bold">
                        {job.customer.name}
                        <div className="text-xs text-slate-500 font-mono font-normal">{job.customer.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-medium">
                        {job.deviceType} {job.deviceBrand}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLOR_MAP[job.status] || "bg-slate-100 text-slate-700"}`}>
                          {STATUS_MAP[job.status] || job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {format(new Date(job.updatedAt), "dd MMM yyyy HH:mm", { locale: th })} น.
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 glass-card text-slate-400 font-medium">
            ยังไม่มีประวัติงานซ่อม
          </div>
        )}
      </div>
    </div>
  );
}

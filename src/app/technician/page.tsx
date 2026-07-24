"use client";

import { useEffect, useState } from "react";
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
    return <div className="flex justify-center items-center h-64 text-cyan-500">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">ภาพรวมระบบงานซ่อม</h1>
        <p className="text-slate-400">สรุปข้อมูลสถานะงานซ่อมปัจจุบัน</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <Link href="/technician/repair-jobs/new" className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-cyan-900/20">
          + เปิดบิลใหม่
        </Link>
        <Link href="/technician/search" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-slate-700">
          ค้นหางานซ่อม
        </Link>
      </div>

      {/* Summary Cards */}
      {data?.summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl">⏱</span></div>
            <div className="text-slate-400 text-sm font-medium mb-2">งานรอดำเนินการ</div>
            <div className="text-4xl font-bold text-white">{data.summary.pending}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl">🔧</span></div>
            <div className="text-slate-400 text-sm font-medium mb-2">กำลังซ่อม</div>
            <div className="text-4xl font-bold text-cyan-400">{data.summary.repairing}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><span className="text-6xl">✅</span></div>
            <div className="text-slate-400 text-sm font-medium mb-2">ซ่อมเสร็จวันนี้</div>
            <div className="text-4xl font-bold text-emerald-400">{data.summary.completedToday}</div>
          </div>
        </div>
      )}

      {/* Recent Jobs */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-6">งานซ่อมล่าสุดของคุณ</h2>
        {data?.recentJobs?.length > 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                    <th className="px-6 py-4 font-medium">เลขที่ใบรับซ่อม</th>
                    <th className="px-6 py-4 font-medium">ลูกค้า</th>
                    <th className="px-6 py-4 font-medium">อุปกรณ์</th>
                    <th className="px-6 py-4 font-medium">สถานะ</th>
                    <th className="px-6 py-4 font-medium">อัปเดตล่าสุด</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {data.recentJobs.map((job: any) => (
                    <tr key={job.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/technician/repair-jobs/${job.id}`} className="text-cyan-400 hover:text-cyan-300 font-medium">
                          {job.ticketNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {job.customer.name}
                        <div className="text-xs text-slate-500 mt-1">{job.customer.phoneNumber}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {job.deviceType} {job.deviceBrand}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border border-transparent ${STATUS_COLOR_MAP[job.status] || "bg-slate-800 text-slate-300"}`}>
                          {STATUS_MAP[job.status] || job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-sm">
                        {format(new Date(job.updatedAt), "dd MMM yyyy HH:mm", { locale: th })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500">
            ยังไม่มีประวัติงานซ่อม
          </div>
        )}
      </div>
    </div>
  );
}

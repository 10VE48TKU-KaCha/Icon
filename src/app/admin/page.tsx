'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="text-center py-24 text-emerald-300 font-medium flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>กำลังโหลดข้อมูลภาพรวมระบบ...</span>
    </div>
  );

  if (!data) return null;

  const COLORS = ['#10b981', '#059669', '#34d399', '#f59e0b', '#0284c7', '#7c3aed', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide">📊 ภาพรวมระบบงานซ่อม</h2>
          <p className="text-sm text-emerald-200/70">สรุปข้อมูลสถิติ รายได้ และงานซ่อมทั้งหมดในระบบ</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
          <p className="text-emerald-200/70 text-xs uppercase font-semibold">งานซ่อมทั้งหมด</p>
          <p className="text-3xl font-black text-white mt-2">{data.summary?.totalJobs || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
          <p className="text-emerald-200/70 text-xs uppercase font-semibold">รอดำเนินการ</p>
          <p className="text-3xl font-black text-amber-300 mt-2">{data.summary?.pendingJobs || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
          <p className="text-emerald-200/70 text-xs uppercase font-semibold">ซ่อมเสร็จแล้ว</p>
          <p className="text-3xl font-black text-emerald-400 mt-2">{data.summary?.completedJobs || 0}</p>
        </div>
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
          <p className="text-emerald-200/70 text-xs uppercase font-semibold">รายได้รวม</p>
          <p className="text-3xl font-black text-emerald-300 mt-2">฿{(data.summary?.revenue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Monthly Trend Chart */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>📈</span>
            <span>งานซ่อมรายเดือน</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrends ? [...data.monthlyTrends].reverse() : []}>
                <XAxis dataKey="month" stroke="#a7f3d0" fontSize={12} />
                <YAxis stroke="#a7f3d0" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f3e30', borderColor: '#10b981', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span>🍕</span>
            <span>สัดส่วนสถานะงานซ่อม</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.statusCounts || []} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                  {(data.statusCounts || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f3e30', borderColor: '#10b981', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technician Stats Table */}
      <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 shadow-lg mt-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span>🏆</span>
          <span>สถิติยอดงานซ่อมของช่าง</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-emerald-200/80 border-b border-emerald-500/20 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">ชื่อช่างซ่อม</th>
                <th className="pb-3 font-semibold text-right">จำนวนงานซ่อมที่สำเร็จ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-sm">
              {(data.technicianStats || []).map((tech: any) => (
                <tr key={tech.id} className="hover:bg-emerald-900/20 transition-colors">
                  <td className="py-4 text-white font-medium">{tech.name}</td>
                  <td className="py-4 text-right text-emerald-300 font-black text-base">{tech.count} งาน</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

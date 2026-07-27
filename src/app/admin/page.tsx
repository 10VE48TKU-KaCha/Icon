'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, PieChart as PieIcon, Trophy, Wrench, Clock, CheckCircle2, DollarSign } from 'lucide-react';

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
    <div className="text-center py-24 text-emerald-700 font-medium flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span>กำลังโหลดข้อมูลภาพรวมระบบ...</span>
    </div>
  );

  if (!data) return null;

  const COLORS = ['#059669', '#10b981', '#34d399', '#f59e0b', '#0284c7', '#7c3aed', '#64748b'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-emerald-600" />
            <span>ภาพรวมระบบงานซ่อม (System Dashboard)</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">สรุปข้อมูลสถิติ รายได้ และงานซ่อมทั้งหมดในระบบ</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs uppercase font-bold">งานซ่อมทั้งหมด</p>
            <Wrench className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{data.summary?.totalJobs || 0}</p>
        </div>

        <div className="glass-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs uppercase font-bold">รอดำเนินการ</p>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{data.summary?.pendingJobs || 0}</p>
        </div>

        <div className="glass-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs uppercase font-bold">ซ่อมเสร็จแล้ว</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{data.summary?.completedJobs || 0}</p>
        </div>

        <div className="glass-card p-6 shadow-sm bg-gradient-to-br from-emerald-50/60 to-white">
          <div className="flex items-center justify-between">
            <p className="text-emerald-700 text-xs uppercase font-bold">รายได้รวม</p>
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-700 mt-2">฿{(data.summary?.revenue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Monthly Trend Chart */}
        <div className="glass-card p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>งานซ่อมรายเดือน</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrends ? [...data.monthlyTrends].reverse() : []}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="glass-card p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-emerald-600" />
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
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '12px', color: '#0f172a', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Technician Stats Table */}
      <div className="glass-card p-6 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-emerald-600" />
          <span>สถิติยอดงานซ่อมของช่าง</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-100 text-xs uppercase tracking-wider">
                <th className="pb-3 font-bold">ชื่อช่างซ่อม</th>
                <th className="pb-3 font-bold text-right">จำนวนงานซ่อมที่สำเร็จ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {(data.technicianStats || []).map((tech: any) => (
                <tr key={tech.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 text-slate-900 font-semibold">{tech.name}</td>
                  <td className="py-4 text-right text-emerald-700 font-black text-base">{tech.count} งาน</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

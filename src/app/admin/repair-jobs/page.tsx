'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';

const STATUS_MAP: Record<string, string> = {
  RECEIVED: 'รับเครื่อง',
  DIAGNOSING: 'กำลังตรวจสอบ',
  WAITING_PARTS: 'รออะไหล่',
  REPAIRING: 'กำลังซ่อม',
  COMPLETED: 'ซ่อมเสร็จ',
  DELIVERED: 'ส่งมอบแล้ว',
  CANCELLED: 'ยกเลิก',
};

export default function AdminRepairJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/repair-jobs?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search]);

  const viewDetails = (job: any) => {
    Swal.fire({
      title: `รายละเอียดงานซ่อม ${job.ticketNumber}`,
      html: `
        <div class="text-left space-y-2 mt-4 text-emerald-100 text-sm">
          <p><strong>ลูกค้า:</strong> ${job.customer?.name} (${job.customer?.phoneNumber})</p>
          <p><strong>อุปกรณ์:</strong> ${job.deviceType} ${job.deviceBrand} ${job.deviceModel || ''}</p>
          <p><strong>อาการเสีย:</strong> ${job.description}</p>
          <p><strong>สถานะ:</strong> <span class="text-emerald-300 font-bold">${STATUS_MAP[job.status] || job.status}</span></p>
          <p><strong>ค่าซ่อมรวม:</strong> ฿${(job.totalCost || 0).toLocaleString()}</p>
          <p><strong>ช่างผู้รับผิดชอบ:</strong> ${job.technician?.name || '-'}</p>
        </div>
      `,
      background: '#0f3e30',
      color: '#fff',
      confirmButtonColor: '#10b981',
      confirmButtonText: 'ปิดหน้าต่าง'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <span>🔧</span>
            <span>รายการงานซ่อมทั้งหมด</span>
          </h2>
          <p className="text-sm text-emerald-200/70">ติดตามและตรวจสอบรายการงานซ่อมแซมเครื่องลูกค้ารายบุคคล</p>
        </div>

        <input 
          type="text" 
          placeholder="🔍 ค้นหาเลขที่, ชื่อ, เบอร์โทร..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-emerald-950/80 border border-emerald-500/30 text-white rounded-xl px-4 py-2.5 w-full sm:w-72 focus:outline-none focus:border-emerald-400 placeholder:text-emerald-300/40 text-sm"
        />
      </div>

      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-emerald-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-emerald-950/70 text-emerald-200/90 text-xs uppercase tracking-wider border-b border-emerald-500/20">
              <tr>
                <th className="px-6 py-4 font-semibold">เลขที่งาน</th>
                <th className="px-6 py-4 font-semibold">วันที่รับ</th>
                <th className="px-6 py-4 font-semibold">ลูกค้า</th>
                <th className="px-6 py-4 font-semibold">อุปกรณ์</th>
                <th className="px-6 py-4 font-semibold">สถานะ</th>
                <th className="px-6 py-4 font-semibold">ช่างรับผิดชอบ</th>
                <th className="px-6 py-4 font-semibold text-right">ยอดรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-emerald-300/70 font-medium">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังโหลดรายการงานซ่อม...</span>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-emerald-300/60 font-medium">
                    ไม่พบรายการงานซ่อม
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => viewDetails(job)}
                    className="hover:bg-emerald-900/20 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-emerald-300 font-mono font-bold">{job.ticketNumber}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{format(new Date(job.createdAt), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4 text-white font-medium">
                      <div>{job.customer?.name}</div>
                      <div className="text-xs text-emerald-300/60 font-mono">{job.customer?.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-emerald-100">{job.deviceType} - {job.deviceBrand}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg text-xs font-semibold border border-emerald-500/30">
                        {STATUS_MAP[job.status] || job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-100">{job.technician?.name || '-'}</td>
                    <td className="px-6 py-4 text-right font-black text-emerald-300">฿{(job.totalCost || 0).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

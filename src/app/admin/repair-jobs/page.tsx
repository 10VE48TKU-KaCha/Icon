'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Wrench, Search, FileText } from 'lucide-react';

const STATUS_MAP: Record<string, string> = {
  RECEIVED: 'รับเครื่อง',
  DIAGNOSING: 'กำลังตรวจสอบ',
  WAITING_PARTS: 'รออะไหล่',
  REPAIRING: 'กำลังซ่อม',
  COMPLETED: 'ซ่อมเสร็จ',
  DELIVERED: 'ส่งมอบแล้ว',
  CANCELLED: 'ยกเลิก',
};

const STATUS_COLOR_MAP: Record<string, string> = {
  RECEIVED: 'badge-received',
  DIAGNOSING: 'badge-diagnosing',
  WAITING_PARTS: 'badge-waiting',
  REPAIRING: 'badge-repairing',
  COMPLETED: 'badge-completed',
  DELIVERED: 'badge-delivered',
  CANCELLED: 'badge-cancelled',
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
        <div class="text-left space-y-2 mt-4 text-slate-800 text-sm font-sans">
          <p><strong>ลูกค้า:</strong> ${job.customer?.name} (${job.customer?.phoneNumber})</p>
          <p><strong>อุปกรณ์:</strong> ${job.deviceType} ${job.deviceBrand} ${job.deviceModel || ''}</p>
          <p><strong>อาการเสีย:</strong> ${job.description}</p>
          <p><strong>สถานะ:</strong> <span class="text-emerald-700 font-bold">${STATUS_MAP[job.status] || job.status}</span></p>
          <p><strong>ค่าซ่อมรวม:</strong> ฿${(job.totalCost || 0).toLocaleString()}</p>
          <p><strong>ช่างผู้รับผิดชอบ:</strong> ${job.technician?.name || '-'}</p>
        </div>
      `,
      background: '#ffffff',
      color: '#0f172a',
      confirmButtonColor: '#059669',
      confirmButtonText: 'ปิดหน้าต่าง',
      customClass: {
        popup: 'rounded-2xl border border-emerald-200 shadow-xl'
      }
    });
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-7 h-7 text-emerald-600" />
            <span>รายการงานซ่อมทั้งหมด (Repair Jobs)</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">ติดตามและตรวจสอบรายการงานซ่อมแซมเครื่องลูกค้ารายบุคคล</p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="ค้นหาเลขที่, ชื่อ, เบอร์โทร..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white border border-slate-300 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 w-full focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 placeholder:text-slate-400 text-sm font-medium shadow-xs"
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">เลขที่งาน</th>
                <th className="px-6 py-4">วันที่รับ</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4">อุปกรณ์</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4">ช่างรับผิดชอบ</th>
                <th className="px-6 py-4 text-right">ยอดรวม</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังโหลดรายการงานซ่อม...</span>
                    </div>
                  </td>
                </tr>
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    ไม่พบรายการงานซ่อม
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr 
                    key={job.id} 
                    onClick={() => viewDetails(job)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 text-emerald-700 font-mono font-extrabold">{job.ticketNumber}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{format(new Date(job.createdAt), 'dd/MM/yyyy')}</td>
                    <td className="px-6 py-4 text-slate-900 font-bold">
                      <div>{job.customer?.name}</div>
                      <div className="text-xs text-slate-500 font-mono font-normal">{job.customer?.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{job.deviceType} - {job.deviceBrand}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLOR_MAP[job.status] || 'bg-slate-100 text-slate-700'}`}>
                        {STATUS_MAP[job.status] || job.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{job.technician?.name || '-'}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-emerald-700 font-mono">฿{(job.totalCost || 0).toLocaleString()}</td>
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

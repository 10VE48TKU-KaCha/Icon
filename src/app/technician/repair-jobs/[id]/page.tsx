"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { th } from "date-fns/locale";

const STATUS_OPTIONS = [
  { value: "RECEIVED", label: "รับเครื่อง" },
  { value: "DIAGNOSING", label: "กำลังตรวจสอบ" },
  { value: "WAITING_PARTS", label: "รออะไหล่" },
  { value: "REPAIRING", label: "กำลังซ่อม" },
  { value: "COMPLETED", label: "ซ่อมเสร็จ" },
  { value: "DELIVERED", label: "ส่งมอบแล้ว" },
  { value: "CANCELLED", label: "ยกเลิก" },
];

export default function RepairJobDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    status: "",
    diagnosis: "",
    partsCost: 0,
    serviceCost: 0,
    notes: "",
  });

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/technician/repair-jobs/${params.id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setJob(data);
      setFormData({
        status: data.status,
        diagnosis: data.diagnosis || "",
        partsCost: data.partsCost || 0,
        serviceCost: data.serviceCost || 0,
        notes: data.notes || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "ยืนยันการอัปเดต",
      text: "คุณต้องการบันทึกการเปลี่ยนแปลงใช่หรือไม่?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "บันทึก",
      cancelButtonText: "ยกเลิก",
      background: "#0f172a",
      color: "#f8fafc",
      confirmButtonColor: "#0891b2",
      cancelButtonColor: "#334155",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/technician/repair-jobs/${params.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            partsCost: Number(formData.partsCost),
            serviceCost: Number(formData.serviceCost),
          }),
        });

        if (!res.ok) throw new Error("บันทึกล้มเหลว");

        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#0891b2",
          timer: 1500,
        });
        
        fetchJob();
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "ผิดพลาด",
          text: error.message,
          background: "#0f172a",
          color: "#f8fafc",
        });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="text-cyan-500 py-12 text-center">กำลังโหลด...</div>;
  if (!job) return <div className="text-red-500 py-12 text-center">ไม่พบข้อมูลงานซ่อม</div>;

  const showCosts = ["COMPLETED", "DELIVERED"].includes(formData.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <button onClick={() => router.back()} className="text-cyan-500 hover:text-cyan-400 mb-2 inline-block">
            &larr; กลับ
          </button>
          <h1 className="text-3xl font-bold text-white mb-1">รายละเอียดงานซ่อม</h1>
          <p className="text-slate-400">ใบรับซ่อม: <span className="text-cyan-400 font-medium">{job.ticketNumber}</span></p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors border border-slate-700 flex items-center gap-2"
        >
          พิมพ์ใบเสร็จ/ใบรับเครื่อง
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">ข้อมูลลูกค้า</h2>
          <div className="space-y-3">
            <div><span className="text-slate-500 text-sm block">ชื่อ-นามสกุล</span> <span className="text-slate-200">{job.customer.name}</span></div>
            <div><span className="text-slate-500 text-sm block">เบอร์โทรศัพท์</span> <span className="text-cyan-400">{job.customer.phoneNumber}</span></div>
            {job.customer.email && <div><span className="text-slate-500 text-sm block">อีเมล</span> <span className="text-slate-200">{job.customer.email}</span></div>}
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">ข้อมูลอุปกรณ์</h2>
          <div className="space-y-3">
            <div><span className="text-slate-500 text-sm block">ประเภท</span> <span className="text-slate-200">{job.deviceType}</span></div>
            <div><span className="text-slate-500 text-sm block">รุ่น / ยี่ห้อ</span> <span className="text-slate-200">{job.deviceBrand} {job.deviceModel}</span></div>
            <div><span className="text-slate-500 text-sm block">Serial Number</span> <span className="text-slate-200">{job.deviceSerial || '-'}</span></div>
            <div><span className="text-slate-500 text-sm block">อาการเสีย</span> <span className="text-rose-400">{job.description}</span></div>
          </div>
        </div>
      </div>

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl print:hidden">
        <h2 className="text-lg font-semibold text-white mb-4 border-b border-slate-800 pb-2">อัปเดตสถานะงานซ่อม</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-slate-400 mb-2">สถานะปัจจุบัน</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors font-medium"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">ช่างผู้รับผิดชอบ</label>
            <input 
              type="text" 
              value={job.technician.name}
              disabled
              className="w-full bg-slate-950/50 border border-slate-800 text-slate-400 px-4 py-3 rounded-xl cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">ผลการวินิจฉัย / การแก้ไข</label>
          <textarea 
            rows={3}
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
            placeholder="ระบุสาเหตุหรือการดำเนินการแก้ไข..."
          ></textarea>
        </div>

        {showCosts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-4 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <label className="block text-sm text-slate-400 mb-2">ค่าอะไหล่ (บาท)</label>
              <input 
                type="number" 
                min="0"
                value={formData.partsCost}
                onChange={(e) => setFormData({ ...formData, partsCost: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">ค่าบริการ (บาท)</label>
              <input 
                type="number" 
                min="0"
                value={formData.serviceCost}
                onChange={(e) => setFormData({ ...formData, serviceCost: Number(e.target.value) })}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <div className="md:col-span-2 flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-slate-400">ยอดรวมสุทธิ</span>
              <span className="text-2xl font-bold text-emerald-400">฿{(Number(formData.partsCost) + Number(formData.serviceCost)).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">หมายเหตุเพิ่มเติม (ภายใน)</label>
          <textarea 
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-cyan-900/20">
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </form>

      {/* Print View Only */}
      <div className="hidden print:block text-black bg-white p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">ICON MULTIMEDIA</h1>
          <p>ใบรับซ่อม / ใบเสร็จรับเงิน</p>
        </div>
        <div className="flex justify-between mb-8">
          <div>
            <p><strong>ลูกค้า:</strong> {job.customer.name}</p>
            <p><strong>โทร:</strong> {job.customer.phoneNumber}</p>
          </div>
          <div className="text-right">
            <p><strong>เลขที่:</strong> {job.ticketNumber}</p>
            <p><strong>วันที่:</strong> {format(new Date(job.createdAt), "dd/MM/yyyy HH:mm")}</p>
          </div>
        </div>
        <div className="mb-8 border-t border-b py-4">
          <p><strong>อุปกรณ์:</strong> {job.deviceType} {job.deviceBrand} {job.deviceModel}</p>
          <p><strong>S/N:</strong> {job.deviceSerial || '-'}</p>
          <p><strong>อาการเสีย:</strong> {job.description}</p>
        </div>
        {job.totalCost > 0 && (
          <div className="text-right">
            <p>ค่าอะไหล่: {job.partsCost} บาท</p>
            <p>ค่าบริการ: {job.serviceCost} บาท</p>
            <p className="text-xl font-bold mt-2">ยอดรวมสุทธิ: {job.totalCost} บาท</p>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import StatusTimeline from "@/components/StatusTimeline";
import { ArrowLeft, Printer, User, Smartphone, Save, FileText, CheckCircle2 } from "lucide-react";

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
      background: "#ffffff",
      color: "#0f172a",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#94a3b8",
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
          background: "#ffffff",
          color: "#0f172a",
          confirmButtonColor: "#059669",
          timer: 1500,
        });
        
        fetchJob();
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "ผิดพลาด",
          text: error.message,
          background: "#ffffff",
          color: "#0f172a",
        });
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return (
    <div className="text-emerald-700 py-12 text-center font-medium space-x-2 flex justify-center items-center">
      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span>กำลังโหลดข้อมูลงานซ่อม...</span>
    </div>
  );
  if (!job) return <div className="text-red-600 py-12 text-center font-bold">ไม่พบข้อมูลงานซ่อม</div>;

  const showCosts = ["COMPLETED", "DELIVERED"].includes(formData.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <button onClick={() => router.back()} className="text-emerald-700 hover:text-emerald-800 font-bold mb-2 inline-flex items-center space-x-1 text-sm">
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับ</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">รายละเอียดงานซ่อม</h1>
          <p className="text-sm text-slate-500 font-medium">
            ใบรับซ่อม: <span className="text-emerald-700 font-mono font-extrabold">{job.ticketNumber}</span>
          </p>
        </div>
        <button 
          onClick={handlePrint}
          className="bg-white hover:bg-slate-50 text-slate-800 px-5 py-2.5 rounded-xl font-bold text-sm border border-slate-300 transition flex items-center gap-2 shadow-xs"
        >
          <Printer className="w-4 h-4 text-emerald-600" />
          <span>พิมพ์ใบเสร็จ / ใบรับเครื่อง</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="glass-card p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            <User className="w-4 h-4 text-emerald-600" />
            <span>ข้อมูลลูกค้า</span>
          </div>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-400 text-xs font-bold block mb-0.5">ชื่อ-นามสกุล</span> <span className="text-slate-900 font-bold">{job.customer.name}</span></div>
            <div><span className="text-slate-400 text-xs font-bold block mb-0.5">เบอร์โทรศัพท์</span> <span className="text-emerald-700 font-mono font-bold">{job.customer.phoneNumber}</span></div>
            {job.customer.email && <div><span className="text-slate-400 text-xs font-bold block mb-0.5">อีเมล</span> <span className="text-slate-700 font-medium">{job.customer.email}</span></div>}
          </div>
        </div>

        {/* Device Info */}
        <div className="glass-card p-6 shadow-sm">
          <div className="flex items-center space-x-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-4">
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>ข้อมูลอุปกรณ์</span>
          </div>
          <div className="space-y-3 text-sm">
            <div><span className="text-slate-400 text-xs font-bold block mb-0.5">ประเภท</span> <span className="text-slate-900 font-bold">{job.deviceType}</span></div>
            <div><span className="text-slate-400 text-xs font-bold block mb-0.5">รุ่น / ยี่ห้อ</span> <span className="text-slate-900 font-bold">{job.deviceBrand} {job.deviceModel}</span></div>
            <div><span className="text-slate-400 text-xs font-bold block mb-0.5">Serial Number</span> <span className="text-slate-700 font-mono font-medium">{job.deviceSerial || '-'}</span></div>
            <div><span className="text-slate-400 text-xs font-bold block mb-0.5">อาการเสีย</span> <span className="text-red-600 font-bold">{job.description}</span></div>
          </div>
        </div>
      </div>

      {/* Progress Timeline */}
      <StatusTimeline currentStatus={formData.status || job.status} />

      {/* Update Form */}
      <form onSubmit={handleUpdate} className="glass-card p-6 sm:p-8 shadow-sm print:hidden">
        <div className="flex items-center space-x-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6">
          <FileText className="w-5 h-5 text-emerald-600" />
          <span>อัปเดตสถานะงานซ่อม</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">สถานะปัจจุบัน</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-bold"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">ช่างผู้รับผิดชอบ</label>
            <input 
              type="text" 
              value={job.technician.name}
              disabled
              className="w-full bg-slate-100 border border-slate-200 text-slate-600 px-4 py-3 rounded-xl font-bold text-sm cursor-not-allowed"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">ผลการวินิจฉัย / การแก้ไข</label>
          <textarea 
            rows={3}
            value={formData.diagnosis}
            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium resize-none"
            placeholder="ระบุสาเหตุหรือการดำเนินการแก้ไข..."
          ></textarea>
        </div>

        {showCosts && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 p-5 bg-emerald-50/60 rounded-2xl border border-emerald-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ค่าอะไหล่ (บาท)</label>
              <input 
                type="number" 
                min="0"
                value={formData.partsCost}
                onChange={(e) => setFormData({ ...formData, partsCost: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 font-bold font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ค่าบริการ (บาท)</label>
              <input 
                type="number" 
                min="0"
                value={formData.serviceCost}
                onChange={(e) => setFormData({ ...formData, serviceCost: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 font-bold font-mono text-sm"
              />
            </div>
            <div className="md:col-span-2 flex justify-between items-center pt-3 border-t border-emerald-200">
              <span className="font-bold text-slate-900 text-sm">ยอดรวมสุทธิ</span>
              <span className="text-2xl font-black text-emerald-700 font-mono">฿{(Number(formData.partsCost) + Number(formData.serviceCost)).toLocaleString()}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">หมายเหตุเพิ่มเติม (ภายใน)</label>
          <textarea 
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium resize-none"
          ></textarea>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" className="btn-primary px-8 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-md">
            <Save className="w-4 h-4" />
            <span>บันทึกการเปลี่ยนแปลง</span>
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

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import StatusTimeline from "@/components/StatusTimeline";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Receipt, 
  Smartphone, 
  Calendar, 
  FileText, 
  Stethoscope, 
  DollarSign, 
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

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

export default async function TrackResultsPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone } = await params;
  const decodedPhone = decodeURIComponent(phone);

  const customer = await prisma.customer.findUnique({
    where: { phoneNumber: decodedPhone },
    include: {
      repairJobs: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 sm:p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 font-semibold mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>กลับหน้าหลัก (Back to Home)</span>
        </Link>

        {customer ? (
          <>
            {/* Customer Information Card */}
            <div className="glass-card p-6 sm:p-8 mb-8 shadow-sm">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">ข้อมูลลูกค้า</h1>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">ชื่อ-นามสกุล</span>
                  <span className="font-bold text-slate-900 text-base">{customer.name}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                  <span className="text-slate-400 text-xs font-semibold uppercase block mb-1">เบอร์โทรศัพท์</span>
                  <span className="font-mono font-bold text-emerald-700 text-base flex items-center space-x-1.5">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{customer.phoneNumber}</span>
                  </span>
                </div>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-bold mb-6 text-slate-900 flex items-center space-x-2">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>ประวัติงานซ่อมทั้งหมด ({customer.repairJobs.length} รายการ)</span>
            </h2>
            
            {customer.repairJobs.length > 0 ? (
              <div className="space-y-6">
                {customer.repairJobs.map((job) => (
                  <div key={job.id} className="glass-card p-6 sm:p-8 shadow-md">
                    {/* Job Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase block mb-1">เลขที่ใบรับซ่อม</span>
                        <span className="text-2xl font-black text-emerald-700 font-mono tracking-wide">{job.ticketNumber}</span>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold ${STATUS_COLOR_MAP[job.status] || "bg-slate-100 text-slate-700"}`}>
                        {STATUS_MAP[job.status] || job.status}
                      </div>
                    </div>

                    {/* Progress Timeline */}
                    <StatusTimeline currentStatus={job.status} />

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase mb-1">
                          <Smartphone className="w-4 h-4 text-emerald-600" />
                          <span>อุปกรณ์ (Device Info)</span>
                        </div>
                        <div className="text-slate-900 font-bold text-base">{job.deviceType} {job.deviceBrand}</div>
                        {(job.deviceModel || job.deviceSerial) && (
                          <div className="text-xs text-slate-500 mt-1 font-medium">
                            รุ่น: {job.deviceModel} {job.deviceSerial && `(S/N: ${job.deviceSerial})`}
                          </div>
                        )}
                      </div>
                      
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase mb-1">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          <span>อาการเสียที่ได้รับแจ้ง</span>
                        </div>
                        <div className="text-slate-800 font-medium">{job.description}</div>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase mb-1">
                          <Calendar className="w-4 h-4 text-emerald-600" />
                          <span>วันที่รับเครื่องเข้าระบบ</span>
                        </div>
                        <div className="text-slate-800 font-medium">
                          {format(new Date(job.createdAt), "dd MMMM yyyy HH:mm", { locale: th })} น.
                        </div>
                      </div>

                      {job.diagnosis && (
                        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/60">
                          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 uppercase mb-1">
                            <Stethoscope className="w-4 h-4 text-emerald-600" />
                            <span>ผลการวินิจฉัยช่างซ่อม</span>
                          </div>
                          <div className="text-slate-900 font-medium">{job.diagnosis}</div>
                        </div>
                      )}
                    </div>

                    {/* Receipt Breakdown Box */}
                    {['COMPLETED', 'DELIVERED'].includes(job.status) && (
                      <div className="bg-gradient-to-r from-emerald-50 via-teal-50/40 to-emerald-50 rounded-2xl p-6 mt-6 border border-emerald-200 shadow-xs">
                        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 mb-4 uppercase tracking-wider">
                          <DollarSign className="w-4 h-4 text-emerald-600" />
                          <span>รายละเอียดค่าใช้จ่าย (Receipt & Billing Breakdown)</span>
                        </div>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between text-slate-600">
                            <span>ค่าอะไหล่ (Parts Fee)</span>
                            <span className="font-semibold text-slate-800">฿{job.partsCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-slate-600">
                            <span>ค่าบริการ/ค่าซ่อม (Service Fee)</span>
                            <span className="font-semibold text-slate-800">฿{job.serviceCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3.5 mt-2 border-t border-emerald-200">
                            <span className="font-extrabold text-slate-900 text-base">ยอดชำระสุทธิ (Total Net Payment)</span>
                            <span className="text-2xl font-black text-emerald-700 font-mono">฿{job.totalCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-500 py-12 glass-card">
                ไม่มีประวัติงานซ่อม
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 glass-card">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">ไม่พบข้อมูลลูกค้า</h2>
            <p className="text-slate-500">ไม่พบประวัติงานซ่อมสำหรับเบอร์โทรศัพท์ {decodedPhone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

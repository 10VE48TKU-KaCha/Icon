import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import StatusTimeline from "@/components/StatusTimeline";

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
  RECEIVED: "bg-sky-950/80 text-sky-300 border-sky-500/30",
  DIAGNOSING: "bg-purple-950/80 text-purple-300 border-purple-500/30",
  WAITING_PARTS: "bg-amber-950/80 text-amber-300 border-amber-500/30",
  REPAIRING: "bg-emerald-950/80 text-emerald-300 border-emerald-500/30",
  COMPLETED: "bg-emerald-600 text-white font-bold",
  DELIVERED: "bg-slate-800 text-slate-300 border-slate-700",
  CANCELLED: "bg-red-950/80 text-red-300 border-red-500/30",
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
    <div className="min-h-screen bg-[#041d14] text-emerald-100 font-sans p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 mb-8 transition-colors font-medium">
          &larr; กลับหน้าหลัก
        </Link>

        {customer ? (
          <>
            <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 shadow-xl mb-8">
              <h1 className="text-2xl font-bold text-white mb-3">ข้อมูลลูกค้า</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-emerald-200">
                <div><span className="text-emerald-300/60 text-xs font-semibold uppercase block mb-1">ชื่อ-นามสกุล</span> <span className="font-semibold text-white">{customer.name}</span></div>
                <div><span className="text-emerald-300/60 text-xs font-semibold uppercase block mb-1">เบอร์โทรศัพท์</span> <span className="font-mono text-emerald-300">{customer.phoneNumber}</span></div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-6 text-white">ประวัติงานซ่อมทั้งหมด</h2>
            
            {customer.repairJobs.length > 0 ? (
              <div className="space-y-6">
                {customer.repairJobs.map((job) => (
                  <div key={job.id} className="glass-card rounded-2xl p-6 border border-emerald-500/30 shadow-lg">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-emerald-500/20">
                      <div>
                        <span className="text-xs text-emerald-300/70 uppercase font-semibold block mb-1">เลขที่ใบรับซ่อม</span>
                        <span className="text-2xl font-black text-emerald-300 font-mono tracking-wide">{job.ticketNumber}</span>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-bold border ${STATUS_COLOR_MAP[job.status] || "bg-emerald-950 text-emerald-300"}`}>
                        {STATUS_MAP[job.status] || job.status}
                      </div>
                    </div>

                    <StatusTimeline currentStatus={job.status} />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
                      <div>
                        <div className="text-xs text-emerald-300/70 font-semibold mb-1">อุปกรณ์</div>
                        <div className="text-white font-medium">{job.deviceType} {job.deviceBrand}</div>
                        {(job.deviceModel || job.deviceSerial) && (
                          <div className="text-xs text-emerald-200/70 mt-1">
                            {job.deviceModel} {job.deviceSerial && `(S/N: ${job.deviceSerial})`}
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-xs text-emerald-300/70 font-semibold mb-1">อาการเสีย</div>
                        <div className="text-emerald-100">{job.description}</div>
                      </div>

                      <div>
                        <div className="text-xs text-emerald-300/70 font-semibold mb-1">วันที่รับเครื่อง</div>
                        <div className="text-emerald-200">{format(new Date(job.createdAt), "dd MMMM yyyy HH:mm", { locale: th })}</div>
                      </div>

                      {job.diagnosis && (
                        <div>
                          <div className="text-xs text-emerald-300/70 font-semibold mb-1">ผลการวินิจฉัย</div>
                          <div className="text-emerald-200">{job.diagnosis}</div>
                        </div>
                      )}
                    </div>

                    {['COMPLETED', 'DELIVERED'].includes(job.status) && (
                      <div className="bg-emerald-950/60 rounded-xl p-5 mt-6 border border-emerald-500/20">
                        <h3 className="text-xs font-bold text-emerald-300 mb-3 uppercase tracking-wider">รายละเอียดค่าใช้จ่าย</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-emerald-200">
                            <span>ค่าอะไหล่</span>
                            <span>฿{job.partsCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-emerald-200">
                            <span>ค่าบริการ</span>
                            <span>฿{job.serviceCost.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center pt-3 mt-3 border-t border-emerald-500/20">
                            <span className="font-bold text-white">ยอดชำระสุทธิ</span>
                            <span className="text-xl font-black text-emerald-300">฿{job.totalCost.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-emerald-300/60 py-12 glass-card rounded-2xl border border-emerald-500/20">
                ไม่มีประวัติงานซ่อม
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 glass-card rounded-2xl border border-emerald-500/20">
            <h2 className="text-2xl font-bold text-white mb-2">ไม่พบข้อมูลลูกค้า</h2>
            <p className="text-emerald-300/70">ไม่พบประวัติสำหรับเบอร์โทรศัพท์ {decodedPhone}</p>
          </div>
        )}
      </div>
    </div>
  );
}

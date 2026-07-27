"use client";

import React from "react";

export interface StatusTimelineProps {
  currentStatus: string;
}

const STEPS = [
  { key: "RECEIVED", label: "รับเครื่อง", icon: "📥", desc: "รับเครื่องเข้าระบบ" },
  { key: "DIAGNOSING", label: "กำลังตรวจสอบ", icon: "🔍", desc: "ตรวจเช็คอาการเสีย" },
  { key: "WAITING_PARTS", label: "รออะไหล่", icon: "📦", desc: "อยู่ระหว่างรออะไหล่" },
  { key: "REPAIRING", label: "กำลังซ่อม", icon: "🛠️", desc: "อยู่ระหว่างดำเนินการซ่อม" },
  { key: "COMPLETED", label: "ซ่อมเสร็จ", icon: "✅", desc: "พร้อมส่งมอบ" },
  { key: "DELIVERED", label: "ส่งมอบแล้ว", icon: "🎉", desc: "ส่งมอบเครื่องเรียบร้อย" },
];

const STATUS_ORDER: Record<string, number> = {
  RECEIVED: 0,
  DIAGNOSING: 1,
  WAITING_PARTS: 2,
  REPAIRING: 3,
  COMPLETED: 4,
  DELIVERED: 5,
};

export default function StatusTimeline({ currentStatus }: StatusTimelineProps) {
  if (currentStatus === "CANCELLED") {
    return (
      <div className="my-6 p-4 rounded-2xl bg-red-950/40 border border-red-500/40 flex items-center justify-center space-x-3 text-red-300 shadow-lg">
        <span className="text-2xl animate-bounce">❌</span>
        <div>
          <span className="font-bold text-base block text-red-200">งานซ่อมถูกยกเลิก (CANCELLED)</span>
          <span className="text-xs text-red-400">รายการนี้ได้รับการยกเลิกเรียบร้อยแล้ว</span>
        </div>
      </div>
    );
  }

  const activeIndex = STATUS_ORDER[currentStatus] ?? 0;
  const isAllDelivered = currentStatus === "DELIVERED";

  return (
    <div className="w-full my-6 p-5 sm:p-6 bg-emerald-950/50 border border-emerald-500/30 rounded-2xl backdrop-blur-md shadow-xl">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-emerald-500/20">
        <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          ขั้นตอนการดำเนินงานซ่อม (Repair Status Progress)
        </h4>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/30">
          ขั้นตอนที่ {activeIndex + 1} จาก {STEPS.length}
        </span>
      </div>

      {/* Timeline Steps */}
      <div className="relative">
        {/* Desktop Connecting Line */}
        <div className="hidden md:block absolute top-6 left-[8%] right-[8%] h-1 bg-emerald-950 border-t border-b border-emerald-900/60 z-0">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(52,211,153,0.6)]"
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps List */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-2 relative z-10">
          {STEPS.map((step, index) => {
            const isDone = index < activeIndex || isAllDelivered;
            const isActive = index === activeIndex && !isAllDelivered;
            const isUpcoming = index > activeIndex && !isAllDelivered;

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-b from-emerald-900/70 to-emerald-950/90 border border-emerald-400/50 shadow-lg shadow-emerald-900/50 transform md:-translate-y-1"
                    : isDone
                    ? "bg-emerald-950/20"
                    : "opacity-60"
                }`}
              >
                {/* Step Circle Ring */}
                <div className="relative mb-2 flex items-center justify-center">
                  {/* Glowing active ring */}
                  {isActive && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-400/30 animate-ping" />
                  )}

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-base transition-all duration-500 border-2 ${
                      isDone
                        ? "bg-emerald-500 text-emerald-950 border-emerald-300 shadow-md shadow-emerald-500/30"
                        : isActive
                        ? "bg-gradient-to-tr from-emerald-400 to-teal-200 text-emerald-950 border-white shadow-xl shadow-emerald-400/50 scale-110 ring-4 ring-emerald-500/40"
                        : "bg-slate-900/90 text-slate-500 border-slate-700/80"
                    }`}
                  >
                    {isDone ? (
                      <svg className="w-6 h-6 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>
                </div>

                {/* Step Title */}
                <span
                  className={`text-xs font-bold transition-all ${
                    isDone
                      ? "text-emerald-300"
                      : isActive
                      ? "text-white font-extrabold text-sm drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]"
                      : "text-slate-400 font-normal"
                  }`}
                >
                  {step.label}
                </span>

                {/* Step Active Badge */}
                {isActive && (
                  <span className="mt-1 px-2 py-0.5 text-[10px] font-black bg-emerald-400 text-emerald-950 rounded-full shadow-md animate-pulse whitespace-nowrap">
                    ขั้นตอนนี้
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

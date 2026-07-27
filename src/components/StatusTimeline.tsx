"use client";

import React from "react";
import { 
  Inbox, 
  Search, 
  Package, 
  Wrench, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle,
  Check
} from "lucide-react";

export interface StatusTimelineProps {
  currentStatus: string;
}

const STEPS = [
  { key: "RECEIVED", label: "รับเครื่อง", icon: Inbox, desc: "รับเครื่องเข้าระบบ" },
  { key: "DIAGNOSING", label: "กำลังตรวจสอบ", icon: Search, desc: "ตรวจเช็คอาการเสีย" },
  { key: "WAITING_PARTS", label: "รออะไหล่", icon: Package, desc: "อยู่ระหว่างรออะไหล่" },
  { key: "REPAIRING", label: "กำลังซ่อม", icon: Wrench, desc: "อยู่ระหว่างดำเนินการซ่อม" },
  { key: "COMPLETED", label: "ซ่อมเสร็จ", icon: CheckCircle2, desc: "พร้อมส่งมอบ" },
  { key: "DELIVERED", label: "ส่งมอบแล้ว", icon: Sparkles, desc: "ส่งมอบเครื่องเรียบร้อย" },
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
      <div className="my-6 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center space-x-3 text-red-700 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-red-600 animate-bounce" />
        <div>
          <span className="font-bold text-base block text-red-900">งานซ่อมถูกยกเลิก (CANCELLED)</span>
          <span className="text-xs text-red-600">รายการนี้ได้รับการยกเลิกเรียบร้อยแล้ว</span>
        </div>
      </div>
    );
  }

  const activeIndex = STATUS_ORDER[currentStatus] ?? 0;
  const isAllDelivered = currentStatus === "DELIVERED";

  return (
    <div className="w-full my-6 p-5 sm:p-6 bg-white border border-emerald-100 rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600"></span>
          </span>
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            ขั้นตอนการดำเนินงานซ่อม (Repair Status Progress)
          </h4>
        </div>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          ขั้นตอนที่ {activeIndex + 1} จาก {STEPS.length}
        </span>
      </div>

      {/* Timeline Steps Container */}
      <div className="relative">
        {/* Connecting Line (Desktop) */}
        <div className="hidden md:block absolute top-6 left-[8%] right-[8%] h-1 bg-slate-100 z-0 rounded-full">
          <div
            className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 ease-out rounded-full shadow-sm"
            style={{
              width: `${(activeIndex / (STEPS.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-2 relative z-10">
          {STEPS.map((step, index) => {
            const IconComponent = step.icon;
            const isDone = index < activeIndex || isAllDelivered;
            const isActive = index === activeIndex && !isAllDelivered;

            return (
              <div
                key={step.key}
                className={`flex flex-col items-center text-center p-3 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-50/80 border border-emerald-300 shadow-md shadow-emerald-100 transform md:-translate-y-1"
                    : isDone
                    ? "bg-slate-50/60"
                    : "opacity-60"
                }`}
              >
                {/* Icon Circle */}
                <div className="relative mb-2 flex items-center justify-center">
                  {isActive && (
                    <span className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-ping" />
                  )}

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                      isDone
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : isActive
                        ? "bg-emerald-500 text-white border-emerald-300 shadow-md ring-4 ring-emerald-100 scale-110"
                        : "bg-slate-100 text-slate-400 border-slate-200"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Step Label */}
                <span
                  className={`text-xs transition-all ${
                    isDone
                      ? "text-emerald-800 font-bold"
                      : isActive
                      ? "text-emerald-950 font-extrabold text-sm"
                      : "text-slate-500 font-medium"
                  }`}
                >
                  {step.label}
                </span>

                {/* Active Step Pill */}
                {isActive && (
                  <span className="mt-1 px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full shadow-xs animate-pulse whitespace-nowrap">
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

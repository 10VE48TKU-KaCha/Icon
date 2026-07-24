"use client";

import { formatDate, formatCurrency, getStatusLabel, getDeviceTypeLabel } from "@/lib/utils";

interface RepairReceiptProps {
  job: {
    ticketNumber: string;
    deviceType: string;
    deviceBrand: string;
    deviceModel?: string | null;
    deviceSerial?: string | null;
    description: string;
    diagnosis?: string | null;
    status: string;
    partsCost: number;
    serviceCost: number;
    totalCost: number;
    notes?: string | null;
    createdAt: string | Date;
    customer: {
      name: string;
      phoneNumber: string;
      email?: string | null;
      address?: string | null;
    };
    technician: {
      name: string;
    };
  };
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
}

export default function RepairReceipt({ job, shopName, shopAddress, shopPhone }: RepairReceiptProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Button - hidden during print */}
      <div className="print:hidden mb-4 flex justify-end">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg transition-colors font-medium shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          พิมพ์ใบรับซ่อม
        </button>
      </div>

      {/* Receipt Content */}
      <div id="repair-receipt" className="bg-white text-gray-900 p-8 rounded-lg max-w-2xl mx-auto print:shadow-none print:rounded-none print:p-4 print:max-w-full">
        {/* Header */}
        <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{shopName || "ICON MULTIMEDIA"}</h1>
          {shopAddress && <p className="text-sm text-gray-600 mt-1">{shopAddress}</p>}
          {shopPhone && <p className="text-sm text-gray-600">โทร: {shopPhone}</p>}
          <h2 className="text-lg font-semibold mt-3 text-gray-800">ใบรับซ่อม</h2>
        </div>

        {/* Ticket Info */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm text-gray-500">เลขที่ใบซ่อม</p>
            <p className="text-xl font-bold text-emerald-700">{job.ticketNumber}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">วันที่รับเครื่อง</p>
            <p className="font-medium">{formatDate(job.createdAt)}</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">ข้อมูลลูกค้า</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">ชื่อ: </span>
              <span className="font-medium">{job.customer.name}</span>
            </div>
            <div>
              <span className="text-gray-500">เบอร์โทร: </span>
              <span className="font-medium">{job.customer.phoneNumber}</span>
            </div>
            {job.customer.email && (
              <div>
                <span className="text-gray-500">อีเมล: </span>
                <span className="font-medium">{job.customer.email}</span>
              </div>
            )}
            {job.customer.address && (
              <div className="col-span-2">
                <span className="text-gray-500">ที่อยู่: </span>
                <span className="font-medium">{job.customer.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Device Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">ข้อมูลอุปกรณ์</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">ประเภท: </span>
              <span className="font-medium">{getDeviceTypeLabel(job.deviceType)}</span>
            </div>
            <div>
              <span className="text-gray-500">ยี่ห้อ: </span>
              <span className="font-medium">{job.deviceBrand}</span>
            </div>
            {job.deviceModel && (
              <div>
                <span className="text-gray-500">รุ่น: </span>
                <span className="font-medium">{job.deviceModel}</span>
              </div>
            )}
            {job.deviceSerial && (
              <div>
                <span className="text-gray-500">S/N: </span>
                <span className="font-medium">{job.deviceSerial}</span>
              </div>
            )}
          </div>
        </div>

        {/* Problem Description */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">อาการ / ปัญหา</h3>
          <p className="text-sm bg-gray-50 p-3 rounded-lg">{job.description}</p>
        </div>

        {/* Diagnosis (if available) */}
        {job.diagnosis && (
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">ผลการวินิจฉัย</h3>
            <p className="text-sm bg-gray-50 p-3 rounded-lg">{job.diagnosis}</p>
          </div>
        )}

        {/* Cost Breakdown (show when completed/delivered) */}
        {(job.status === "COMPLETED" || job.status === "DELIVERED") && job.totalCost > 0 && (
          <div className="border-t-2 border-gray-200 pt-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">ค่าใช้จ่าย</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ค่าอะไหล่</span>
                <span className="font-medium">{formatCurrency(job.partsCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">ค่าบริการ</span>
                <span className="font-medium">{formatCurrency(job.serviceCost)}</span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-1 mt-1">
                <span className="font-semibold text-gray-800">รวมทั้งสิ้น</span>
                <span className="font-bold text-lg text-emerald-700">{formatCurrency(job.totalCost)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex justify-between items-center border-t-2 border-gray-200 pt-4 mb-4">
          <span className="text-sm text-gray-500">สถานะ:</span>
          <span className="font-semibold text-emerald-700">{getStatusLabel(job.status)}</span>
        </div>

        {/* Technician */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-500">ช่างผู้รับผิดชอบ:</span>
          <span className="font-medium">{job.technician.name}</span>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-gray-800 pt-4 mt-4">
          <div className="grid grid-cols-2 gap-8 text-center text-sm text-gray-500 mt-8">
            <div>
              <div className="border-b border-gray-400 mb-2 pb-8"></div>
              <p>ลงชื่อผู้รับบริการ</p>
            </div>
            <div>
              <div className="border-b border-gray-400 mb-2 pb-8"></div>
              <p>ลงชื่อช่างผู้รับเครื่อง</p>
            </div>
          </div>
          <p className="text-xs text-center text-gray-400 mt-6">
            กรุณาเก็บใบรับซ่อมนี้ไว้เป็นหลักฐาน สามารถตรวจสอบสถานะได้ที่เว็บไซต์โดยใช้เบอร์โทรศัพท์
          </p>
        </div>
      </div>
    </>
  );
}

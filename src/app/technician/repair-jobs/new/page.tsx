"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function NewRepairJobPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  
  const [formData, setFormData] = useState({
    customerId: "",
    deviceType: "PC",
    deviceBrand: "",
    deviceModel: "",
    deviceSerial: "",
    description: "",
  });

  const [searchPhone, setSearchPhone] = useState("");

  const searchCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone) return;
    
    setLoadingCustomers(true);
    try {
      const res = await fetch(`/api/technician/customers?q=${encodeURIComponent(searchPhone)}`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const handleCreateCustomer = async () => {
    const { value: newCustomer } = await Swal.fire({
      title: "เพิ่มลูกค้าใหม่",
      html: `
        <div class="flex flex-col gap-4 text-left">
          <div>
            <label class="block text-sm text-slate-400 mb-1">ชื่อ-นามสกุล *</label>
            <input id="swal-input1" class="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500" placeholder="ระบุชื่อ">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">เบอร์โทรศัพท์ *</label>
            <input id="swal-input2" type="tel" value="${searchPhone}" class="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500" placeholder="08xxxxxxxx">
          </div>
        </div>
      `,
      background: "#0f172a",
      color: "#f8fafc",
      confirmButtonText: "บันทึก",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#0891b2",
      cancelButtonColor: "#334155",
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById("swal-input1") as HTMLInputElement).value;
        const phone = (document.getElementById("swal-input2") as HTMLInputElement).value;
        if (!name || !phone) {
          Swal.showValidationMessage("กรุณากรอกชื่อและเบอร์โทรศัพท์");
          return false;
        }
        return { name, phoneNumber: phone };
      }
    });

    if (newCustomer) {
      try {
        const res = await fetch("/api/technician/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCustomer),
        });
        
        if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
        
        const created = await res.json();
        setCustomers([created]);
        setFormData({ ...formData, customerId: created.id });
        
        Swal.fire({
          icon: "success",
          title: "เพิ่มลูกค้าสำเร็จ",
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#0891b2",
          timer: 1500,
        });
      } catch (error: any) {
        Swal.fire({ icon: "error", title: "ผิดพลาด", text: error.message, background: "#0f172a", color: "#f8fafc" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกลูกค้า", background: "#0f172a", color: "#f8fafc" });
      return;
    }

    try {
      const res = await fetch("/api/technician/repair-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("บันทึกไม่สำเร็จ");
      const job = await res.json();

      Swal.fire({
        icon: "success",
        title: "เปิดบิลสำเร็จ",
        html: `เลขที่ใบรับซ่อม:<br><b class="text-2xl text-cyan-400 mt-2 block">${job.ticketNumber}</b>`,
        background: "#0f172a",
        color: "#f8fafc",
        confirmButtonColor: "#0891b2",
        confirmButtonText: "ดูรายละเอียดงานซ่อม",
        showCancelButton: true,
        cancelButtonText: "ปิด",
        cancelButtonColor: "#334155"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/technician/repair-jobs/${job.id}`);
        } else {
          router.push("/technician");
        }
      });
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "ผิดพลาด", text: error.message, background: "#0f172a", color: "#f8fafc" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">เปิดบิลงานซ่อมใหม่</h1>
        <p className="text-slate-400">บันทึกข้อมูลการรับเครื่องซ่อม</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">1. ข้อมูลลูกค้า</h2>
        
        <form onSubmit={searchCustomer} className="flex gap-3 mb-4">
          <input
            type="text"
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            placeholder="ค้นหาด้วยเบอร์โทรศัพท์..."
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors border border-slate-700">
            ค้นหา
          </button>
          <button type="button" onClick={handleCreateCustomer} className="bg-cyan-900/50 hover:bg-cyan-900 text-cyan-400 px-4 py-2.5 rounded-xl font-medium transition-colors border border-cyan-800/50 whitespace-nowrap">
            + ลูกค้าใหม่
          </button>
        </form>

        {loadingCustomers && <div className="text-cyan-500 py-2">กำลังค้นหา...</div>}
        
        {customers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {customers.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setFormData({ ...formData, customerId: c.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-colors ${formData.customerId === c.id ? 'bg-cyan-900/30 border-cyan-500' : 'bg-slate-950 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="font-medium text-slate-200">{c.name}</div>
                <div className="text-sm text-cyan-400">{c.phoneNumber}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <h2 className="text-xl font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">2. ข้อมูลอุปกรณ์</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-slate-400 mb-2">ประเภทอุปกรณ์ *</label>
              <select 
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                required
              >
                <option value="PC">PC (คอมพิวเตอร์ตั้งโต๊ะ)</option>
                <option value="NOTEBOOK">Notebook (โน้ตบุ๊ก)</option>
                <option value="PRINTER">Printer (เครื่องพิมพ์)</option>
                <option value="OTHER">Other (อื่นๆ)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-slate-400 mb-2">ยี่ห้อ (Brand) *</label>
              <input 
                type="text" 
                value={formData.deviceBrand}
                onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">รุ่น (Model)</label>
              <input 
                type="text" 
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Serial Number (S/N)</label>
              <input 
                type="text" 
                value={formData.deviceSerial}
                onChange={(e) => setFormData({ ...formData, deviceSerial: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">อาการเสีย / รายละเอียดการซ่อม *</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 px-4 py-3 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
              required
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-medium text-slate-300 hover:bg-slate-800 transition-colors">
              ยกเลิก
            </button>
            <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-cyan-900/20">
              บันทึกการรับซ่อม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

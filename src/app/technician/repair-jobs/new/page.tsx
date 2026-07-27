"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { PlusCircle, Search, UserPlus, Smartphone, Wrench, ArrowLeft } from "lucide-react";
import Link from "next/link";

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
        <div class="flex flex-col gap-3 text-left font-sans">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
            <input id="swal-input1" class="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600" placeholder="ระบุชื่อ">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
            <input id="swal-input2" type="tel" value="${searchPhone}" class="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600" placeholder="08xxxxxxxx">
          </div>
        </div>
      `,
      background: "#ffffff",
      color: "#0f172a",
      confirmButtonText: "บันทึก",
      showCancelButton: true,
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#059669",
      cancelButtonColor: "#94a3b8",
      focusConfirm: false,
      customClass: {
        popup: "rounded-2xl border border-emerald-200 shadow-xl"
      },
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
          background: "#ffffff",
          color: "#0f172a",
          confirmButtonColor: "#059669",
          timer: 1500,
        });
      } catch (error: any) {
        Swal.fire({ icon: "error", title: "ผิดพลาด", text: error.message, background: "#ffffff", color: "#0f172a" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกลูกค้า", background: "#ffffff", color: "#0f172a" });
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
        html: `เลขที่ใบรับซ่อม:<br><b class="text-2xl text-emerald-700 mt-2 block font-mono font-black">${job.ticketNumber}</b>`,
        background: "#ffffff",
        color: "#0f172a",
        confirmButtonColor: "#059669",
        confirmButtonText: "ดูรายละเอียดงานซ่อม",
        showCancelButton: true,
        cancelButtonText: "ปิด",
        cancelButtonColor: "#94a3b8"
      }).then((result) => {
        if (result.isConfirmed) {
          router.push(`/technician/repair-jobs/${job.id}`);
        } else {
          router.push("/technician");
        }
      });
    } catch (error: any) {
      Swal.fire({ icon: "error", title: "ผิดพลาด", text: error.message, background: "#ffffff", color: "#0f172a" });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-slate-800">
      <Link 
        href="/technician" 
        className="inline-flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 font-semibold mb-2 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
        <span>กลับหน้าหลัก (Back to Dashboard)</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <PlusCircle className="w-7 h-7 text-emerald-600" />
          <span>เปิดบิลงานซ่อมใหม่ (New Repair Order)</span>
        </h1>
        <p className="text-sm text-slate-500 font-medium mt-1">บันทึกข้อมูลการรับเครื่องซ่อมจากลูกค้า</p>
      </div>

      <div className="glass-card p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">1</span>
          <span>ค้นหาหรือเพิ่มข้อมูลลูกค้า</span>
        </h2>
        
        <form onSubmit={searchCustomer} className="flex flex-wrap sm:flex-nowrap gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="ค้นหาด้วยเบอร์โทรศัพท์..."
              className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium"
            />
          </div>
          <button type="submit" className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-2.5 rounded-xl font-bold text-sm transition border border-slate-300">
            ค้นหา
          </button>
          <button type="button" onClick={handleCreateCustomer} className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-4 py-2.5 rounded-xl font-bold text-sm transition border border-emerald-200 whitespace-nowrap flex items-center space-x-1">
            <UserPlus className="w-4 h-4" />
            <span>+ ลูกค้าใหม่</span>
          </button>
        </form>

        {loadingCustomers && <div className="text-emerald-700 py-2 text-xs font-semibold">กำลังค้นหาข้อมูล...</div>}
        
        {customers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {customers.map((c) => (
              <div 
                key={c.id} 
                onClick={() => setFormData({ ...formData, customerId: c.id })}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.customerId === c.id 
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm ring-2 ring-emerald-200' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-bold text-slate-900">{c.name}</div>
                <div className="text-sm text-emerald-700 font-mono font-bold">{c.phoneNumber}</div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">2</span>
            <span>รายละเอียดอุปกรณ์ที่รับซ่อม</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ประเภทอุปกรณ์ *</label>
              <select 
                value={formData.deviceType}
                onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium"
                required
              >
                <option value="PC">PC (คอมพิวเตอร์ตั้งโต๊ะ)</option>
                <option value="NOTEBOOK">Notebook (โน้ตบุ๊ก)</option>
                <option value="PRINTER">Printer (เครื่องพิมพ์)</option>
                <option value="OTHER">Other (อื่นๆ)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">ยี่ห้อ (Brand) *</label>
              <input 
                type="text" 
                value={formData.deviceBrand}
                onChange={(e) => setFormData({ ...formData, deviceBrand: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium"
                placeholder="เช่น Asus, Lenovo, Dell"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">รุ่น (Model)</label>
              <input 
                type="text" 
                value={formData.deviceModel}
                onChange={(e) => setFormData({ ...formData, deviceModel: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Serial Number (S/N)</label>
              <input 
                type="text" 
                value={formData.deviceSerial}
                onChange={(e) => setFormData({ ...formData, deviceSerial: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-mono font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">อาการเสีย / รายละเอียดการซ่อม *</label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-white border border-slate-300 text-slate-900 px-4 py-3 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium resize-none"
              placeholder="ระบุอาการเสียให้ชัดเจน..."
              required
            ></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-100 transition">
              ยกเลิก
            </button>
            <button type="submit" className="btn-primary px-8 py-3 rounded-xl font-bold text-sm shadow-md">
              บันทึกการรับซ่อม
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

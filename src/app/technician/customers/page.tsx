"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { Users, UserPlus, Search, Phone, Mail, ExternalLink } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCustomers = async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/technician/customers?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCustomers(search);
  };

  const handleAddCustomer = async () => {
    const { value: formValues } = await Swal.fire({
      title: "เพิ่มลูกค้าใหม่",
      html: `
        <div class="flex flex-col gap-3 text-left font-sans">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อ-นามสกุล *</label>
            <input id="swal-input1" class="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600" placeholder="ระบุชื่อ-นามสกุล">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ *</label>
            <input id="swal-input2" type="tel" class="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600" placeholder="08xxxxxxxx">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">อีเมล</label>
            <input id="swal-input3" type="email" class="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600" placeholder="example@email.com">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ที่อยู่</label>
            <textarea id="swal-input4" class="w-full bg-white text-slate-900 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-600 resize-none" rows="2"></textarea>
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
        const email = (document.getElementById("swal-input3") as HTMLInputElement).value;
        const address = (document.getElementById("swal-input4") as HTMLInputElement).value;
        
        if (!name || !phone) {
          Swal.showValidationMessage("กรุณากรอกชื่อและเบอร์โทรศัพท์");
          return false;
        }
        return { name, phoneNumber: phone, email, address };
      }
    });

    if (formValues) {
      try {
        const res = await fetch("/api/technician/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "เกิดข้อผิดพลาด");
        }
        
        Swal.fire({
          icon: "success",
          title: "บันทึกสำเร็จ",
          background: "#ffffff",
          color: "#0f172a",
          confirmButtonColor: "#059669",
        });
        
        fetchCustomers(search);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "บันทึกล้มเหลว",
          text: error.message,
          background: "#ffffff",
          color: "#0f172a",
          confirmButtonColor: "#059669",
        });
      }
    }
  };

  return (
    <div className="space-y-6 text-slate-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            <span>จัดการลูกค้า (Customer Management)</span>
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">ค้นหาและเพิ่มข้อมูลลูกค้าในระบบ</p>
        </div>
        <button 
          onClick={handleAddCustomer}
          className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-md whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>+ เพิ่มลูกค้าใหม่</span>
        </button>
      </div>

      <div className="glass-card p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ หรือ เบอร์โทรศัพท์..."
              className="w-full bg-white border border-slate-300 text-slate-900 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-600 text-sm font-medium"
            />
          </div>
          <button 
            type="submit"
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-6 py-2.5 rounded-xl font-bold text-sm transition border border-slate-300"
          >
            ค้นหา
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12 text-emerald-700 font-medium space-x-2 flex justify-center items-center">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>กำลังโหลดข้อมูลลูกค้า...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase border-b border-slate-200">
                  <th className="px-6 py-4">ชื่อลูกค้า</th>
                  <th className="px-6 py-4">เบอร์โทรศัพท์</th>
                  <th className="px-6 py-4">อีเมล</th>
                  <th className="px-6 py-4 text-center">จำนวนงานซ่อม</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-slate-900 font-bold">{customer.name}</td>
                      <td className="px-6 py-4 text-emerald-700 font-mono font-bold flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{customer.phoneNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{customer.email || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full text-xs">
                          {customer._count?.repairJobs || 0} รายการ
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/track/${encodeURIComponent(customer.phoneNumber)}`} 
                          target="_blank" 
                          className="text-emerald-700 hover:text-emerald-800 font-bold text-xs inline-flex items-center space-x-1"
                        >
                          <span>ดูประวัติ</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 font-medium">
                      ไม่พบข้อมูลลูกค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

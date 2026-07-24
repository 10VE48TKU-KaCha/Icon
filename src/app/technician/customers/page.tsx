"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { th } from "date-fns/locale";

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
        <div class="flex flex-col gap-4 text-left">
          <div>
            <label class="block text-sm text-slate-400 mb-1">ชื่อ-นามสกุล *</label>
            <input id="swal-input1" class="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500" placeholder="ระบุชื่อ">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">เบอร์โทรศัพท์ *</label>
            <input id="swal-input2" type="tel" class="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500" placeholder="08xxxxxxxx">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">อีเมล</label>
            <input id="swal-input3" type="email" class="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500" placeholder="example@email.com">
          </div>
          <div>
            <label class="block text-sm text-slate-400 mb-1">ที่อยู่</label>
            <textarea id="swal-input4" class="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:border-cyan-500" rows="2"></textarea>
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
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#0891b2",
        });
        
        fetchCustomers(search);
      } catch (error: any) {
        Swal.fire({
          icon: "error",
          title: "บันทึกล้มเหลว",
          text: error.message,
          background: "#0f172a",
          color: "#f8fafc",
          confirmButtonColor: "#0891b2",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">จัดการลูกค้า</h1>
          <p className="text-slate-400">ค้นหาและเพิ่มข้อมูลลูกค้าในระบบ</p>
        </div>
        <button 
          onClick={handleAddCustomer}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-cyan-900/20"
        >
          + เพิ่มลูกค้าใหม่
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อ หรือ เบอร์โทรศัพท์..."
            className="flex-1 bg-slate-950 border border-slate-800 text-slate-200 px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button 
            type="submit"
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors border border-slate-700"
          >
            ค้นหา
          </button>
        </form>

        {loading ? (
          <div className="text-center py-12 text-cyan-500">กำลังโหลด...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-400 text-sm border-b border-slate-800">
                  <th className="px-6 py-4 font-medium">ชื่อลูกค้า</th>
                  <th className="px-6 py-4 font-medium">เบอร์โทรศัพท์</th>
                  <th className="px-6 py-4 font-medium">อีเมล</th>
                  <th className="px-6 py-4 font-medium text-center">จำนวนงานซ่อม</th>
                  <th className="px-6 py-4 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-slate-200 font-medium">{customer.name}</td>
                      <td className="px-6 py-4 text-cyan-400">{customer.phoneNumber}</td>
                      <td className="px-6 py-4 text-slate-400">{customer.email || '-'}</td>
                      <td className="px-6 py-4 text-center text-slate-300">
                        <span className="bg-slate-800 px-3 py-1 rounded-full text-xs">{customer._count?.repairJobs || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/track/${customer.phoneNumber}`} target="_blank" className="text-cyan-500 hover:text-cyan-400 text-sm">
                          ดูประวัติ &rarr;
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
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

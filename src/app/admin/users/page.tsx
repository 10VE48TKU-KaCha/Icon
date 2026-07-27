'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Users, UserPlus, Shield, Wrench, AlertTriangle, CheckCircle2, Ban, RotateCcw } from 'lucide-react';

export default function AdminUsers() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const isTempAdmin = session?.user?.isTempAdmin || !!session?.user?.expiresAt;

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    const isCallerTempAdmin = isTempAdmin;

    const { value: formValues } = await Swal.fire({
      title: isCallerTempAdmin ? 'สร้างบัญชี ADMIN หลัก' : 'เพิ่มผู้ใช้งานใหม่',
      html: `
        <div class="text-left space-y-3 font-sans">
          ${
            isCallerTempAdmin
              ? `<div class="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs mb-3">
                  ⚠️ คุณกำลังใช้งานด้วย <strong>บัญชี Admin ชั่วคราว</strong> สามารถสร้างได้เฉพาะ <strong>ผู้ดูแลระบบ (ADMIN)</strong> เท่านั้น
                  เมื่อสร้างสำเร็จ บัญชีชั่วคราวนี้จะถูกลบออกจากระบบทันที
                </div>`
              : ''
          }
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อผู้ใช้ (Username)</label>
            <input id="swal-input1" class="swal2-input bg-white text-slate-900 border-slate-300 w-full m-0 text-sm rounded-xl focus:border-emerald-600 focus:outline-none" placeholder="กรอกชื่อผู้ใช้">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
            <input id="swal-input2" type="password" class="swal2-input bg-white text-slate-900 border-slate-300 w-full m-0 text-sm rounded-xl focus:border-emerald-600 focus:outline-none" placeholder="กรอกรหัสผ่าน">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">ชื่อ-นามสกุล</label>
            <input id="swal-input3" class="swal2-input bg-white text-slate-900 border-slate-300 w-full m-0 text-sm rounded-xl focus:border-emerald-600 focus:outline-none" placeholder="ชื่อ-นามสกุล">
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">บทบาท (Role)</label>
            <select id="swal-input4" class="swal2-select bg-white text-slate-900 border-slate-300 w-full m-0 text-sm rounded-xl focus:border-emerald-600 focus:outline-none" ${
              isCallerTempAdmin ? 'disabled' : ''
            }>
              <option value="ADMIN" ${isCallerTempAdmin ? 'selected' : ''}>ผู้ดูแลระบบ (ADMIN)</option>
              <option value="TECHNICIAN" ${isCallerTempAdmin ? '' : 'selected'}>ช่างซ่อม (TECHNICIAN)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ (ถ้ามี)</label>
            <input id="swal-input5" class="swal2-input bg-white text-slate-900 border-slate-300 w-full m-0 text-sm rounded-xl focus:border-emerald-600 focus:outline-none" placeholder="08XXXXXXXX">
          </div>
        </div>
      `,
      focusConfirm: false,
      background: '#ffffff',
      color: '#0f172a',
      confirmButtonColor: '#059669',
      showCancelButton: true,
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'บันทึกข้อมูล',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        popup: 'rounded-2xl border border-emerald-200 shadow-xl'
      },
      preConfirm: () => {
        return {
          username: (document.getElementById('swal-input1') as HTMLInputElement)?.value?.trim(),
          password: (document.getElementById('swal-input2') as HTMLInputElement)?.value?.trim(),
          name: (document.getElementById('swal-input3') as HTMLInputElement)?.value?.trim(),
          role: (document.getElementById('swal-input4') as HTMLSelectElement)?.value || 'ADMIN',
          phone: (document.getElementById('swal-input5') as HTMLInputElement)?.value?.trim()
        };
      }
    });

    if (formValues) {
      if (!formValues.username || !formValues.password || !formValues.name) {
        Swal.fire({ title: 'ข้อผิดพลาด', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'error', background: '#ffffff', color: '#0f172a' });
        return;
      }

      try {
        const res = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formValues)
        });
        
        const resData = await res.json();

        if (res.ok) {
          if (resData.tempAdminDeleted) {
            await Swal.fire({
              title: '🎉 สำเร็จ!',
              text: 'สร้างบัญชี Admin หลักเรียบร้อยแล้ว! ระบบทำการลบบัญชี Admin ชั่วคราวออกเรียบร้อยแล้ว กรุณาเข้าสู่ระบบใหม่ด้วยบัญชี Admin หลัก',
              icon: 'success',
              background: '#ffffff',
              color: '#0f172a',
              confirmButtonText: 'ตกลง (ไปหน้าล็อกอิน)'
            });
            signOut({ callbackUrl: '/login' });
            return;
          }

          Swal.fire({ title: 'สำเร็จ!', text: 'เพิ่มผู้ใช้งานเรียบร้อยแล้ว', icon: 'success', background: '#ffffff', color: '#0f172a' });
          fetchUsers();
        } else {
          Swal.fire({ title: 'ข้อผิดพลาด', text: resData.error || 'ไม่สามารถเพิ่มผู้ใช้งานได้', icon: 'error', background: '#ffffff', color: '#0f172a' });
        }
      } catch (e) {
        Swal.fire({ title: 'ข้อผิดพลาด', text: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', icon: 'error', background: '#ffffff', color: '#0f172a' });
      }
    }
  };

  const handleToggleActive = async (user: any) => {
    const isSuspending = user.active;
    const actionText = isSuspending ? 'ระงับใช้งาน' : 'เปิดใช้งาน';

    const confirm = await Swal.fire({
      title: `ยืนยัน${actionText}?`,
      text: isSuspending 
        ? `คุณต้องการระงับการใช้งานบัญชี "${user.name}" (${user.username}) ใช่หรือไม่? (บัญชีนี้จะไม่สามารถล็อกอินเข้าสู่ระบบได้)` 
        : `คุณต้องการเปิดสิทธิ์ใช้งานบัญชี "${user.name}" (${user.username}) อีกครั้งใช่หรือไม่?`,
      icon: isSuspending ? 'warning' : 'question',
      showCancelButton: true,
      confirmButtonColor: isSuspending ? '#ef4444' : '#059669',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: `ยืนยัน${actionText}`,
      cancelButtonText: 'ยกเลิก',
      background: '#ffffff',
      color: '#0f172a'
    });

    if (!confirm.isConfirmed) return;

    try {
      if (isSuspending) {
        await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: true })
        });
      }
      Swal.fire({ title: 'สำเร็จ!', text: `ทำการ${actionText}ผู้ใช้งานเรียบร้อยแล้ว`, icon: 'success', background: '#ffffff', color: '#0f172a' });
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire({ title: 'ข้อผิดพลาด', text: 'ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้', icon: 'error', background: '#ffffff', color: '#0f172a' });
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter === 'ACTIVE' && !u.active) return false;
    if (statusFilter === 'SUSPENDED' && u.active) return false;
    return true;
  });

  return (
    <div className="space-y-6 text-slate-800">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-emerald-600" />
            <span>จัดการผู้ใช้งานในระบบ (User Management)</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium mt-1">
            จัดการบัญชีผู้ดูแลระบบ (Admin) และช่างซ่อม (Technician) รวมถึงการระงับบัญชีใช้งาน
          </p>
        </div>

        <button 
          onClick={handleAddUser}
          className="btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 shadow-md whitespace-nowrap"
        >
          <UserPlus className="w-4 h-4" />
          <span>{isTempAdmin ? 'สร้างบัญชี ADMIN หลัก' : 'เพิ่มผู้ใช้งานใหม่'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-bold">บทบาท:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-medium"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
              <option value="TECHNICIAN">ช่างซ่อม (TECHNICIAN)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-600 font-bold">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 font-medium"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="ACTIVE">ใช้งานปกติ</option>
              <option value="SUSPENDED">ระงับใช้งาน</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          แสดงข้อมูลทั้งหมด <strong className="text-slate-900 font-extrabold">{filteredUsers.length}</strong> รายการ
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-100/80 text-slate-700 text-xs font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4">ตำแหน่ง / สิทธิ์</th>
                <th className="px-6 py-4">เบอร์โทร</th>
                <th className="px-6 py-4 text-center">งานที่เสร็จ</th>
                <th className="px-6 py-4 text-center">สถานะใช้งาน</th>
                <th className="px-6 py-4 text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังโหลดข้อมูลผู้ใช้งาน...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                    ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isTemp = !!u.expiresAt;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-slate-900 font-bold">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 text-slate-900 font-bold">
                        <div className="flex items-center space-x-2">
                          <span>{u.name}</span>
                          {isTemp && (
                            <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center space-x-1">
                              <span>⚡</span>
                              <span>Admin ชั่วคราว (1 วัน)</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-flex items-center space-x-1.5 ${
                          u.role === 'ADMIN' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200' 
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}>
                          {u.role === 'ADMIN' ? (
                            <>
                              <Shield className="w-3.5 h-3.5 text-amber-600" />
                              <span>ผู้ดูแลระบบ</span>
                            </>
                          ) : (
                            <>
                              <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                              <span>ช่างซ่อม</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-mono font-medium">
                        {u.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-center font-extrabold text-emerald-700">
                        {u._count?.repairJobs || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-flex items-center space-x-1.5 ${
                          u.active 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.active ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
                          <span>{u.active ? 'ใช้งานปกติ' : 'ระงับใช้งาน'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleToggleActive(u)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border inline-flex items-center space-x-1 ${
                            u.active 
                              ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {u.active ? (
                            <>
                              <Ban className="w-3.5 h-3.5" />
                              <span>ระงับใช้งาน</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>คืนสิทธิ์ใช้งาน</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

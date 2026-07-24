'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

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
        <div class="text-left space-y-3">
          ${
            isCallerTempAdmin
              ? `<div class="p-3 bg-amber-900/40 border border-amber-500/30 rounded-lg text-amber-200 text-xs mb-3">
                  ⚠️ คุณกำลังใช้งานด้วย <strong>บัญชี Admin ชั่วคราว</strong> สามารถสร้างได้เฉพาะ <strong>ผู้ดูแลระบบ (ADMIN)</strong> เท่านั้น
                  เมื่อสร้างสำเร็จ บัญชีชั่วคราวนี้จะถูกลบออกจากระบบทันที
                </div>`
              : ''
          }
          <div>
            <label class="block text-xs font-semibold text-emerald-200 mb-1">ชื่อผู้ใช้ (Username)</label>
            <input id="swal-input1" class="swal2-input bg-emerald-950/80 text-white border-emerald-600/50 w-full m-0 text-sm rounded-lg" placeholder="กรอกชื่อผู้ใช้">
          </div>
          <div>
            <label class="block text-xs font-semibold text-emerald-200 mb-1">รหัสผ่าน (Password)</label>
            <input id="swal-input2" type="password" class="swal2-input bg-emerald-950/80 text-white border-emerald-600/50 w-full m-0 text-sm rounded-lg" placeholder="กรอกรหัสผ่าน">
          </div>
          <div>
            <label class="block text-xs font-semibold text-emerald-200 mb-1">ชื่อ-นามสกุล</label>
            <input id="swal-input3" class="swal2-input bg-emerald-950/80 text-white border-emerald-600/50 w-full m-0 text-sm rounded-lg" placeholder="ชื่อ-นามสกุล">
          </div>
          <div>
            <label class="block text-xs font-semibold text-emerald-200 mb-1">บทบาท (Role)</label>
            <select id="swal-input4" class="swal2-select bg-emerald-950/80 text-white border-emerald-600/50 w-full m-0 text-sm rounded-lg" ${
              isCallerTempAdmin ? 'disabled' : ''
            }>
              <option value="ADMIN" ${isCallerTempAdmin ? 'selected' : ''}>ผู้ดูแลระบบ (ADMIN)</option>
              <option value="TECHNICIAN" ${isCallerTempAdmin ? '' : 'selected'}>ช่างซ่อม (TECHNICIAN)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-emerald-200 mb-1">เบอร์โทรศัพท์ (ถ้ามี)</label>
            <input id="swal-input5" class="swal2-input bg-emerald-950/80 text-white border-emerald-600/50 w-full m-0 text-sm rounded-lg" placeholder="08XXXXXXXX">
          </div>
        </div>
      `,
      focusConfirm: false,
      background: '#0f3e30',
      color: '#fff',
      confirmButtonColor: '#10b981',
      showCancelButton: true,
      cancelButtonColor: '#334155',
      confirmButtonText: 'บันทึกข้อมูล',
      cancelButtonText: 'ยกเลิก',
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
        Swal.fire({ title: 'ข้อผิดพลาด', text: 'กรุณากรอกข้อมูลให้ครบถ้วน', icon: 'error', background: '#0f3e30', color: '#fff' });
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
              background: '#0f3e30',
              color: '#fff',
              confirmButtonText: 'ตกลง (ไปหน้าล็อกอิน)'
            });
            signOut({ callbackUrl: '/login' });
            return;
          }

          Swal.fire({ title: 'สำเร็จ!', text: 'เพิ่มผู้ใช้งานเรียบร้อยแล้ว', icon: 'success', background: '#0f3e30', color: '#fff' });
          fetchUsers();
        } else {
          Swal.fire({ title: 'ข้อผิดพลาด', text: resData.error || 'ไม่สามารถเพิ่มผู้ใช้งานได้', icon: 'error', background: '#0f3e30', color: '#fff' });
        }
      } catch (e) {
        Swal.fire({ title: 'ข้อผิดพลาด', text: 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์', icon: 'error', background: '#0f3e30', color: '#fff' });
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
      confirmButtonColor: isSuspending ? '#ef4444' : '#10b981',
      cancelButtonColor: '#334155',
      confirmButtonText: `ยืนยัน${actionText}`,
      cancelButtonText: 'ยกเลิก',
      background: '#0f3e30',
      color: '#fff'
    });

    if (!confirm.isConfirmed) return;

    try {
      if (isSuspending) {
        // Deactivate user
        await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
      } else {
        // Reactivate user
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ active: true })
        });
      }
      Swal.fire({ title: 'สำเร็จ!', text: `ทำการ${actionText}ผู้ใช้งานเรียบร้อยแล้ว`, icon: 'success', background: '#0f3e30', color: '#fff' });
      fetchUsers();
    } catch (error) {
      console.error(error);
      Swal.fire({ title: 'ข้อผิดพลาด', text: 'ไม่สามารถเปลี่ยนสถานะผู้ใช้งานได้', icon: 'error', background: '#0f3e30', color: '#fff' });
    }
  };

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (statusFilter === 'ACTIVE' && !u.active) return false;
    if (statusFilter === 'SUSPENDED' && u.active) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <span>👥</span>
            <span>จัดการผู้ใช้งานในระบบ</span>
          </h2>
          <p className="text-sm text-emerald-200/70 mt-1">
            จัดการบัญชีผู้ดูแลระบบ (Admin) และช่างซ่อม (Technician) รวมถึงการระงับบัญชีใช้งาน
          </p>
        </div>

        <button 
          onClick={handleAddUser}
          className="btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30"
        >
          <span>+</span>
          <span>{isTempAdmin ? 'สร้างบัญชี ADMIN หลัก' : 'เพิ่มผู้ใช้งานใหม่'}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center space-x-2">
            <span className="text-emerald-200/80">บทบาท:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-emerald-950/80 border border-emerald-500/30 text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="ADMIN">ผู้ดูแลระบบ (ADMIN)</option>
              <option value="TECHNICIAN">ช่างซ่อม (TECHNICIAN)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-emerald-200/80">สถานะ:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-emerald-950/80 border border-emerald-500/30 text-white rounded-lg px-3 py-1.5 text-xs outline-none focus:border-emerald-400"
            >
              <option value="ALL">ทั้งหมด</option>
              <option value="ACTIVE">ใช้งานปกติ</option>
              <option value="SUSPENDED">ระงับใช้งาน</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-emerald-300/80 font-medium">
          แสดงข้อมูลทั้งหมด <strong className="text-white">{filteredUsers.length}</strong> รายการ
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-xl border border-emerald-500/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-emerald-950/70 text-emerald-200/90 text-xs uppercase tracking-wider border-b border-emerald-500/20">
              <tr>
                <th className="px-6 py-4 font-semibold">Username</th>
                <th className="px-6 py-4 font-semibold">ชื่อ-นามสกุล</th>
                <th className="px-6 py-4 font-semibold">ตำแหน่ง / สิทธิ์</th>
                <th className="px-6 py-4 font-semibold">เบอร์โทร</th>
                <th className="px-6 py-4 font-semibold text-center">งานที่เสร็จ</th>
                <th className="px-6 py-4 font-semibold text-center">สถานะใช้งาน</th>
                <th className="px-6 py-4 font-semibold text-right">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-500/10 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-emerald-300/70 font-medium">
                    <div className="inline-flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>กำลังโหลดข้อมูลผู้ใช้งาน...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-emerald-300/60 font-medium">
                    ไม่พบข้อมูลผู้ใช้งานที่ตรงตามเงื่อนไข
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isTemp = !!u.expiresAt;
                  return (
                    <tr key={u.id} className="hover:bg-emerald-900/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-emerald-200 font-medium">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        <div className="flex items-center space-x-2">
                          <span>{u.name}</span>
                          {isTemp && (
                            <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded-full font-sans">
                              ⚡ Admin ชั่วคราว (1 วัน)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${
                          u.role === 'ADMIN' 
                            ? 'bg-amber-950/60 text-amber-300 border-amber-500/40' 
                            : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {u.role === 'ADMIN' ? '🛡️ ผู้ดูแลระบบ' : '🔧 ช่างซ่อม'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-emerald-200/80 font-mono">
                        {u.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-emerald-400">
                        {u._count?.repairJobs || 0}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center space-x-1 ${
                          u.active 
                            ? 'text-emerald-300 bg-emerald-950/80 border border-emerald-500/30' 
                            : 'text-red-300 bg-red-950/80 border border-red-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${u.active ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
                          <span>{u.active ? 'ใช้งานปกติ' : 'ระงับใช้งาน'}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleToggleActive(u)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                            u.active 
                              ? 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-900/60' 
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/60'
                          }`}
                        >
                          {u.active ? '🛑 ระงับใช้งาน' : '✅ คืนสิทธิ์ใช้งาน'}
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

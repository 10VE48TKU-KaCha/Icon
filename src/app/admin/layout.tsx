import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
        <div className="mb-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-500 flex items-center justify-center font-bold text-white">IC</div>
          <h1 className="text-xl font-bold text-white">Icon Multimedia</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin" className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors">
            แดชบอร์ด
          </Link>
          <Link href="/admin/repair-jobs" className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors">
            งานซ่อมทั้งหมด
          </Link>
          <Link href="/admin/users" className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors">
            จัดการผู้ใช้งาน
          </Link>
          <Link href="/admin/settings" className="block px-4 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-cyan-400 transition-colors">
            ตั้งค่าระบบ
          </Link>
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold">
              {session.user.name?.charAt(0) || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{session.user.name}</p>
              <p className="text-xs text-slate-400">ผู้ดูแลระบบ</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950">
        {children}
      </main>
    </div>
  );
}

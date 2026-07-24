import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function TechnicianLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-200 font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-600">
            ICON MULTIMEDIA
          </h1>
          <p className="text-xs text-slate-500 mt-1">Technician Portal</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/technician" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            แดชบอร์ด
          </Link>
          <Link href="/technician/search" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            ค้นหางานซ่อม
          </Link>
          <Link href="/technician/customers" className="block px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white">
            จัดการลูกค้า
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-cyan-900/50 flex items-center justify-center text-cyan-400 font-bold">
              {session.user?.name?.[0] || 'U'}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">{session.user?.name}</div>
              <div className="text-xs text-slate-500">{session.user?.role}</div>
            </div>
          </div>
          {/* Typically you'd have a form with action={async () => { "use server"; await signOut(); }} here, 
              but for simplicity in layout we will just link to an API or use a client component if needed. 
              Here I'll add a simple link to a logout route assuming you handle it. */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { Wrench, Lock, User, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูล",
        text: "โปรดกรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน",
        confirmButtonText: "ตกลง"
      });
      return;
    }

    setLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        Swal.fire({
          icon: "error",
          title: "เข้าสู่ระบบไม่สำเร็จ",
          text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือบัญชีอาจถูกระงับ/หมดอายุแล้ว",
          confirmButtonText: "ตกลง"
        });
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้",
        confirmButtonText: "ตกลง"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden text-slate-800 font-sans">
      {/* Decorative background emerald glowing elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-b from-emerald-100/60 to-transparent blur-3xl -z-10 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 animate-slideUp">
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center shadow-xl">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-600/20 mb-4">
              <Wrench className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
              ICON <span className="text-emerald-600">MULTIMEDIA</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm font-medium tracking-wide">
              ระบบการจัดการซ่อมสินค้าและผู้ใช้งาน (Management Portal)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" />
                <span>ชื่อผู้ใช้ (Username)</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl input-styled text-sm font-medium"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 flex items-center space-x-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>รหัสผ่าน (Password)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl input-styled text-sm font-medium"
                placeholder="กรอกรหัสผ่านของคุณ"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide mt-3 flex justify-center items-center space-x-2 shadow-md"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                </div>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>เข้าสู่ระบบ</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 text-xs text-slate-400 font-medium">
            &copy; {new Date().getFullYear()} Icon Multimedia Repair System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

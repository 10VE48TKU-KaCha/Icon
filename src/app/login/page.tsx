"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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
    <div className="min-h-screen flex items-center justify-center animated-gradient-bg p-4 relative overflow-hidden">
      {/* Decorative background emerald glowing elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse-glow"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl mix-blend-screen animate-pulse-glow" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="w-full max-w-md z-10 animate-slideUp">
        <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border border-emerald-500/30 shadow-2xl">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-emerald-500/40 mb-4">
              I
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-white tracking-wider mb-1">
              ICON MULTIMEDIA
            </h1>
            <p className="text-emerald-200/80 text-sm font-medium tracking-wide">
              ระบบการจัดการซ่อมสินค้าและผู้ใช้งาน
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-2">
                ชื่อผู้ใช้ (Username)
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl input-styled text-sm focus:ring-0"
                placeholder="กรอกชื่อผู้ใช้ของคุณ"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-emerald-200 mb-2">
                รหัสผ่าน (Password)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl input-styled text-sm focus:ring-0"
                placeholder="กรอกรหัสผ่านของคุณ"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide mt-2 flex justify-center items-center shadow-lg shadow-emerald-600/40"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>กำลังตรวจสอบสิทธิ์...</span>
                </div>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
          
          <div className="mt-8 text-xs text-emerald-300/50 font-medium">
            &copy; {new Date().getFullYear()} Icon Multimedia Repair System. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

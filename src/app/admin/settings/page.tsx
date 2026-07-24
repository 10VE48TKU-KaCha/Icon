'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>({
    shopName: '',
    shopAddress: '',
    shopPhone: '',
    receiptHeader: '',
    receiptFooter: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        setSettings({
          shopName: data.shopName || '',
          shopAddress: data.shopAddress || '',
          shopPhone: data.shopPhone || '',
          receiptHeader: data.receiptHeader || '',
          receiptFooter: data.receiptFooter || ''
        });
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const promises = Object.keys(settings).map(key => 
        fetch('/api/settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value: settings[key] })
        })
      );
      
      await Promise.all(promises);
      Swal.fire({
        title: 'สำเร็จ',
        text: 'บันทึกการตั้งค่าระบบเรียบร้อยแล้ว',
        icon: 'success',
        background: '#0f3e30',
        color: '#fff',
        confirmButtonColor: '#10b981'
      });
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกการตั้งค่าได้',
        icon: 'error',
        background: '#0f3e30',
        color: '#fff'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-24 text-emerald-300 font-medium flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      <span>กำลังโหลดข้อมูลตั้งค่าระบบ...</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <span>⚙️</span>
          <span>ตั้งค่าระบบและใบรับซ่อม</span>
        </h2>
        <p className="text-sm text-emerald-200/70">กำหนดข้อมูลร้านค้า เบอร์โทรศัพท์ และข้อความเงื่อนไขส่วนท้ายใบรับซ่อม</p>
      </div>

      <div className="glass-card border border-emerald-500/20 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-200">ชื่อร้านค้า / ศูนย์บริการ</label>
              <input 
                type="text" 
                name="shopName"
                value={settings.shopName}
                onChange={handleChange}
                className="w-full bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-200">เบอร์โทรศัพท์ร้าน</label>
              <input 
                type="text" 
                name="shopPhone"
                value={settings.shopPhone}
                onChange={handleChange}
                className="w-full bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 text-sm font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-emerald-200">ที่อยู่ร้านค้า</label>
            <textarea 
              name="shopAddress"
              value={settings.shopAddress}
              onChange={handleChange}
              rows={3}
              className="w-full bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 text-sm resize-none"
            />
          </div>

          <div className="border-t border-emerald-500/20 pt-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🧾</span>
              <span>การตั้งค่าข้อความใบเสร็จ / ใบรับซ่อม</span>
            </h3>
            
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-200">ข้อความส่วนหัวใบเสร็จ</label>
              <textarea 
                name="receiptHeader"
                value={settings.receiptHeader}
                onChange={handleChange}
                rows={2}
                className="w-full bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 text-sm resize-none"
                placeholder="เช่น ใบรับซ่อมสินค้า / ใบเสร็จรับเงิน Icon Multimedia"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-emerald-200">ข้อความส่วนท้ายใบเสร็จ (เงื่อนไขการรับประกัน)</label>
              <textarea 
                name="receiptFooter"
                value={settings.receiptFooter}
                onChange={handleChange}
                rows={4}
                className="w-full bg-emerald-950/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-400 text-sm resize-none"
                placeholder="เช่น รับประกันงานซ่อม 30 วัน..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary disabled:opacity-50 px-8 py-3 rounded-xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/40"
            >
              {saving ? 'กำลังบันทึก...' : '💾 บันทึกการตั้งค่า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

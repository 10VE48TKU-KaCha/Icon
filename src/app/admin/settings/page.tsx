'use client';

import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Settings, Save, Store, Receipt } from 'lucide-react';

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
        background: '#ffffff',
        color: '#0f172a',
        confirmButtonColor: '#059669'
      });
    } catch (error) {
      Swal.fire({
        title: 'ข้อผิดพลาด',
        text: 'ไม่สามารถบันทึกการตั้งค่าได้',
        icon: 'error',
        background: '#ffffff',
        color: '#0f172a'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="text-center py-24 text-emerald-700 font-medium flex items-center justify-center space-x-2">
      <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      <span>กำลังโหลดข้อมูลตั้งค่าระบบ...</span>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-slate-800">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <Settings className="w-7 h-7 text-emerald-600" />
          <span>ตั้งค่าระบบและใบรับซ่อม (System Settings)</span>
        </h2>
        <p className="text-sm text-slate-500 font-medium mt-1">กำหนดข้อมูลร้านค้า เบอร์โทรศัพท์ และข้อความเงื่อนไขส่วนท้ายใบรับซ่อม</p>
      </div>

      <div className="glass-card p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex items-center space-x-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>ข้อมูลร้านค้า (Shop Information)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">ชื่อร้านค้า / ศูนย์บริการ</label>
              <input 
                type="text" 
                name="shopName"
                value={settings.shopName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">เบอร์โทรศัพท์ร้าน</label>
              <input 
                type="text" 
                name="shopPhone"
                value={settings.shopPhone}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-mono font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">ที่อยู่ร้านค้า</label>
            <textarea 
              name="shopAddress"
              value={settings.shopAddress}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium resize-none"
            />
          </div>

          <div className="border-t border-slate-100 pt-6 space-y-6">
            <div className="flex items-center space-x-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              <Receipt className="w-5 h-5 text-emerald-600" />
              <span>การตั้งค่าข้อความใบเสร็จ / ใบรับซ่อม</span>
            </div>
            
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">ข้อความส่วนหัวใบเสร็จ</label>
              <textarea 
                name="receiptHeader"
                value={settings.receiptHeader}
                onChange={handleChange}
                rows={2}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium resize-none"
                placeholder="เช่น ใบรับซ่อมสินค้า / ใบเสร็จรับเงิน Icon Multimedia"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">ข้อความส่วนท้ายใบเสร็จ (เงื่อนไขการรับประกัน)</label>
              <textarea 
                name="receiptFooter"
                value={settings.receiptFooter}
                onChange={handleChange}
                rows={4}
                className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 text-sm font-medium resize-none"
                placeholder="เช่น รับประกันงานซ่อม 30 วัน..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="btn-primary disabled:opacity-50 px-8 py-3 rounded-xl font-bold text-sm flex items-center space-x-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

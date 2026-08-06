import { useState } from 'react';
import { AdminCard } from '@/pages/AdminLayout';
import { useToast } from '@/contexts/ToastContext';

export default function AdminSettings() {
  const { showToast } = useToast();
  const [siteName, setSiteName] = useState('Coupon Hub');
  const [maintenance, setMaintenance] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('บันทึกการตั้งค่าเรียบร้อย', 'success');
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">ตั้งค่าระบบ (Admin Settings)</h1>
        <p className="text-xs text-slate-400">จัดการการตั้งค่าทั่วไปของเว็บไซต์ Coupon Hub</p>
      </div>

      <AdminCard title="ตั้งค่าทั่วไป">
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div>
            <label className="mb-1 block text-xs text-slate-300">ชื่อเว็บไซต์</label>
            <input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
          </div>
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs">
              <input type="checkbox" checked={maintenance} onChange={(e) => setMaintenance(e.target.checked)} className="rounded border-white/10 bg-[#0a0c18] text-[#f72585]" />
              โหมดปิดปรับปรุงระบบ (Maintenance Mode)
            </label>
          </div>
          <button type="submit" disabled={saving} className="rounded-lg bg-[#f72585] px-4 py-2 text-xs font-bold text-white hover:opacity-90">
            {saving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </button>
        </form>
      </AdminCard>
    </div>
  );
}

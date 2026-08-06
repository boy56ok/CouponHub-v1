import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';
import { AdminCard } from '@/pages/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';
import { fetchCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/services/couponService';
import { fetchStores, fetchCategories } from '@/services/couponService';
import { useToast } from '@/contexts/ToastContext';
import { formatDate, slugify } from '@/lib/utils';
import type { Coupon } from '@/types';

const emptyForm = {
  store_id: '',
  category_id: '',
  title: '',
  description: '',
  code: '',
  discount_type: 'fixed' as const,
  discount_value: '',
  expires_at: '',
  is_featured: false,
  is_active: true,
};

export default function AdminCoupons() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Coupon | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const { data: coupons, isLoading, error, refetch } = useQuery({ queryKey: ['coupons', 'all'], queryFn: () => fetchCoupons({ limit: 1000 }) });
  const { data: stores } = useQuery({ queryKey: ['stores'], queryFn: fetchStores });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const openCreate = () => { setEditing(null); setForm({ ...emptyForm, store_id: stores?.[0]?.id || '', expires_at: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) }); setModalOpen(true); };
  const openEdit = (c: Coupon) => {
    setEditing(c);
    setForm({ store_id: c.store_id, category_id: c.category_id || '', title: c.title, description: c.description, code: c.code, discount_type: c.discount_type, discount_value: c.discount_value, expires_at: c.expires_at, is_featured: c.is_featured, is_active: c.is_active });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.store_id || !form.title || !form.code || !form.expires_at) { showToast('กรุณากรอกข้อมูลให้ครบ', 'error'); return; }
    setSaving(true);
    try {
      const payload = { ...form, category_id: form.category_id || null };
      if (editing) {
        await updateCoupon(editing.id, payload);
        showToast('แก้ไขคูปองแล้ว', 'success');
      } else {
        await createCoupon(payload as Omit<Coupon, 'id' | 'created_at' | 'usage_count'>);
        showToast('เพิ่มคูปองแล้ว', 'success');
      }
      qc.invalidateQueries({ queryKey: ['coupons'] });
      setModalOpen(false);
    } catch (err) {
      showToast('เกิดข้อผิดพลาด ไม่สามารถบันทึกได้', 'error');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ต้องการลบคูปองนี้ใช่ไหม?')) return;
    try {
      await deleteCoupon(id);
      qc.invalidateQueries({ queryKey: ['coupons'] });
      showToast('ลบคูปองแล้ว', 'info');
    } catch {
      showToast('ไม่สามารถลบได้', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold">จัดการคูปอง</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-4 py-2 text-sm font-semibold"><Plus size={16} /> เพิ่มคูปอง</button>
      </div>

      {error ? <ErrorState message="ไม่สามารถโหลดคูปองได้" onRetry={refetch} /> : isLoading ? <LoadingState /> : !coupons || coupons.length === 0 ? <EmptyState title="ยังไม่มีคูปอง" /> : (
        <div className="overflow-x-auto rounded-xl border border-[#242940]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#242940] bg-[#0a0c18] text-slate-400">
              <tr>
                <th className="px-4 py-3">ร้านค้า</th>
                <th className="px-4 py-3">ชื่อคูปอง</th>
                <th className="px-4 py-3">โค้ด</th>
                <th className="px-4 py-3">หมดอายุ</th>
                <th className="px-4 py-3">ใช้แล้ว</th>
                <th className="px-4 py-3">สถานะ</th>
                <th className="px-4 py-3 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/[.02]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded text-xs font-bold text-white" style={{ background: c.store?.logo_color }}>{c.store?.logo}</div>
                      {c.store?.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px] truncate">{c.title}</td>
                  <td className="px-4 py-3"><code className="rounded bg-[#1c1026] px-1.5 py-0.5 text-[#f6aecf]">{c.code}</code></td>
                  <td className="px-4 py-3">{formatDate(c.expires_at)}</td>
                  <td className="px-4 py-3">{c.usage_count}</td>
                  <td className="px-4 py-3">
                    {c.is_active ? <span className="rounded bg-green-950 px-1.5 py-0.5 text-green-400">ใช้งาน</span> : <span className="rounded bg-red-950 px-1.5 py-0.5 text-red-400">ปิด</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(c)} className="grid h-7 w-7 place-items-center rounded border border-white/10 hover:bg-white/5"><Pencil size={13} /></button>
                      <button onClick={() => handleDelete(c.id)} className="grid h-7 w-7 place-items-center rounded border border-red-500/20 text-red-400 hover:bg-red-500/10"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-[#0e1121] p-5 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold">{editing ? 'แก้ไขคูปอง' : 'เพิ่มคูปองใหม่'}</h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">ร้านค้า</label>
                  <select value={form.store_id} onChange={(e) => setForm({ ...form, store_id: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]">
                    <option value="">เลือกร้านค้า</option>
                    {stores?.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">หมวดหมู่</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]">
                    <option value="">ไม่ระบุ</option>
                    {categories?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">ชื่อคูปอง</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">รายละเอียด</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">โค้ด</label>
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">ประเภทส่วนลด</label>
                  <select value={form.discount_type} onChange={(e) => setForm({ ...form, discount_type: e.target.value as Coupon['discount_type'] })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]">
                    <option value="fixed">ลดราคา (บาท)</option>
                    <option value="percent">ลดราคา (%)</option>
                    <option value="free_shipping">ส่งฟรี</option>
                    <option value="gift">ของแถม</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">มูลค่า</label>
                  <input value={form.discount_value} onChange={(e) => setForm({ ...form, discount_value: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">วันหมดอายุ</label>
                  <input type="date" value={form.expires_at} onChange={(e) => setForm({ ...form, expires_at: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
                </div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> แนะนำ</label>
                <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> ใช้งาน</label>
              </div>
              <button type="submit" disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] py-2.5 text-sm font-semibold disabled:opacity-50">
                {saving && <Loader2 size={16} className="animate-spin" />} {editing ? 'บันทึก' : 'เพิ่มคูปอง'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

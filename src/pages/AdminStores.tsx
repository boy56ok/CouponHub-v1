import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminCard } from '@/pages/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';
import { fetchStores, createStore, updateStore, deleteStore } from '@/services/couponService';
import { useToast } from '@/contexts/ToastContext';
import { slugify } from '@/lib/utils';
import type { Store } from '@/types';

const emptyForm = {
  name: '',
  slug: '',
  logo: 'S',
  logo_color: 'bg-[#f45126]',
  description: '',
  banner_color: 'from-[#140d39] to-[#22052f]',
  website: '',
  rating: 4.8,
  is_featured: false,
};

export default function AdminStores() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Store | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const { data: stores, isLoading, error } = useQuery({ queryKey: ['stores'], queryFn: fetchStores });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (store: Store) => {
    setEditing(store);
    setForm({
      name: store.name,
      slug: store.slug,
      logo: store.logo,
      logo_color: store.logo_color,
      description: store.description,
      banner_color: store.banner_color,
      website: store.website,
      rating: store.rating,
      is_featured: store.is_featured,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      showToast('กรุณากรอกชื่อร้านค้า', 'error');
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.name);
      if (editing) {
        await updateStore(editing.id, { ...form, slug });
        showToast('แก้ไขร้านค้าเรียบร้อย', 'success');
      } else {
        await createStore({ ...form, slug });
        showToast('เพิ่มร้านค้าเรียบร้อย', 'success');
      }
      qc.invalidateQueries({ queryKey: ['stores'] });
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบร้านค้านี้?')) return;
    try {
      await deleteStore(id);
      qc.invalidateQueries({ queryKey: ['stores'] });
      showToast('ลบร้านค้าเรียบร้อย', 'success');
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถลบได้', 'error');
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="ไม่สามารถโหลดข้อมูลร้านค้าได้" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">จัดการร้านค้า</h1>
          <p className="text-xs text-slate-400">เพิ่ม แก้ไข หรือลบร้านค้าพาร์ทเนอร์</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:opacity-90">
          <Plus size={16} /> เพิ่มร้านค้า
        </button>
      </div>

      <AdminCard title="รายการร้านค้าทั้งหมด">
        {stores?.length === 0 ? (
          <EmptyState title="ไม่พบร้านค้า" message="ยังไม่มีร้านค้า" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">ร้านค้า</th>
                  <th className="pb-3 font-semibold">Slug</th>
                  <th className="pb-3 font-semibold">เว็บไซต์</th>
                  <th className="pb-3 font-semibold">คะแนน</th>
                  <th className="pb-3 font-semibold">แนะนำ</th>
                  <th className="pb-3 text-right font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stores?.map((store) => (
                  <tr key={store.id} className="hover:bg-white/[0.02]">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-bold text-white ${store.logo_color}`}>{store.logo}</div>
                        <div>
                          <p className="font-medium text-white">{store.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{store.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{store.slug}</td>
                    <td className="py-3 text-slate-400 truncate max-w-[150px]">{store.website}</td>
                    <td className="py-3 text-amber-400 font-semibold">★ {store.rating}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${store.is_featured ? 'bg-[#fa247b]/20 text-[#ff55a5]' : 'bg-white/5 text-slate-400'}`}>
                        {store.is_featured ? 'แนะนำ' : 'ทั่วไป'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(store)} className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" title="แก้ไข">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(store.id)} className="rounded p-1 text-red-400 hover:bg-red-500/10" title="ลบ">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0d1020] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4 text-base font-bold">{editing ? 'แก้ไขร้านค้า' : 'เพิ่มร้านค้าใหม่'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">ชื่อร้านค้า</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">โลโก้ (ตัวอักษรย่อ)</label>
                  <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">คลาสสีโลโก้ (Tailwind)</label>
                  <input value={form.logo_color} onChange={(e) => setForm({ ...form, logo_color: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">คำอธิบาย</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">เว็บไซต์</label>
                  <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" placeholder="https://..." />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">คะแนน (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) || 5 })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer text-xs">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded border-white/10 bg-[#0a0c18] text-[#f72585]" />
                  ร้านค้ายอดนิยม (Featured)
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5">ยกเลิก</button>
                <button type="submit" disabled={saving} className="rounded-lg bg-[#f72585] px-4 py-2 text-xs font-bold text-white hover:opacity-90">{saving ? 'กำลังบันทึก...' : 'บันทึก'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

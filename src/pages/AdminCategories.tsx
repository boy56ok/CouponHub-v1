import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { AdminCard } from '@/pages/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/couponService';
import { useToast } from '@/contexts/ToastContext';
import { slugify } from '@/lib/utils';
import type { Category } from '@/types';

const emptyForm = {
  name: '',
  slug: '',
  icon: 'Tag',
  color: 'pink',
  sort_order: 0,
  is_active: true,
};

export default function AdminCategories() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);

  const { data: categories, isLoading, error } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      color: cat.color,
      sort_order: cat.sort_order,
      is_active: cat.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) {
      showToast('กรุณากรอกชื่อหมวดหมู่', 'error');
      return;
    }
    setSaving(true);
    try {
      const slug = form.slug || slugify(form.name);
      if (editing) {
        await updateCategory(editing.id, { ...form, slug });
        showToast('แก้ไขหมวดหมู่เรียบร้อย', 'success');
      } else {
        await createCategory({ ...form, slug });
        showToast('เพิ่มหมวดหมู่เรียบร้อย', 'success');
      }
      qc.invalidateQueries({ queryKey: ['categories'] });
      setModalOpen(false);
    } catch (err: any) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบหมวดหมู่นี้?')) return;
    try {
      await deleteCategory(id);
      qc.invalidateQueries({ queryKey: ['categories'] });
      showToast('ลบหมวดหมู่เรียบร้อย', 'success');
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถลบได้', 'error');
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="ไม่สามารถโหลดข้อมูลหมวดหมู่ได้" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">จัดการหมวดหมู่</h1>
          <p className="text-xs text-slate-400">เพิ่ม แก้ไข หรือลบหมวดหมู่คูปอง</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-4 py-2 text-xs font-bold text-white shadow-lg transition hover:opacity-90">
          <Plus size={16} /> เพิ่มหมวดหมู่
        </button>
      </div>

      <AdminCard title="รายการหมวดหมู่ทั้งหมด">
        {categories?.length === 0 ? (
          <EmptyState title="ไม่พบหมวดหมู่" message="ยังไม่มีหมวดหมู่" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">ชื่อหมวดหมู่</th>
                  <th className="pb-3 font-semibold">Slug</th>
                  <th className="pb-3 font-semibold">ไอคอน / สี</th>
                  <th className="pb-3 font-semibold">ลำดับ</th>
                  <th className="pb-3 font-semibold">สถานะ</th>
                  <th className="pb-3 text-right font-semibold">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories?.map((cat) => (
                  <tr key={cat.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-medium text-white">{cat.name}</td>
                    <td className="py-3 text-slate-400">{cat.slug}</td>
                    <td className="py-3">
                      <span className="rounded bg-white/10 px-2 py-1 font-mono text-[10px]">{cat.icon} ({cat.color})</span>
                    </td>
                    <td className="py-3 text-slate-400">{cat.sort_order}</td>
                    <td className="py-3">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${cat.is_active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {cat.is_active ? 'ใช้งาน' : 'ปิดใช้งาน'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(cat)} className="rounded p-1 text-slate-400 hover:bg-white/10 hover:text-white" title="แก้ไข">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => handleDelete(cat.id)} className="rounded p-1 text-red-400 hover:bg-red-500/10" title="ลบ">
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
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#0d1020] p-6 shadow-2xl">
            <h2 className="mb-4 text-base font-bold">{editing ? 'แก้ไขหมวดหมู่' : 'เพิ่มหมวดหมู่ใหม่'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-slate-300">ชื่อหมวดหมู่</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-300">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">ไอคอน (Lucide)</label>
                  <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-300">สี</label>
                  <select value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]">
                    <option value="pink">Pink</option>
                    <option value="rose">Rose</option>
                    <option value="amber">Amber</option>
                    <option value="blue">Blue</option>
                    <option value="cyan">Cyan</option>
                    <option value="sky">Sky</option>
                    <option value="teal">Teal</option>
                    <option value="slate">Slate</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">ลำดับการแสดงผล</label>
                  <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-white/10 bg-[#0a0c18] text-[#f72585]" />
                    เปิดใช้งาน
                  </label>
                </div>
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

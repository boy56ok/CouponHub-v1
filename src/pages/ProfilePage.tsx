import { useState } from 'react';
import { Loader2, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { updateProfile } from '@/services/userService';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState(profile?.display_name || '');
  const [avatar, setAvatar] = useState(profile?.avatar_url || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(user!.id, { display_name: name, avatar_url: avatar });
      await refreshProfile();
      showToast('อัปเดตโปรไฟล์สำเร็จ!', 'success');
    } catch { showToast('ไม่สามารถอัปเดตโปรไฟล์ได้', 'error'); }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">โปรไฟล์ของฉัน</h1>
      <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-[#e9549c] bg-gradient-to-br from-[#55453e] to-[#14182d] text-2xl font-bold text-[#ffd9ee]">{name?.charAt(0).toUpperCase() || 'U'}</div>
          <div>
            <p className="text-sm font-semibold">{profile?.email}</p>
            <span className={`mt-1 inline-block rounded px-2 py-0.5 text-[10px] ${profile?.role === 'admin' ? 'bg-[#7527bc] text-white' : 'bg-white/10 text-slate-300'}`}>{profile?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'สมาชิก'}</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs text-slate-300">ชื่อที่ใช้แสดง</label>
            <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2.5 focus-within:border-[#f72585]">
              <User size={16} className="text-slate-400" />
              <input value={name} onChange={(e) => setName(e.target.value)} className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-slate-300">URL รูปโปรไฟล์ (ถ้ามี)</label>
            <input value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2.5 text-sm outline-none focus:border-[#f72585]" />
          </div>
          <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-5 py-2.5 text-sm font-semibold disabled:opacity-50">
            {loading && <Loader2 size={16} className="animate-spin" />} บันทึก
          </button>
        </form>
      </div>
    </div>
  );
}

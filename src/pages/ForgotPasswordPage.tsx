import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Loader2, Mail, TicketPercent } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await resetPassword(email);
    setLoading(false);
    if (error) showToast(error, 'error');
    else { setSent(true); showToast('ส่งลิงก์รีเซ็ตรหัสผ่านแล้ว ตรวจสอบอีเมลของคุณ', 'success'); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[#fa398a] to-[#a42af7] text-white shadow-[0_0_30px_#ef238a66]"><TicketPercent size={28} /></div>
          <h1 className="text-2xl font-extrabold">ลืมรหัสผ่าน</h1>
          <p className="mt-1 text-xs text-slate-400">กรอกอีเมลเพื่อรีเซ็ตรหัสผ่าน</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0e1121] p-6">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-green-950 text-green-400"><Check size={24} /></div>
              <p className="text-sm text-slate-300">ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง {email} แล้ว</p>
              <Link to="/login" className="text-xs text-[#f34496] hover:underline">กลับสู่หน้าเข้าสู่ระบบ</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-slate-300">อีเมล</label>
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2.5 focus-within:border-[#f72585]">
                  <Mail size={16} className="text-slate-400" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-500" />
                </div>
              </div>
              <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                {loading && <Loader2 size={16} className="animate-spin" />}ส่งลิงก์รีเซ็ตรหัสผ่าน
              </button>
            </form>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">จำรหัสผ่านได้แล้ว? <Link to="/login" className="text-[#f34496] hover:underline">เข้าสู่ระบบ</Link></p>
      </div>
    </div>
  );
}

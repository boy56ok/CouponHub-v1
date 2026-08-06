import { useState } from 'react';
import { Send, Check } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';

export default function Newsletter() {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) { showToast('กรุณากรอกอีเมลให้ถูกต้อง', 'error'); return; }
    setSubscribed(true);
    showToast('สมัครรับข่าวสารแล้ว!', 'success');
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-[#542070] bg-gradient-to-br from-[#1b0f48] to-[#330c47] p-5">
      <div className="relative z-10">
        <Send size={28} className="mb-3 text-[#f04caa]" />
        <h2 className="text-lg font-bold">ไม่พลาดคูปองใหม่!</h2>
        <p className="mt-1 text-xs text-slate-300">รับคูปองเด็ดๆ ก่อนใคร อัปเดตทุกวัน</p>
        {subscribed ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#172e2d] px-3 py-3 text-xs text-[#6ee7b7]"><Check size={15} /> สมัครรับข่าวสารแล้ว ขอบคุณ!</div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="กรอกอีเมลของคุณ" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs outline-none placeholder:text-slate-500 focus:border-[#f72585]" />
            <button type="submit" className="rounded-lg bg-[#f72585] px-3 py-2 text-xs font-bold hover:bg-[#e91e6f]">สมัครฟรี</button>
          </form>
        )}
      </div>
      <div className="pointer-events-none absolute -bottom-6 -right-3 text-[126px] text-[#8526c7] opacity-25">✉</div>
    </div>
  );
}

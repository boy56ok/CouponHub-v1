import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Check, Clock3, Copy, Flame, Heart, Share2 } from 'lucide-react';
import type { CouponWithRelations } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { toggleFavorite } from '@/services/userService';
import { trackCouponUsage } from '@/services/couponService';
import { formatDate, daysUntilExpiry } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function CouponCard({ coupon }: { coupon: CouponWithRelations }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleCopy = async () => {
    navigator.clipboard?.writeText(coupon.code);
    setCopied(true);
    showToast(`คัดลอกโค้ด ${coupon.code} แล้ว`, 'success');
    await trackCouponUsage(coupon.id, user?.id);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const handleSave = async () => {
    if (!user) { navigate('/login'); return; }
    const isNow = await toggleFavorite(user.id, coupon.id);
    setSaved(isNow);
    showToast(isNow ? 'บันทึกคูปองแล้ว' : 'ยกเลิกบันทึกแล้ว', 'info');
  };

  const handleShare = async () => {
    if (navigator.share) { try { await navigator.share({ title: coupon.title, text: coupon.code, url: window.location.href }); } catch {} }
    else { navigator.clipboard?.writeText(coupon.code); showToast('คัดลอกโค้ดแล้ว', 'info'); }
  };

  const days = daysUntilExpiry(coupon.expires_at);
  const expired = days < 0;

  return (
    <article className="group rounded-xl border border-[#242a40] bg-gradient-to-br from-[#151a2b] to-[#0f1220] p-3 transition-all duration-200 hover:-translate-y-1 hover:border-[#b13182] hover:shadow-[0_8px_24px_#ea2a7c18]">
      <div className="flex items-start gap-2">
        <Link to={`/store/${coupon.store?.slug}`} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-lg font-extrabold text-white" style={{ background: coupon.store?.logo_color || '#f45126' }}>{coupon.store?.logo || 'S'}</Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className="truncate text-xs font-semibold">{coupon.store?.name}</p>
            {coupon.is_featured && <Flame size={14} className="shrink-0 text-[#ff3e91]" />}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-300">{coupon.description}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md border border-dashed border-[#c02a78] bg-[#1c1026] px-2 py-1.5">
        <span className="text-[11px] font-semibold text-[#f6aecf]">{coupon.code}</span>
        <button onClick={handleCopy} aria-label="คัดลอกโค้ด" className="text-[#ff67b0]">{copied ? <Check size={14} className="text-green-400" /> : <Copy size={13} />}</button>
      </div>
      <p className="mt-2 text-center text-[9px] text-slate-500">
        <Clock3 size={11} className="mr-1 inline" />{expired ? 'หมดอายุแล้ว' : `ใช้ได้ถึง ${formatDate(coupon.expires_at)}`}
        {!expired && days <= 3 && <span className="ml-1 text-[#ff6b6b]">· เหลือ {days} วัน!</span>}
      </p>
      <div className="mt-2 flex gap-2">
        <button onClick={handleCopy} className="flex-1 rounded-md bg-gradient-to-r from-[#fa247b] to-[#fa3caa] py-1.5 text-[10px] font-semibold text-white shadow-[0_3px_10px_#fa247b33]">{copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</button>
        <button onClick={() => setLiked(!liked)} className={`grid h-7 w-7 place-items-center rounded-md border transition ${liked ? 'border-[#f43d92] bg-[#2c1731] text-[#ff4d9b]' : 'border-[#30354a] bg-[#181d2d] text-[#7d859c]'}`} aria-label="ถูกใจ"><Heart size={14} fill={liked ? 'currentColor' : 'none'} /></button>
        <button onClick={handleSave} className={`grid h-7 w-7 place-items-center rounded-md border transition ${saved ? 'border-[#f43d92] bg-[#2c1731] text-[#ff4d9b]' : 'border-[#30354a] bg-[#181d2d] text-[#7d859c]'}`} aria-label="บันทึก"><Bookmark size={14} fill={saved ? 'currentColor' : 'none'} /></button>
        <button onClick={handleShare} className="grid h-7 w-7 place-items-center rounded-md border border-[#30354a] bg-[#181d2d] text-[#7d859c] transition hover:border-[#f43d92] hover:text-[#ff4d9b]" aria-label="แชร์"><Share2 size={14} /></button>
      </div>
    </article>
  );
}

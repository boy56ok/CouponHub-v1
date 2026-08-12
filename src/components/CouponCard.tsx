/* src/components/CouponCard.tsx */
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

  const days = daysUntilExpiry(coupon.expires_at);
  const expired = days < 0;

  return (
    <article className="group flex w-full flex-col rounded-xl border border-[#242a40] bg-gradient-to-br from-[#151a2b] to-[#0f1220] p-3 transition-all duration-200 hover:border-[#b13182] hover:shadow-[0_8px_24px_#ea2a7c18]">
      <div className="flex items-start gap-2">
        <Link to={`/store/${coupon.store?.slug}`} className="grid h-10 w-10 shrink-0 place-items-center rounded-md text-lg font-extrabold text-white" style={{ background: coupon.store?.logo_color || '#f45126' }}>
          {coupon.store?.logo || 'S'}
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className="truncate text-xs font-semibold text-white">{coupon.store?.name}</p>
            {coupon.is_featured && <Flame size={14} className="shrink-0 text-[#ff3e91]" />}
          </div>
          <p className="mt-0.5 truncate text-[11px] text-slate-300">{coupon.description}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 rounded-md border border-dashed border-[#c02a78] bg-[#1c1026] px-2 py-2">
        <span className="truncate text-[11px] font-bold text-[#f6aecf]">{coupon.code}</span>
        <button onClick={handleCopy} className="shrink-0 text-[#ff67b0]">
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={13} />}
        </button>
      </div>

      <p className="mt-2 text-center text-[10px] text-slate-500">
        <Clock3 size={11} className="mr-1 inline" />
        {expired ? 'หมดอายุแล้ว' : `ใช้ได้ถึง ${formatDate(coupon.expires_at)}`}
      </p>

      {/* ปรับส่วนปุ่มให้ยืดหยุ่น (Responsive Buttons) */}
      <div className="mt-3 flex flex-wrap gap-2">
        <button 
          onClick={handleCopy} 
          className="flex-1 min-w-[120px] rounded-md bg-gradient-to-r from-[#fa247b] to-[#fa3caa] py-2 text-[11px] font-bold text-white shadow-lg active:scale-95 transition-transform"
        >
          {copied ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}
        </button>
        
        <div className="flex gap-1">
          <button onClick={() => setLiked(!liked)} className={`grid h-8 w-8 place-items-center rounded-md border transition ${liked ? 'border-[#f43d92] bg-[#2c1731] text-[#ff4d9b]' : 'border-[#30354a] bg-[#181d2d] text-[#7d859c]'}`}>
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
          </button>
          <button onClick={handleSave} className={`grid h-8 w-8 place-items-center rounded-md border transition ${saved ? 'border-[#f43d92] bg-[#2c1731] text-[#ff4d9b]' : 'border-[#30354a] bg-[#181d2d] text-[#7d859c]'}`}>
            <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </article>
  );
}

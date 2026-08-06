import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bookmark, Trash2 } from 'lucide-react';
import { EmptyState, LoadingState } from '@/components/States';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { fetchFavorites, toggleFavorite } from '@/services/userService';
import { formatDate, daysUntilExpiry } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function SavedCoupons() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [removing, setRemoving] = useState<string | null>(null);

  const { data: favorites, isLoading } = useQuery({ queryKey: ['favorites', user?.id], queryFn: () => fetchFavorites(user!.id), enabled: !!user });

  const handleRemove = async (couponId: string) => {
    setRemoving(couponId);
    await toggleFavorite(user!.id, couponId);
    qc.invalidateQueries({ queryKey: ['favorites', user?.id] });
    setRemoving(null);
    showToast('ลบคูปองออกจากรายการบันทึกแล้ว', 'info');
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">คูปองที่บันทึกไว้</h1>
      {isLoading ? <LoadingState /> : !favorites || favorites.length === 0 ? (
        <EmptyState icon={<Bookmark size={32} />} title="ยังไม่มีคูปองที่บันทึก" message="กดปุ่มบันทึกบนคูปองที่คุณสนใจเพื่อเก็บไว้ดูภายหลัง" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => {
            const c = fav.coupon;
            if (!c) return null;
            const days = daysUntilExpiry(c.expires_at);
            const expired = days < 0;
            return (
              <div key={fav.id} className="rounded-xl border border-[#242a40] bg-[#101322] p-3">
                <Link to={`/store/${c.store?.slug}`} className="flex items-center gap-2">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-lg font-extrabold text-white" style={{ background: c.store?.logo_color || '#f45126' }}>{c.store?.logo || 'S'}</div>
                  <div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">{c.store?.name}</p><p className="truncate text-[11px] text-slate-300">{c.description}</p></div>
                </Link>
                <div className="mt-2 flex items-center justify-between rounded-md border border-dashed border-[#c02a78] bg-[#1c1026] px-2 py-1.5">
                  <span className="text-[11px] font-semibold text-[#f6aecf]">{c.code}</span>
                  <span className="text-[9px] text-slate-500">{expired ? 'หมดอายุ' : formatDate(c.expires_at)}</span>
                </div>
                <button onClick={() => handleRemove(c.id)} disabled={removing === c.id} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-white/10 py-1.5 text-[10px] text-red-400 hover:bg-red-500/10">
                  <Trash2 size={12} /> ลบออกจากรายการ
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

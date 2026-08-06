import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState, LoadingState } from '@/components/States';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { fetchStoreFavorites, toggleStoreFavorite } from '@/services/userService';

export default function FavoriteStores() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: stores, isLoading } = useQuery({ queryKey: ['storeFavorites', user?.id], queryFn: () => fetchStoreFavorites(user!.id), enabled: !!user });

  const handleRemove = async (storeId: string) => {
    await toggleStoreFavorite(user!.id, storeId);
    qc.invalidateQueries({ queryKey: ['storeFavorites', user?.id] });
    showToast('ลบออกจากร้านค้าที่ชื่นชอบแล้ว', 'info');
  };

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">ร้านค้าที่ชื่นชอบ</h1>
      {isLoading ? <LoadingState /> : !stores || stores.length === 0 ? (
        <EmptyState icon={<Heart size={32} />} title="ยังไม่มีร้านค้าที่ชื่นชอบ" message="กดปุ่มถูกใจบนร้านค้าเพื่อติดตามคูปองใหม่ๆ" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((sf) => {
            const s = sf.store;
            if (!s) return null;
            return (
              <div key={sf.id} className="rounded-xl border border-[#242a40] bg-[#101322] p-4">
                <Link to={`/store/${s.slug}`} className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-xl font-extrabold text-white" style={{ background: s.logo_color }}>{s.logo}</div>
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{s.name}</p><p className="flex items-center gap-1 text-[10px] text-slate-400"><Star size={11} className="text-[#ffce38]" fill="currentColor" /> {s.rating}</p></div>
                </Link>
                <p className="mt-2 line-clamp-2 text-[11px] text-slate-400">{s.description}</p>
                <button onClick={() => handleRemove(s.id)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-md border border-white/10 py-1.5 text-[10px] text-red-400 hover:bg-red-500/10">ลบออกจากรายการ</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

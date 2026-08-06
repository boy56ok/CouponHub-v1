import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/CouponCard';
import { LoadingState, EmptyState, ErrorState } from '@/components/States';
import { fetchStoreBySlug, fetchCouponsByStore } from '@/services/couponService';
import { fetchComments, addComment } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { timeAgo } from '@/lib/utils';

export default function StorePage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const { data: store, isLoading, error } = useQuery({ queryKey: ['store', slug], queryFn: () => fetchStoreBySlug(slug!), enabled: !!slug });
  const { data: coupons } = useQuery({ queryKey: ['storeCoupons', store?.id], queryFn: () => fetchCouponsByStore(store!.id), enabled: !!store?.id });
  const { data: comments, refetch: refetchComments } = useQuery({ queryKey: ['comments', store?.id], queryFn: () => fetchComments(store!.id), enabled: !!store?.id });

  if (isLoading) return <div className="min-h-screen bg-[#050712]"><Navbar /><LoadingState /></div>;
  if (error || !store) return <div className="min-h-screen bg-[#050712]"><Navbar /><div className="py-20"><ErrorState message="ไม่พบร้านค้านี้" /></div><Footer /></div>;

  const activeCoupons = coupons?.filter((c) => c.is_active && new Date(c.expires_at) >= new Date()) || [];
  const expiredCoupons = coupons?.filter((c) => !c.is_active || new Date(c.expires_at) < new Date()) || [];

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { showToast('กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น', 'error'); return; }
    if (!comment.trim()) return;
    try {
      await addComment(user.id, store.id, comment.trim(), rating);
      setComment(''); setRating(5);
      showToast('แสดงความคิดเห็นแล้ว!', 'success');
      refetchComments();
    } catch { showToast('ไม่สามารถแสดงความคิดเห็นได้', 'error'); }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <Navbar />
      <main className="relative mx-auto max-w-[1380px] px-5 py-4 lg:px-7">
        <nav className="mb-4 flex items-center gap-1 text-xs text-slate-400">
          <Link to="/" className="hover:text-[#ff55a5]">หน้าแรก</Link><ChevronRight size={12} />
          <Link to="/stores" className="hover:text-[#ff55a5]">ร้านค้า</Link><ChevronRight size={12} />
          <span className="text-slate-300">{store.name}</span>
        </nav>
        <div className="relative overflow-hidden rounded-xl border border-white/10 p-8" style={{ background: `linear-gradient(135deg, ${store.banner_color}, #050712)` }}>
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl text-2xl font-extrabold text-white" style={{ background: store.logo_color }}>{store.logo}</div>
            <div>
              <h1 className="text-2xl font-extrabold">{store.name}</h1>
              <div className="mt-1 flex items-center gap-3 text-sm text-slate-300">
                <span className="flex items-center gap-1"><Star size={14} className="text-[#ffce38]" fill="currentColor" /> {store.rating}</span>
                <span>·</span><span>{activeCoupons.length} คูปองใช้งานได้</span>
                {store.website && <><span>·</span><a href={`https://${store.website}`} target="_blank" rel="noopener noreferrer" className="text-[#f34496] hover:underline">{store.website}</a></>}
              </div>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm text-slate-300">{store.description}</p>
        </div>

        <section className="mt-6">
          <h2 className="mb-3 text-lg font-bold">คูปองที่ใช้งานได้ ({activeCoupons.length})</h2>
          {activeCoupons.length === 0 ? <EmptyState title="ยังไม่มีคูปองที่ใช้งานได้" message="กลับมาตรวจสอบใหม่ภายหลัง" /> : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activeCoupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
            </div>
          )}
        </section>

        {expiredCoupons.length > 0 && (
          <section className="mt-6">
            <h2 className="mb-3 text-lg font-bold text-slate-400">คูปองที่หมดอายุแล้ว ({expiredCoupons.length})</h2>
            <div className="grid gap-3 opacity-50 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {expiredCoupons.map((c) => <CouponCard key={c.id} coupon={c} />)}
            </div>
          </section>
        )}

        <section className="mt-6 rounded-xl border border-[#242940] bg-[#0e1121] p-5">
          <h2 className="mb-4 text-lg font-bold">ความคิดเห็นและรีวิว ({comments?.length || 0})</h2>
          {user && (
            <form onSubmit={handleSubmitComment} className="mb-4 space-y-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} onClick={() => setRating(n)} className={n <= rating ? 'text-[#ffce38]' : 'text-slate-600'}>
                    <Star size={20} fill={n <= rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="แสดงความคิดเห็น..." rows={3} className="w-full rounded-lg border border-white/10 bg-[#0a0c18] px-3 py-2 text-sm outline-none focus:border-[#f72585]" />
              <button type="submit" className="rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-5 py-2 text-sm font-semibold">ส่งความคิดเห็น</button>
            </form>
          )}
          <div className="space-y-3">
            {comments?.length === 0 && <p className="py-4 text-center text-sm text-slate-500">ยังไม่มีความคิดเห็น</p>}
            {comments?.map((c) => (
              <div key={c.id} className="rounded-lg border border-white/5 bg-[#0a0c18] p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-full border border-[#e9549c] bg-gradient-to-br from-[#55453e] to-[#14182d] text-xs font-bold">{c.profile?.display_name?.charAt(0).toUpperCase() || 'U'}</div>
                    <span className="text-xs font-semibold">{c.profile?.display_name || 'ผู้ใช้'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex">{Array.from({ length: c.rating }).map((_, i) => <Star key={i} size={10} className="text-[#ffce38]" fill="currentColor" />)}</span>
                    <span className="text-[10px] text-slate-500">{timeAgo(c.created_at)}</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-slate-300">{c.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

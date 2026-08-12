/* src/pages/HomePage.tsx */
import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock3, Flame, Grid2X2, Search, Star, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/CouponCard';
import CategoryCard from '@/components/CategoryCard';
import Newsletter from '@/components/Newsletter';
import { LoadingState, ErrorState } from '@/components/States';
import { fetchCategories, fetchCoupons, fetchStores } from '@/services/couponService';
import type { CouponWithRelations } from '@/types';
import { formatNumber } from '@/lib/utils';

const tabs = [
  { key: 'latest', label: 'คูปองล่าสุด', icon: 'zap' },
  { key: 'popular', label: 'ยอดนิยม', icon: 'star' },
  { key: 'ending_soon', label: 'ใกล้หมดอายุ', icon: 'clock' },
  { key: 'new_today', label: 'คูปองใหม่วันนี้', icon: 'grid' },
] as const;

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]['key']>('latest');
  const [search, setSearch] = useState('');

  const { data: categories, isLoading: catLoading } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: stores } = useQuery({ queryKey: ['stores'], queryFn: fetchStores });
  const { data: coupons, isLoading: cLoading, error: cError, refetch } = useQuery({
    queryKey: ['coupons', activeTab],
    queryFn: () => fetchCoupons({ sortBy: activeTab === 'new_today' ? 'latest' : activeTab, limit: 12 }),
  });

  const featuredStores = stores?.filter((s) => s.is_featured).slice(0, 4) || [];
  const trendingCoupons = coupons?.slice(0, 5) || [];

  const filtered = useMemo(() => {
    if (!coupons) return [];
    if (!search) return coupons;
    return coupons.filter((c: CouponWithRelations) => `${c.title} ${c.description} ${c.code} ${c.store?.name}`.toLowerCase().includes(search.toLowerCase()));
  }, [coupons, search]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#050712] text-white">
      <Navbar />
      {/* ปรับแก้: ใช้ px-3 สำหรับมือถือเพื่อเพิ่มพื้นที่ */}
      <main className="relative mx-auto w-full max-w-[1380px] px-3 py-4 lg:px-7">
        
        {/* Hero Section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="relative overflow-hidden rounded-xl border border-[#582873] bg-gradient-to-r from-[#140d39] via-[#170c3e] to-[#22052f] p-6 sm:p-9">
            <div className="relative z-10 w-full max-w-[500px]">
              <p className="mb-2 text-[10px] font-bold tracking-widest text-[#f759b1] uppercase">Coupon Hub • The Best Deals</p>
              <h1 className="text-3xl font-extrabold leading-tight sm:text-[42px]">รวมทุกคูปอง<br /><span className="text-gradient">ไว้ที่นี่ที่เดียว!</span></h1>
              
              {/* ปรับ Search Bar ให้กว้างเต็มหน้าจอในมือถือ */}
              <div className="mt-6 flex h-11 w-full max-w-full items-center gap-2 rounded-lg border border-[#6c3f99] bg-[#0c0a25bb] px-3 shadow-inner sm:max-w-[335px]">
                <Search size={18} className="text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาคูปอง ร้านค้า..." className="w-full bg-transparent text-xs outline-none" />
              </div>
            </div>
          </section>

          {/* Trending Sidebar */}
          <aside className="rounded-xl border border-[#242940] bg-[#0e1121] p-4 shadow-lg">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold"><Flame size={16} className="text-orange-500" /> คูปองยอดนิยม</h2>
            <div className="grid grid-cols-1 gap-2">
              {trendingCoupons.map((c, i) => (
                <Link to={`/store/${c.store?.slug}`} key={c.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2 hover:border-[#ef3b93]">
                  <span className="text-[10px] font-bold text-slate-500">0{i+1}</span>
                  <div className="h-8 w-8 shrink-0 rounded bg-slate-800 flex items-center justify-center font-bold" style={{backgroundColor: c.store?.logo_color}}>{c.store?.logo}</div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11px] font-bold">{c.store?.name}</p>
                    <p className="truncate text-[9px] text-slate-400">{c.code}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>

        {/* หมวดหมู่: ปรับ Grid ให้รองรับหน้าจอเล็ก */}
        <section className="mt-6">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {categories?.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
          </div>
        </section>

        {/* รายการคูปองหลัก: ปรับเป็น 1 คอลัมน์ในมือถือ */}
        <section className="mt-6 rounded-xl border border-[#242940] bg-[#0e1121] p-2 sm:p-4">
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar border-b border-white/5">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`whitespace-nowrap pb-2 text-xs transition ${activeTab === tab.key ? 'border-b-2 border-[#ff2d8c] text-[#ff54a7] font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cLoading ? <LoadingState /> : filtered.map((c) => <CouponCard key={c.id} coupon={c} />)}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

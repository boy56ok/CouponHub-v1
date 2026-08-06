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

  const { data: categories, isLoading: catLoading, error: catError } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
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
    <div className="min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 38% 12%, rgba(143, 28, 196, .17), transparent 30%), radial-gradient(circle at 85% 35%, rgba(0, 102, 255, .1), transparent 28%)' }} />
      <Navbar />
      <main className="relative mx-auto max-w-[1380px] px-5 py-4 lg:px-7">
        {/* Hero + Trending */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="relative min-h-[214px] overflow-hidden rounded-xl border border-[#582873] bg-gradient-to-r from-[#140d39] via-[#170c3e] to-[#22052f] p-7 sm:p-9">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 78% 40%, #f4248b66 0, transparent 20%), radial-gradient(ellipse at 65% 80%, #5b24ff44 0, transparent 35%)' }} />
            <div className="relative z-10 max-w-[430px]">
              <p className="mb-2 text-sm font-semibold text-[#f759b1]">COUPON HUB • THE BEST DEALS</p>
              <h1 className="text-4xl font-extrabold leading-tight sm:text-[42px]">รวมทุกคูปอง<br /><span className="bg-gradient-to-r from-[#ff78cd] via-[#bb75ff] to-[#7e8bff] bg-clip-text text-transparent">ไว้ที่นี่ที่เดียว!</span></h1>
              <p className="mt-2 text-sm text-slate-300">อัปเดตทุกวัน คูปองใหม่เพียบ ห้ามพลาด!</p>
              <div id="search" className="mt-6 flex h-[37px] max-w-[335px] items-center gap-2.5 rounded-lg border border-[#6c3f99] bg-[#0c0a25bb] px-3 shadow-[inset_0_0_25px_#6c1d9955]">
                <Search size={18} className="text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาคูปอง ร้านค้า หรือเกม..." className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-white outline-none placeholder:text-[#858299]" />
                <kbd className="rounded border border-[#49405e] px-1.5 py-0.5 text-[9px] text-[#77728d]">⌘ K</kbd>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                <span className="text-slate-400">ยอดนิยม:</span>
                {['Shopee', 'Lazada', 'Free Fire', 'เติมเกม', 'ส่วนลด 50%'].map((tag) => (
                  <button key={tag} onClick={() => setSearch(tag)} className="rounded bg-[#35144d] px-2 py-0.5 text-[#ff94c6] transition hover:bg-[#ff2585] hover:text-white">{tag}</button>
                ))}
              </div>
            </div>
            <div className="absolute right-4 top-3 hidden lg:block">
              <div className="relative">
                <div className="grid h-[108px] w-[180px] rotate-12 place-items-center rounded-2xl bg-gradient-to-br from-[#ff5f62] to-[#f21a7d] text-6xl font-bold text-white shadow-[0_10px_30px_#f3227788]">%</div>
                <div className="absolute -bottom-2 right-0 grid h-[70px] w-[90px] -rotate-6 place-items-center rounded-lg bg-gradient-to-br from-[#b03bea] to-[#45108e] text-3xl text-[#ff77dd] shadow-[0_8px_25px_#8f27ca99]">◆</div>
              </div>
            </div>
          </section>
          <aside className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-4 shadow-[0_8px_30px_#0004]">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-[15px] font-bold"><Flame size={17} className="text-[#ff783d]" />คูปองยอดนิยม</h2>
              <Link to="/stores" className="text-[11px] text-[#f34496]">ดูทั้งหมด <ChevronRight size={13} className="inline" /></Link>
            </div>
            <div className="space-y-2">
              {trendingCoupons.map((c: CouponWithRelations, i: number) => (
                <Link to={`/store/${c.store?.slug}`} key={c.id} className="flex items-center gap-2 rounded-lg border border-[#22273b] bg-[#11152699] p-2 transition hover:border-[#ef3b93]">
                  <span className={`grid h-[18px] w-[18px] place-items-center rounded-full text-[10px] font-bold ${i === 0 ? 'bg-[#ffce38] text-[#271c00]' : i === 1 ? 'bg-[#bcc5d1] text-[#222]' : i === 2 ? 'bg-[#d67e44] text-[#271100]' : 'bg-[#242b3d] text-[#d8deeb]'}`}>{i + 1}</span>
                  <div className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-md text-lg font-extrabold text-white" style={{ background: c.store?.logo_color || '#f45126' }}>{c.store?.logo || 'S'}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold">{c.store?.name}</p>
                    <p className="truncate text-[10px] text-slate-300">{c.description}</p>
                    <p className="text-[9px] text-slate-500">🔥 ใช้แล้ว {formatNumber(c.usage_count)} ครั้ง</p>
                  </div>
                  <span className="rounded border border-dashed border-[#a92c72] px-1.5 py-0.5 text-[8px] font-semibold text-[#ff6bb1]">{c.code}</span>
                </Link>
              ))}
              {cLoading && <p className="py-4 text-center text-xs text-slate-500">กำลังโหลด...</p>}
            </div>
          </aside>
        </div>

        {/* Categories */}
        <section id="categories" className="mt-4">
          {catError ? <ErrorState message="ไม่สามารถโหลดหมวดหมู่ได้" onRetry={refetch} /> : catLoading ? <LoadingState /> : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-8">
              {categories?.map((cat) => <CategoryCard key={cat.id} category={cat} />)}
            </div>
          )}
        </section>

        {/* Featured stores */}
        {featuredStores.length > 0 && (
          <section className="mt-4">
            <h2 className="mb-3 text-sm font-bold">ร้านค้าแนะนำ</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {featuredStores.map((s) => (
                <Link to={`/store/${s.slug}`} key={s.id} className="flex items-center gap-3 rounded-xl border border-[#242a40] bg-[#101322] p-3 transition hover:border-[#ef3b93]">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-xl font-extrabold text-white" style={{ background: s.logo_color }}>{s.logo}</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{s.name}</p>
                    <p className="flex items-center gap-1 text-[10px] text-slate-400"><Star size={11} className="text-[#ffce38]" fill="currentColor" /> {s.rating}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Coupons + Sidebar */}
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-3 shadow-[0_8px_30px_#0004] sm:p-4">
            <div className="flex items-center gap-5 overflow-auto border-b border-[#24283a]">
              {tabs.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`relative flex items-center gap-1.5 whitespace-nowrap py-2.5 text-[11px] transition ${activeTab === tab.key ? 'font-semibold text-[#ff54a7]' : 'text-[#858b9e] hover:text-white'}`}>
                  {tab.icon === 'zap' && <Zap size={13} className="text-[#ffcf32]" />}
                  {tab.icon === 'star' && <Star size={13} />}
                  {tab.icon === 'clock' && <Clock3 size={13} />}
                  {tab.icon === 'grid' && <Grid2X2 size={13} />}
                  {tab.label}
                  {activeTab === tab.key && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#ff2d8c] shadow-[0_0_10px_#ff2d8c]" />}
                </button>
              ))}
            </div>
            {cError ? <ErrorState message="ไม่สามารถโหลดคูปองได้" onRetry={refetch} /> : cLoading ? <LoadingState /> : (
              <>
                <div className="grid gap-3 pt-3 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((c: CouponWithRelations) => <CouponCard key={c.id} coupon={c} />)}
                </div>
                {filtered.length === 0 && <p className="py-16 text-center text-sm text-slate-400">ไม่พบคูปองที่ค้นหา ลองใช้คำอื่นดูนะ</p>}
              </>
            )}
          </section>
          <aside className="space-y-4">
            <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-bold">หมวดหมู่</h2>
                <Link to="/stores" className="text-[11px] text-[#f34496]">ดูทั้งหมด <ChevronRight size={13} className="inline" /></Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {categories?.slice(0, 6).map((cat) => <CategoryCard key={cat.id} category={cat} />)}
              </div>
            </div>
            <Newsletter />
          </aside>
        </div>

        {/* Benefits */}
        <section className="mt-4 grid gap-4 rounded-xl border border-[#252a40] bg-[#0d1020] px-5 py-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1"><h2 className="text-lg font-bold">ทำไมต้องใช้ Coupon Hub?</h2><p className="mt-1 text-[11px] text-slate-400">ช้อปคุ้มกว่าในทุกวัน</p></div>
          {[['▣', 'อัปเดตทุกวัน', 'คูปองใหม่ทุกวัน ไม่พลาดทุกโปร'], ['ϟ', 'ใช้งานง่าย', 'กดคัดลอกโค้ดได้ทันที'], ['▦', 'ครบทุกหมวด', 'รวมทุกคูปองไว้ที่นี่ที่เดียว'], ['✓', 'ใช้งานได้จริง', 'ตรวจสอบแล้ว ใช้ได้แน่นอน']].map(([icon, title, text]) => (
            <div className="flex items-center gap-3" key={title}>
              <span className="grid h-[34px] w-[34px] place-items-center rounded-full border border-[#693164] bg-[#24132c] text-lg text-[#ff65b0]">{icon}</span>
              <div><p className="text-xs font-semibold">{title}</p><p className="text-[10px] text-slate-400">{text}</p></div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}

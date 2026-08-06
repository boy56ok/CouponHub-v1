import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Search, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LoadingState, EmptyState, ErrorState } from '@/components/States';
import { fetchStores } from '@/services/couponService';

export default function StoresPage() {
  const [search, setSearch] = useState('');
  const { data: stores, isLoading, error } = useQuery({ queryKey: ['stores'], queryFn: fetchStores });
  const filtered = stores?.filter((s) => s.name.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <Navbar />
      <main className="relative mx-auto max-w-[1380px] px-5 py-4 lg:px-7">
        <nav className="mb-4 flex items-center gap-1 text-xs text-slate-400">
          <Link to="/" className="hover:text-[#ff55a5]">หน้าแรก</Link><ChevronRight size={12} /><span className="text-slate-300">ร้านค้า</span>
        </nav>
        <h1 className="text-2xl font-extrabold">ร้านค้าทั้งหมด</h1>
        <p className="mt-1 text-sm text-slate-400">ค้นหาร้านค้าที่มีคูปองและส่วนลด</p>
        <div className="mt-4 flex h-10 max-w-md items-center gap-2 rounded-lg border border-white/10 bg-[#0a0c18] px-3">
          <Search size={18} className="text-slate-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาร้านค้า..." className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none placeholder:text-slate-500" />
        </div>
        {error ? <ErrorState message="ไม่สามารถโหลดร้านค้าได้" /> : isLoading ? <LoadingState /> : filtered.length === 0 ? <EmptyState title="ไม่พบร้านค้า" message="ลองค้นหาด้วยคำอื่น" /> : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((s) => (
              <Link to={`/store/${s.slug}`} key={s.id} className="rounded-xl border border-[#242a40] bg-[#101322] p-4 transition hover:border-[#ef3b93] hover:shadow-[0_8px_24px_#ea2a7c18]">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg text-xl font-extrabold text-white" style={{ background: s.logo_color }}>{s.logo}</div>
                  <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{s.name}</p><p className="flex items-center gap-1 text-[10px] text-slate-400"><Star size={11} className="text-[#ffce38]" fill="currentColor" /> {s.rating}</p></div>
                  {s.is_featured && <span className="rounded bg-[#7527bc] px-1.5 py-0.5 text-[8px]">แนะนำ</span>}
                </div>
                <p className="mt-2 line-clamp-2 text-[11px] text-slate-400">{s.description}</p>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

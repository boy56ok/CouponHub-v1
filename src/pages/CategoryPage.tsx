import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CouponCard from '@/components/CouponCard';
import { LoadingState, EmptyState, ErrorState } from '@/components/States';
import { fetchCategories, fetchCoupons } from '@/services/couponService';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const category = categories?.find((c) => c.slug === slug);

  const { data: coupons, isLoading, error, refetch } = useQuery({
    queryKey: ['categoryCoupons', slug],
    queryFn: () => fetchCoupons({ categoryId: category?.id, sortBy: 'latest' }),
    enabled: !!category?.id,
  });

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <Navbar />
      <main className="relative mx-auto max-w-[1380px] px-5 py-4 lg:px-7">
        <nav className="mb-4 flex items-center gap-1 text-xs text-slate-400">
          <Link to="/" className="hover:text-[#ff55a5]">หน้าแรก</Link><ChevronRight size={12} /><span className="text-slate-300">{category?.name || slug}</span>
        </nav>
        <h1 className="text-2xl font-extrabold">{category?.name || 'หมวดหมู่'}</h1>
        <p className="mt-1 text-sm text-slate-400">คูปองทั้งหมดในหมวดหมู่นี้</p>
        {error ? <ErrorState message="ไม่สามารถโหลดคูปองได้" onRetry={refetch} /> : isLoading ? <LoadingState /> : (
          coupons && coupons.length === 0 ? <EmptyState title="ยังไม่มีคูปองในหมวดหมู่นี้" message="กลับมาตรวจสอบใหม่ภายหลัง" /> : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {coupons?.map((c) => <CouponCard key={c.id} coupon={c} />)}
            </div>
          )
        )}
      </main>
      <Footer />
    </div>
  );
}

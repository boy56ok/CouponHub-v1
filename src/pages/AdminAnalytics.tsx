import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { AdminCard } from '@/pages/AdminLayout';
import { LoadingState, ErrorState } from '@/components/States';
import { fetchAnalytics } from '@/services/userService';
import { fetchCoupons, fetchStores, fetchCategories } from '@/services/couponService';

export default function AdminAnalytics() {
  const { data: analytics, isLoading: analyticsLoading } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
  const { data: coupons, isLoading: couponsLoading } = useQuery({ queryKey: ['coupons', 'all'], queryFn: () => fetchCoupons({ limit: 1000 }) });
  const { data: stores } = useQuery({ queryKey: ['stores'], queryFn: fetchStores });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });

  if (analyticsLoading || couponsLoading) return <LoadingState />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">รายงานและสถิติ (Analytics)</h1>
        <p className="text-xs text-slate-400">สถิติการใช้งานเว็บไซต์ การเข้าชม และการใช้คูปองย้อนหลัง</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title="สถิติผู้เข้าชมและหน้าเพจ (7 วันล่าสุด)">
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242940" />
                <XAxis dataKey="date" stroke="#858b9e" fontSize={11} />
                <YAxis stroke="#858b9e" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0e1121', border: '1px solid #242940', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="visitors" name="ผู้เข้าชม" stroke="#ff2d8c" strokeWidth={2} />
                <Line type="monotone" dataKey="page_views" name="ยอดเปิดหน้า" stroke="#63b1ff" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>

        <AdminCard title="สถิติการใช้คูปอง (7 วันล่าสุด)">
          <div className="h-[280px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#242940" />
                <XAxis dataKey="date" stroke="#858b9e" fontSize={11} />
                <YAxis stroke="#858b9e" fontSize={11} />
                <Tooltip contentStyle={{ background: '#0e1121', border: '1px solid #242940', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="coupons_used" name="คูปองที่ถูกใช้" fill="#a42af7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-5">
          <h3 className="text-xs font-semibold text-slate-400">คูปองทั้งหมดในระบบ</h3>
          <p className="mt-2 text-2xl font-extrabold text-white">{coupons?.length || 0} <span className="text-xs font-normal text-slate-400">รายการ</span></p>
        </div>
        <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-5">
          <h3 className="text-xs font-semibold text-slate-400">ร้านค้าพาร์ทเนอร์</h3>
          <p className="mt-2 text-2xl font-extrabold text-white">{stores?.length || 0} <span className="text-xs font-normal text-slate-400">ร้าน</span></p>
        </div>
        <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-5">
          <h3 className="text-xs font-semibold text-slate-400">หมวดหมู่ทั้งหมด</h3>
          <p className="mt-2 text-2xl font-extrabold text-white">{categories?.length || 0} <span className="text-xs font-normal text-slate-400">หมวด</span></p>
        </div>
      </div>
    </div>
  );
}

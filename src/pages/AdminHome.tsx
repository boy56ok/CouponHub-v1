import { useQuery } from '@tanstack/react-query';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Activity, Eye, Tag, Users } from 'lucide-react';
import { AdminCard } from '@/pages/AdminLayout';
import { fetchAnalytics, fetchAllProfiles } from '@/services/userService';
import { fetchCoupons, fetchStores, fetchCategories } from '@/services/couponService';
import { formatNumber } from '@/lib/utils';

export default function AdminHome() {
  const { data: analytics } = useQuery({ queryKey: ['analytics'], queryFn: fetchAnalytics });
  const { data: coupons } = useQuery({ queryKey: ['coupons', 'all'], queryFn: () => fetchCoupons({ limit: 1000 }) });
  const { data: stores } = useQuery({ queryKey: ['stores'], queryFn: fetchStores });
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: profiles } = useQuery({ queryKey: ['allProfiles'], queryFn: fetchAllProfiles });

  const totalVisitors = analytics?.reduce((s, a) => s + a.visitors, 0) || 0;
  const totalCouponsUsed = analytics?.reduce((s, a) => s + a.coupons_used, 0) || 0;
  const totalPageViews = analytics?.reduce((s, a) => s + a.page_views, 0) || 0;
  const totalNewUsers = analytics?.reduce((s, a) => s + a.new_users, 0) || 0;

  const stats = [
    { label: 'ผู้ใช้ทั้งหมด', value: formatNumber(profiles?.length || 0), icon: Users, color: 'text-[#7da0ff]' },
    { label: 'คูปองใช้งาน', value: formatNumber(coupons?.length || 0), icon: Tag, color: 'text-[#ff55a5]' },
    { label: 'ร้านค้า', value: formatNumber(stores?.length || 0), icon: Activity, color: 'text-[#55d7bb]' },
    { label: 'หมวดหมู่', value: formatNumber(categories?.length || 0), icon: Eye, color: 'text-[#ffce38]' },
  ];

  const chartData = analytics?.map((a) => ({
    date: new Date(a.date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
    visitors: a.visitors, coupons: a.coupons_used, views: a.page_views,
  })) || [];

  return (
    <div className="space-y-5">
      <h1 className="text-xl font-extrabold">ภาพรวมระบบ</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-4">
              <Icon size={20} className={s.color} />
              <p className="mt-2 text-2xl font-extrabold">{s.value}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </div>
          );
        })}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard title="ผู้เข้าชมรายวัน (7 วันล่าสุด)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242940" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0e1121', border: '1px solid #242940', borderRadius: 8, fontSize: 12 }} />
              <Line type="monotone" dataKey="visitors" stroke="#f72585" strokeWidth={2} dot={{ fill: '#f72585', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-xs text-slate-400">รวม {formatNumber(totalVisitors)} ครั้งเข้าชม</p>
        </AdminCard>
        <AdminCard title="การใช้งานคูปองรายวัน">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242940" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} />
              <Tooltip contentStyle={{ background: '#0e1121', border: '1px solid #242940', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="coupons" fill="#a42af7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-xs text-slate-400">รวม {formatNumber(totalCouponsUsed)} ครั้งใช้งาน</p>
        </AdminCard>
      </div>
      <AdminCard title="สถิติรวม">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center"><p className="text-3xl font-extrabold text-[#7da0ff]">{formatNumber(totalPageViews)}</p><p className="text-xs text-slate-400">ยอดเข้าชมหน้าเว็บ</p></div>
          <div className="text-center"><p className="text-3xl font-extrabold text-[#55d7bb]">{formatNumber(totalNewUsers)}</p><p className="text-xs text-slate-400">ผู้ใช้ใหม่</p></div>
          <div className="text-center"><p className="text-3xl font-extrabold text-[#ffce38]">{formatNumber(totalCouponsUsed)}</p><p className="text-xs text-slate-400">คูปองที่ใช้</p></div>
        </div>
      </AdminCard>
    </div>
  );
}

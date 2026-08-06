import { useQuery } from '@tanstack/react-query';
import { Bookmark, Clock3, Heart, TicketPercent } from 'lucide-react';
import { DashboardCard } from '@/pages/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { fetchFavorites, fetchStoreFavorites, fetchNotifications } from '@/services/userService';
import { formatNumber, timeAgo } from '@/lib/utils';

export default function DashboardHome() {
  const { user, profile } = useAuth();
  const { data: favorites } = useQuery({ queryKey: ['favorites', user?.id], queryFn: () => fetchFavorites(user!.id), enabled: !!user });
  const { data: storeFavs } = useQuery({ queryKey: ['storeFavorites', user?.id], queryFn: () => fetchStoreFavorites(user!.id), enabled: !!user });
  const { data: notifications } = useQuery({ queryKey: ['notifications', user?.id], queryFn: () => fetchNotifications(user!.id), enabled: !!user });

  const stats = [
    { label: 'คูปองที่บันทึก', value: favorites?.length || 0, icon: Bookmark, color: 'text-[#ff55a5]' },
    { label: 'ร้านค้าที่ชื่นชอบ', value: storeFavs?.length || 0, icon: Heart, color: 'text-[#f72585]' },
    { label: 'การแจ้งเตือนใหม่', value: notifications?.filter((n) => !n.is_read).length || 0, icon: Clock3, color: 'text-[#ffce38]' },
    { label: 'คูปองที่ใช้', value: formatNumber(favorites?.length || 0), icon: TicketPercent, color: 'text-[#7da0ff]' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-extrabold">สวัสดี, {profile?.display_name || 'User'}!</h1>
        <p className="text-sm text-slate-400">ภาพรวมบัญชีของคุณ</p>
      </div>
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
      <DashboardCard title="กิจกรรมล่าสุด">
        <div className="space-y-2">
          {notifications?.slice(0, 5).map((n) => (
            <div key={n.id} className="flex items-center gap-3 rounded-lg border border-white/5 bg-[#0a0c18] p-3">
              <div className={`grid h-8 w-8 place-items-center rounded-full ${n.type === 'coupon' ? 'bg-[#fa247b]/20 text-[#ff55a5]' : 'bg-blue-500/20 text-blue-400'}`}>
                {n.type === 'coupon' ? <TicketPercent size={16} /> : <Clock3 size={16} />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{n.title}</p>
                <p className="truncate text-[11px] text-slate-400">{n.message}</p>
              </div>
              <span className="text-[10px] text-slate-500">{timeAgo(n.created_at)}</span>
            </div>
          )) || <p className="py-4 text-center text-xs text-slate-500">ยังไม่มีกิจกรรม</p>}
        </div>
      </DashboardCard>
    </div>
  );
}

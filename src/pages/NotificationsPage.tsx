import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bell, Check } from 'lucide-react';
import { EmptyState, LoadingState } from '@/components/States';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { fetchNotifications, markNotificationRead, markAllNotificationsRead } from '@/services/userService';
import { timeAgo } from '@/lib/utils';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: notifications, isLoading } = useQuery({ queryKey: ['notifications', user?.id], queryFn: () => fetchNotifications(user!.id), enabled: !!user });

  const handleMarkRead = async (id: string) => { await markNotificationRead(id); qc.invalidateQueries({ queryKey: ['notifications', user?.id] }); };
  const handleMarkAll = async () => { await markAllNotificationsRead(user!.id); qc.invalidateQueries({ queryKey: ['notifications', user?.id] }); showToast('อ่านการแจ้งเตือนทั้งหมดแล้ว', 'success'); };
  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-extrabold">การแจ้งเตือน</h1>
        {unreadCount > 0 && <button onClick={handleMarkAll} className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"><Check size={14} /> อ่านทั้งหมด</button>}
      </div>
      {isLoading ? <LoadingState /> : !notifications || notifications.length === 0 ? (
        <EmptyState icon={<Bell size={32} />} title="ยังไม่มีการแจ้งเตือน" message="การแจ้งเตือนคูปองใหม่จะปรากฏที่นี่" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-3 rounded-lg border p-3 transition ${n.is_read ? 'border-white/5 bg-[#0a0c18]' : 'border-[#f72585]/30 bg-[#1c1026]'}`}>
              <div className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${n.type === 'coupon' ? 'bg-[#fa247b]/20 text-[#ff55a5]' : 'bg-blue-500/20 text-blue-400'}`}><Bell size={16} /></div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{n.title}</p>
                <p className="text-[11px] text-slate-400">{n.message}</p>
                <span className="text-[10px] text-slate-500">{timeAgo(n.created_at)}</span>
              </div>
              {!n.is_read && <button onClick={() => handleMarkRead(n.id)} className="text-[10px] text-[#f34496] hover:underline">อ่าน</button>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

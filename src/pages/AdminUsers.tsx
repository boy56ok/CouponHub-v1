import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Shield, User as UserIcon } from 'lucide-react';
import { AdminCard } from '@/pages/AdminLayout';
import { LoadingState, ErrorState, EmptyState } from '@/components/States';
import { fetchAllProfiles, updateUserRole } from '@/services/userService';
import { useToast } from '@/contexts/ToastContext';
import { formatDate } from '@/lib/utils';
import type { Profile, UserRole } from '@/types';

export default function AdminUsers() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: users, isLoading, error } = useQuery({ queryKey: ['admin-users'], queryFn: fetchAllProfiles });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setUpdatingId(userId);
    try {
      await updateUserRole(userId, newRole);
      qc.invalidateQueries({ queryKey: ['admin-users'] });
      showToast('เปลี่ยนสิทธิ์ผู้ใช้เรียบร้อย', 'success');
    } catch (err: any) {
      showToast(err.message || 'ไม่สามารถเปลี่ยนสิทธิ์ได้', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="ไม่สามารถโหลดข้อมูลผู้ใช้ได้" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">จัดการผู้ใช้งาน</h1>
        <p className="text-xs text-slate-400">ดูรายชื่อผู้ใช้และกำหนดสิทธิ์ผู้ดูแลระบบ (Admin)</p>
      </div>

      <AdminCard title="รายชื่อสมาชิกทั้งหมด">
        {users?.length === 0 ? (
          <EmptyState title="ไม่พบสมาชิก" message="ยังไม่มีสมาชิกในระบบ" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400">
                <tr>
                  <th className="pb-3 font-semibold">ผู้ใช้งาน</th>
                  <th className="pb-3 font-semibold">อีเมล</th>
                  <th className="pb-3 font-semibold">วันที่สมัคร</th>
                  <th className="pb-3 font-semibold">สิทธิ์ (Role)</th>
                  <th className="pb-3 text-right font-semibold">เปลี่ยนสิทธิ์</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="grid h-7 w-7 place-items-center rounded-full border border-[#e9549c] bg-gradient-to-br from-[#55453e] to-[#14182d] text-xs font-bold text-white">
                          {user.display_name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="font-medium text-white">{user.display_name || 'ไม่ระบุชื่อ'}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-400">{user.email}</td>
                    <td className="py-3 text-slate-400">{formatDate(user.created_at)}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold ${user.role === 'admin' ? 'bg-[#fa247b]/20 text-[#ff55a5]' : 'bg-blue-500/10 text-blue-400'}`}>
                        {user.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <select
                        value={user.role}
                        disabled={updatingId === user.id}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        className="rounded-lg border border-white/10 bg-[#0a0c18] px-2.5 py-1 text-xs text-white outline-none focus:border-[#f72585]"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}

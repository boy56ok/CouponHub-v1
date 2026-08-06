import { type ReactNode } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { BarChart3, LayoutDashboard, LogOut, Settings, ShoppingCart, Store, Tag, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const adminLinks = [
  { label: 'ภาพรวม', path: '/admin', icon: LayoutDashboard },
  { label: 'คูปอง', path: '/admin/coupons', icon: Tag },
  { label: 'หมวดหมู่', path: '/admin/categories', icon: ShoppingCart },
  { label: 'ร้านค้า', path: '/admin/stores', icon: Store },
  { label: 'ผู้ใช้', path: '/admin/users', icon: Users },
  { label: 'รายงาน', path: '/admin/reports', icon: BarChart3 },
  { label: 'ตั้งค่า', path: '/admin/settings', icon: Settings },
];

export default function AdminLayout() {
  const { user, profile, loading, signOut } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-[#050712]" />;
  if (!user) return <Navigate to="/login" replace />;
  if (profile && profile.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-white/[.08] bg-[#080a18] p-4 lg:block">
        <Link to="/" className="mb-6 flex items-center gap-2 px-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#fa398a] to-[#a42af7] text-sm font-bold text-white">CH</div>
          <span className="text-sm font-bold">Admin Panel</span>
        </Link>
        <nav className="space-y-1">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link key={link.path} to={link.path} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${active ? 'bg-gradient-to-r from-[#fa247b]/20 to-transparent text-[#ff55a5]' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <Icon size={16} /> {link.label}
              </Link>
            );
          })}
          <hr className="my-2 border-white/10" />
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"><LogOut size={16} /> ออกจากระบบ</button>
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <div className="border-b border-white/[.08] bg-[#080a18]/80 px-5 py-3 backdrop-blur-xl lg:px-7">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 overflow-auto lg:hidden">
              {adminLinks.map((link) => (
                <Link key={link.path} to={link.path} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${location.pathname === link.path ? 'bg-[#fa247b]/20 text-[#ff55a5]' : 'text-slate-400'}`}>{link.label}</Link>
              ))}
            </div>
            <p className="hidden text-sm text-slate-400 lg:block">แผงควบคุมผู้ดูแลระบบ</p>
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-full border border-[#e9549c] bg-gradient-to-br from-[#55453e] to-[#14182d] text-xs font-bold">{profile?.display_name?.charAt(0).toUpperCase() || 'A'}</div>
              <span className="text-xs">{profile?.display_name || 'Admin'}</span>
            </div>
          </div>
        </div>
        <div className="p-5 lg:px-7"><Outlet /></div>
      </main>
    </div>
  );
}

export function AdminCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-5">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">{title}</h2>{action}</div>
      {children}
    </div>
  );
}

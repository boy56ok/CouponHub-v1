import { type ReactNode } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Bell, Bookmark, Heart, Home, LogOut, Settings, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const sidebarLinks = [
  { label: 'ภาพรวม', path: '/dashboard', icon: Home },
  { label: 'โปรไฟล์', path: '/dashboard/profile', icon: User },
  { label: 'คูปองที่บันทึก', path: '/dashboard/saved', icon: Bookmark },
  { label: 'ร้านค้าที่ชื่นชอบ', path: '/dashboard/favorites', icon: Heart },
  { label: 'การแจ้งเตือน', path: '/dashboard/notifications', icon: Bell },
  { label: 'ตั้งค่า', path: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  if (loading) return <div className="min-h-screen bg-[#050712]" />;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <Navbar />
      <div className="mx-auto flex max-w-[1380px] gap-6 px-5 py-6 lg:px-7">
        <aside className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20 space-y-1">
            {sidebarLinks.map((link) => {
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
          </div>
        </aside>
        <main className="min-w-0 flex-1">
          <div className="mb-4 flex gap-2 overflow-auto lg:hidden">
            {sidebarLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs ${location.pathname === link.path ? 'bg-[#fa247b]/20 text-[#ff55a5]' : 'text-slate-400'}`}>{link.label}</Link>
            ))}
          </div>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export function DashboardCard({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-[#242940] bg-gradient-to-br from-[#0e1121] to-[#0a0c18] p-5">
      <div className="mb-4 flex items-center justify-between"><h2 className="text-sm font-bold">{title}</h2>{action}</div>
      {children}
    </div>
  );
}

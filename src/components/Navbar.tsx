import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Bell, ChevronDown, Menu, Moon, Search, Sun, TicketPercent, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const navLinks = [
  { label: 'หน้าแรก', path: '/' },
  { label: 'หมวดหมู่', path: '/#categories' },
  { label: 'ร้านค้า', path: '/stores' },
  { label: 'เกม', path: '/category/games' },
  { label: 'เติมเงิน', path: '/category/topup' },
  { label: 'ท่องเที่ยว', path: '/category/travel' },
  { label: 'บล็อก', path: '/blog' },
];

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[.08] bg-[#070916]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-[1380px] items-center gap-7 px-5 lg:px-7">
        <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="เปิดเมนู">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <div className="grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-gradient-to-br from-[#fa398a] to-[#a42af7] text-white shadow-[0_0_24px_#ef238a66]">
            <TicketPercent size={22} />
          </div>
          <div>
            <div className="text-[15px] font-extrabold tracking-wide">COUPON HUB</div>
            <div className="text-[10px] text-slate-400">รวมทุกคูปอง ที่นี่ที่เดียว</div>
          </div>
        </Link>
        <nav className={`absolute left-0 top-[68px] w-full flex-col border-b border-white/10 bg-[#080a18] p-4 lg:static lg:flex lg:w-auto lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 ${mobileOpen ? 'flex' : 'hidden'}`}>
          {navLinks.map((link, i) => (
            <Link key={link.label} to={link.path} className={`py-2.5 text-[11px] whitespace-nowrap transition-colors lg:px-2 lg:py-[22px] ${i === 0 ? 'text-[#ff55a5]' : 'text-[#a8adbf] hover:text-[#ff55a5]'}`}>{link.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-4 text-slate-300">
          <Link to="/stores" aria-label="ค้นหา" className="hidden sm:block"><Search size={18} /></Link>
          <button onClick={toggleTheme} aria-label="สลับธีม">{theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}</button>
          {user && (
            <Link to="/dashboard/notifications" className="relative" aria-label="การแจ้งเตือน">
              <Bell size={18} /><span className="absolute -right-2 -top-2 rounded-full bg-[#f72585] px-1 text-[8px]">3</span>
            </Link>
          )}
          <div className="hidden h-7 w-px bg-white/15 md:block" />
          {user ? (
            <div className="relative hidden md:block">
              <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2">
                <div className="grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-[#e9549c] bg-gradient-to-br from-[#55453e] to-[#14182d] text-xs font-bold text-[#ffd9ee]">
                  {profile?.display_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="text-left">
                  <p className="text-[11px] font-semibold">{profile?.display_name || 'User'}</p>
                  {profile?.role === 'admin' && <span className="inline-block rounded bg-[#7527bc] px-1 py-0.5 text-[8px]">Admin</span>}
                </div>
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-white/10 bg-[#0e1121] py-2 shadow-xl">
                  <Link to="/dashboard" className="block px-4 py-2 text-xs hover:bg-white/5" onClick={() => setMenuOpen(false)}>แดชบอร์ดของฉัน</Link>
                  <Link to="/dashboard/saved" className="block px-4 py-2 text-xs hover:bg-white/5" onClick={() => setMenuOpen(false)}>คูปองที่บันทึก</Link>
                  <Link to="/dashboard/profile" className="block px-4 py-2 text-xs hover:bg-white/5" onClick={() => setMenuOpen(false)}>โปรไฟล์</Link>
                  {profile?.role === 'admin' && <Link to="/admin" className="block px-4 py-2 text-xs text-[#ff55a5] hover:bg-white/5" onClick={() => setMenuOpen(false)}>แอดมิน</Link>}
                  <hr className="my-1 border-white/10" />
                  <button onClick={() => { signOut(); setMenuOpen(false); navigate('/'); }} className="block w-full px-4 py-2 text-left text-xs text-red-400 hover:bg-white/5">ออกจากระบบ</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link to="/login" className="rounded-lg border border-white/10 px-4 py-1.5 text-xs hover:border-[#f72585]">เข้าสู่ระบบ</Link>
              <Link to="/register" className="rounded-lg bg-gradient-to-r from-[#fa247b] to-[#fa3caa] px-4 py-1.5 text-xs font-semibold">สมัครสมาชิก</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

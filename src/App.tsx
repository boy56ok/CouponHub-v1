import { useMemo, useState } from 'react';
import {
  Bell,
  Bookmark,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Copy,
  Flame,
  Gamepad2,
  Gift,
  Grid2X2,
  Heart,
  Camera,
  Menu,
  MoreHorizontal,
  Plane,
  PlayCircle,
  Search,
  Send,
  Share2,
  ShoppingBag,
  Sparkles,
  Star,
  TicketPercent,
  Utensils,
  WalletCards,
  X,
} from 'lucide-react';

type Coupon = {
  store: string;
  logo: string;
  logoClass: string;
  description: string;
  code: string;
  expiry: string;
  hot?: boolean;
};

const categories = [
  { label: 'ทั้งหมด', icon: Grid2X2, color: 'pink', count: '2,847' },
  { label: 'ช้อปปิ้ง', icon: ShoppingBag, color: 'rose', count: '1,234' },
  { label: 'อาหาร', icon: Utensils, color: 'amber', count: '856' },
  { label: 'เกม', icon: Gamepad2, color: 'blue', count: '2,156' },
  { label: 'เติมเงิน', icon: WalletCards, color: 'cyan', count: '623' },
  { label: 'ท่องเที่ยว', icon: Plane, color: 'sky', count: '312' },
  { label: 'บัตรกำนัล', icon: Gift, color: 'pink', count: '245' },
  { label: 'แอป & บริการ', icon: Grid2X2, color: 'teal', count: '480' },
  { label: 'อื่นๆ', icon: MoreHorizontal, color: 'slate', count: '623' },
];

const coupons: Coupon[] = [
  { store: 'Shopee', logo: 'S', logoClass: 'bg-[#f45126]', description: 'ลด 200 บาท ขั้นต่ำ 999 บาท', code: 'SHOPEE200', expiry: '31 พ.ค. 67', hot: true },
  { store: 'Lazada', logo: 'L', logoClass: 'bg-gradient-to-br from-[#2434e8] to-[#5665ff]', description: 'ลด 150 บาท ขั้นต่ำ 899 บาท', code: 'LAZADA150', expiry: '30 พ.ค. 67', hot: true },
  { store: 'Grab', logo: 'G', logoClass: 'bg-[#0ebc55]', description: 'ลด 50 บาท ทุกเมนู', code: 'GRAB50', expiry: '28 พ.ค. 67' },
  { store: 'Foodpanda', logo: '●', logoClass: 'bg-gradient-to-br from-[#f73e93] to-[#ef1371]', description: 'ลด 60 บาท ขั้นต่ำ 300 บาท', code: 'FP60', expiry: '29 พ.ค. 67' },
  { store: 'Free Fire', logo: '✦', logoClass: 'bg-gradient-to-br from-[#38246f] to-[#f05b55]', description: 'โค้ดรับเพชรฟรี 100 เพชร', code: 'FF100DIAMOND', expiry: '31 พ.ค. 67', hot: true },
  { store: 'ROV', logo: '◈', logoClass: 'bg-gradient-to-br from-[#172852] to-[#d56e4f]', description: 'สกินฟรี! ทุกตู้ไม่จำกัด', code: 'ROVFREECODE', expiry: '31 พ.ค. 67' },
  { store: 'PUBG Mobile', logo: '●', logoClass: 'bg-gradient-to-br from-[#1e3d64] to-[#b38350]', description: 'ลด UC สูงสุด 25%', code: 'PUBG25OFF', expiry: '31 พ.ค. 67' },
  { store: 'TRUE MONEY', logo: '✓', logoClass: 'bg-white text-[#f04d28]', description: 'รับเงินคืน 20 บาท', code: 'TRUE20', expiry: '27 พ.ค. 67' },
];

function App() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [activeTab, setActiveTab] = useState('คูปองล่าสุด');
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [saved, setSaved] = useState<string[]>([]);
  const [liked, setLiked] = useState<string[]>([]);
  const [newsletter, setNewsletter] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredCoupons = useMemo(() => coupons.filter((coupon) => `${coupon.store} ${coupon.description} ${coupon.code}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    window.setTimeout(() => setCopied(null), 1800);
  };

  const toggleItem = (items: string[], setItems: (next: string[]) => void, store: string) => setItems(items.includes(store) ? items.filter((item) => item !== store) : [...items, store]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050712] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 38% 12%, rgba(143, 28, 196, .17), transparent 30%), radial-gradient(circle at 85% 35%, rgba(0, 102, 255, .1), transparent 28%)' }} />
      <header className="sticky top-0 z-20 border-b border-white/[.08] bg-[#070916]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-[1380px] items-center gap-7 px-5 lg:px-7">
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="เปิดเมนู"><Menu size={22} /></button>
          <div className="flex shrink-0 items-center gap-3"><div className="logo-mark"><TicketPercent size={22} /></div><div><div className="text-[15px] font-extrabold tracking-wide">COUPON HUB</div><div className="text-[10px] text-slate-400">รวมทุกคูปอง ที่นี่ที่เดียว</div></div></div>
          <nav className={`${mobileOpen ? 'flex' : 'hidden'} absolute left-0 top-[68px] w-full flex-col border-b border-white/10 bg-[#080a18] p-4 lg:static lg:flex lg:w-auto lg:flex-row lg:border-0 lg:bg-transparent lg:p-0`}>
            {['หน้าแรก', 'หมวดหมู่', 'ร้านค้า', 'เกม', 'เติมเงิน', 'ท่องเที่ยว', 'บล็อก'].map((item, index) => <a key={item} className={`nav-link ${index === 0 ? 'active' : ''}`} href={`#${index === 0 ? 'home' : 'coupons'}`}>{item}</a>)}
          </nav>
          <div className="ml-auto flex items-center gap-4 text-slate-300"><Search size={18} className="hidden sm:block" /><span className="text-lg">☾</span><div className="relative"><Bell size={18} /><span className="absolute -right-2 -top-2 rounded-full bg-[#f72585] px-1 text-[8px]">3</span></div><div className="hidden h-7 w-px bg-white/15 md:block" /><div className="hidden items-center gap-2 md:flex"><div className="avatar">C</div><div><p className="text-[11px] font-semibold">สวัสดี, CouponHunter</p><span className="premium">Premium</span></div><ChevronDown size={14} /></div></div>
        </div>
      </header>

      <main id="home" className="relative mx-auto max-w-[1380px] px-5 py-4 lg:px-7">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="hero-panel relative overflow-hidden rounded-xl border border-[#582873] p-7 sm:p-9"><div className="hero-glow" /><div className="relative z-10 max-w-[430px]"><p className="mb-2 text-sm font-semibold text-[#f759b1]">COUPON HUB • THE BEST DEALS</p><h1 className="text-4xl font-extrabold leading-tight sm:text-[42px]">รวมทุกคูปอง<br /><span className="text-gradient">ไว้ที่นี่ที่เดียว!</span></h1><p className="mt-2 text-sm text-slate-300">อัปเดตทุกวัน คูปองใหม่เพียบ ห้ามพลาด!</p><div className="search-box mt-6"><Search size={18} className="text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ค้นหาคูปอง ร้านค้า หรือเกม..." /><kbd>⌘ K</kbd></div><div className="mt-3 flex flex-wrap gap-2 text-[11px]"><span className="text-slate-400">ยอดนิยม:</span>{['Shopee', 'Lazada', 'Free Fire', 'เติมเกม', 'ส่วนลด 50%'].map((tag) => <button key={tag} onClick={() => setQuery(tag)} className="tag">{tag}</button>)}</div></div><div className="hero-art"><div className="ticket-art">%</div><div className="gift-art">◆</div><span className="float-tag one">%</span><span className="float-tag two">◆</span></div></section>
          <aside className="panel p-4"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-[15px] font-bold"><Flame size={17} className="text-[#ff783d]" />คูปองยอดนิยม</h2><button className="text-[11px] text-[#f34496]">ดูทั้งหมด <ChevronRight size={13} className="inline" /></button></div><div className="space-y-2">{coupons.slice(0, 5).map((coupon, index) => <div className="trend-item" key={coupon.store}><span className={`rank rank-${index + 1}`}>{index + 1}</span><div className={`store-logo ${coupon.logoClass}`}>{coupon.logo}</div><div className="min-w-0 flex-1"><p className="text-[11px] font-semibold">{coupon.store}</p><p className="truncate text-[10px] text-slate-300">{coupon.description}</p><p className="text-[9px] text-slate-500">🔥 ใช้แล้ว {12 - index * 2},345 ครั้ง</p></div><span className="mini-code">{coupon.code}</span></div>)}</div></aside>
        </div>

        <section className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">{categories.map((category) => { const Icon = category.icon; return <button key={category.label} onClick={() => setActiveCategory(category.label)} className={`category-card ${activeCategory === category.label ? 'selected' : ''}`}><span className={`category-icon ${category.color}`}><Icon size={20} /></span><span>{category.label}</span><small>{category.count} คูปอง</small></button>; })}</section>

        <div id="coupons" className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_365px]">
          <section className="panel p-3 sm:p-4"><div className="tab-row">{['คูปองล่าสุด', 'ยอดนิยม', 'ใกล้หมดอายุ', 'คูปองใหม่วันนี้'].map((tab, index) => <button key={tab} onClick={() => setActiveTab(tab)} className={activeTab === tab ? 'tab active' : 'tab'}>{index === 0 ? <ZapIcon /> : index === 1 ? <Star size={13} /> : <Clock3 size={13} />}{tab}</button>)}<button className="ml-auto hidden text-xs text-slate-300 sm:block">ดูทั้งหมด <ChevronRight size={14} className="inline" /></button></div><div className="grid gap-3 pt-3 sm:grid-cols-2 xl:grid-cols-4">{filteredCoupons.map((coupon) => <CouponCard key={coupon.code} coupon={coupon} copied={copied} saved={saved} liked={liked} onCopy={handleCopy} onSave={() => toggleItem(saved, setSaved, coupon.store)} onLike={() => toggleItem(liked, setLiked, coupon.store)} />)}</div>{filteredCoupons.length === 0 && <div className="py-16 text-center text-sm text-slate-400">ไม่พบคูปองที่ค้นหา ลองใช้คำอื่นดูนะ</div>}<button className="mx-auto mt-3 flex items-center gap-2 rounded-lg border border-white/10 px-5 py-2 text-xs text-slate-300 transition hover:border-[#f72585] hover:text-white">ดูคูปองทั้งหมด <Grid2X2 size={14} /></button></section>
          <aside className="space-y-4"><div className="panel p-4"><div className="mb-3 flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-bold">📁 หมวดหมู่</h2><button className="text-[11px] text-[#f34496]">ดูทั้งหมด <ChevronRight size={13} className="inline" /></button></div><div className="grid grid-cols-3 gap-2">{categories.slice(1, 7).map(({ label, icon: Icon, color, count }) => <button className="mini-category" key={label}><Icon size={18} className={`text-${color === 'rose' ? '[#f24c9a]' : color === 'amber' ? '[#f3a927]' : color === 'blue' ? '[#5e8dff]' : '[#33d5db]'}`} /><span>{label}</span><small>{count}</small></button>)}</div></div><div className="newsletter-panel p-5"><div className="relative z-10"><Send size={28} className="mb-3 text-[#f04caa]" /><h2 className="text-lg font-bold">ไม่พลาดคูปองใหม่!</h2><p className="mt-1 text-xs text-slate-300">รับคูปองเด็ดๆ ก่อนใคร อัปเดตทุกวัน</p>{subscribed ? <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#172e2d] px-3 py-3 text-xs text-[#6ee7b7]"><Check size={15} />สมัครรับข่าวสารแล้ว</div> : <div className="mt-4 flex gap-2"><input value={newsletter} onChange={(event) => setNewsletter(event.target.value)} placeholder="กรอกอีเมลของคุณ" className="min-w-0 flex-1 rounded-lg border border-white/10 bg-black/20 px-3 text-xs outline-none placeholder:text-slate-500 focus:border-[#f72585]" /><button onClick={() => setSubscribed(true)} className="rounded-lg bg-[#f72585] px-3 text-xs font-bold">สมัครรับฟรี</button></div>}</div></div></aside>
        </div>

        <section className="benefits mt-4 grid gap-4 px-5 py-4 sm:grid-cols-2 lg:grid-cols-5"><div className="sm:col-span-2 lg:col-span-1"><h2 className="text-lg font-bold">ทำไมต้องใช้ Coupon Hub?</h2><p className="mt-1 text-[11px] text-slate-400">ช้อปคุ้มกว่าในทุกวัน</p></div>{[['▣', 'อัปเดตทุกวัน', 'คูปองใหม่ทุกวัน ไม่พลาดทุกโปร'], ['ϟ', 'ใช้งานง่าย', 'กดคัดลอกโค้ดได้ทันที'], ['▦', 'ครบทุกหมวด', 'รวมทุกคูปองไว้ที่นี่ที่เดียว'], ['✓', 'ใช้งานได้จริง', 'ตรวจสอบแล้ว ใช้ได้แน่นอน']].map(([icon, title, text]) => <div className="flex items-center gap-3" key={title}><span className="benefit-icon">{icon}</span><div><p className="text-xs font-semibold">{title}</p><p className="text-[10px] text-slate-400">{text}</p></div></div>)}</section>
      </main>
      <footer className="relative border-t border-white/[.08] px-5 py-5 text-xs text-slate-500"><div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4"><p>© 2024 Coupon Hub. All rights reserved.</p><div className="flex gap-5"><a href="#home">เกี่ยวกับเรา</a><a href="#home">ติดต่อเรา</a><a href="#home">นโยบายความเป็นส่วนตัว</a><a href="#home">เงื่อนไขการใช้งาน</a></div><div className="flex gap-4"><Camera size={16} /><PlayCircle size={16} /><Share2 size={16} /></div></div></footer>
      {copied && <div className="toast"><Check size={16} />คัดลอกโค้ด {copied} แล้ว</div>}
    </div>
  );
}

function ZapIcon() { return <span className="text-[#ffcf32]">ϟ</span>; }

function CouponCard({ coupon, copied, saved, liked, onCopy, onSave, onLike }: { coupon: Coupon; copied: string | null; saved: string[]; liked: string[]; onCopy: (code: string) => void; onSave: () => void; onLike: () => void }) {
  return <article className="coupon-card"><div className="flex items-start gap-2"><div className={`store-logo large ${coupon.logoClass}`}>{coupon.logo}</div><div className="min-w-0 flex-1"><div className="flex justify-between gap-1"><p className="truncate text-xs font-semibold">{coupon.store}</p>{coupon.hot && <Flame size={14} className="shrink-0 text-[#ff3e91]" />}</div><p className="mt-1 truncate text-[11px] text-slate-300">{coupon.description}</p></div></div><div className="code-box mt-3"><span>{coupon.code}</span><button onClick={() => onCopy(coupon.code)} aria-label="คัดลอกโค้ด">{copied === coupon.code ? <Check size={14} className="text-green-400" /> : <Copy size={13} />}</button></div><p className="mt-2 text-center text-[9px] text-slate-500"><Clock3 size={11} className="mr-1 inline" />ใช้ได้ถึง {coupon.expiry} <span className="mx-1">·</span> เงื่อนไข</p><div className="mt-2 flex gap-2"><button className="copy-button flex-1" onClick={() => onCopy(coupon.code)}>{copied === coupon.code ? 'คัดลอกแล้ว' : 'คัดลอกโค้ด'}</button><button onClick={onLike} className={`icon-button ${liked.includes(coupon.store) ? 'liked' : ''}`} aria-label="ถูกใจ"><Heart size={14} fill={liked.includes(coupon.store) ? 'currentColor' : 'none'} /></button><button onClick={onSave} className={`icon-button ${saved.includes(coupon.store) ? 'saved' : ''}`} aria-label="บันทึก"><Bookmark size={14} fill={saved.includes(coupon.store) ? 'currentColor' : 'none'} /></button></div></article>;
}

export default App;

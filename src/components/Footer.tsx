import { Link } from 'react-router-dom';
import { Camera, PlayCircle, Share2, TicketPercent } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[.08] px-5 py-8 text-xs text-slate-500">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#fa398a] to-[#a42af7] text-white"><TicketPercent size={16} /></div>
              <span className="text-sm font-bold text-white">COUPON HUB</span>
            </div>
            <p className="leading-relaxed">รวมทุกคูปอง ส่วนลด โปรโมชั่น ไว้ที่นี่ที่เดียว อัปเดตทุกวัน ใช้ได้จริง ไม่พลาดทุกดีล</p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-300">เกี่ยวกับ</h3>
            <ul className="space-y-2"><li><Link to="/" className="hover:text-[#ff55a5]">เกี่ยวกับเรา</Link></li><li><Link to="/" className="hover:text-[#ff55a5]">ติดต่อเรา</Link></li><li><Link to="/" className="hover:text-[#ff55a5]">บล็อก</Link></li></ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-300">นโยบาย</h3>
            <ul className="space-y-2"><li><Link to="/" className="hover:text-[#ff55a5]">นโยบายความเป็นส่วนตัว</Link></li><li><Link to="/" className="hover:text-[#ff55a5]">เงื่อนไขการใช้งาน</Link></li></ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold text-slate-300">ติดตามเรา</h3>
            <div className="flex gap-3">
              <a href="#" aria-label="Instagram" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:border-[#f72585]"><Camera size={16} /></a>
              <a href="#" aria-label="YouTube" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:border-[#f72585]"><PlayCircle size={16} /></a>
              <a href="#" aria-label="Share" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 hover:border-[#f72585]"><Share2 size={16} /></a>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t border-white/5 pt-4 text-center"><p>© 2024 Coupon Hub. All rights reserved.</p></div>
      </div>
    </footer>
  );
}

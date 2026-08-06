import { useState } from 'react';
import { Search } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = 'ค้นหาคูปอง ร้านค้า หรือเกม...' }: { onSearch: (q: string) => void; placeholder?: string }) {
  const [value, setValue] = useState('');
  return (
    <div className="flex h-[37px] max-w-[335px] items-center gap-2.5 rounded-lg border border-[#6c3f99] bg-[#0c0a25bb] px-3 shadow-[inset_0_0_25px_#6c1d9955]">
      <Search size={18} className="text-slate-400" />
      <input
        value={value}
        onChange={(e) => { setValue(e.target.value); onSearch(e.target.value); }}
        placeholder={placeholder}
        className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-white outline-none placeholder:text-[#858299]"
      />
      <kbd className="rounded border border-[#49405e] px-1.5 py-0.5 text-[9px] text-[#77728d]">⌘ K</kbd>
    </div>
  );
}

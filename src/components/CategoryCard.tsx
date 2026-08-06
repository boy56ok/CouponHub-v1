import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import type { Category } from '@/types';

const colorMap: Record<string, { bg: string; text: string }> = {
  pink: { bg: 'bg-[#e6298866]', text: 'text-[#ff499d]' },
  rose: { bg: 'bg-[#bd447244]', text: 'text-[#f762b2]' },
  amber: { bg: 'bg-[#603d1e66]', text: 'text-[#ffc04e]' },
  blue: { bg: 'bg-[#25408366]', text: 'text-[#7da0ff]' },
  cyan: { bg: 'bg-[#0c5d6a66]', text: 'text-[#44dadc]' },
  sky: { bg: 'bg-[#17436c66]', text: 'text-[#63b1ff]' },
  teal: { bg: 'bg-[#125d5766]', text: 'text-[#55d7bb]' },
  slate: { bg: 'bg-[#3b405066]', text: 'text-[#ced4e3]' },
};

export default function CategoryCard({ category, count }: { category: Category; count?: number }) {
  const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; className?: string }>>)[category.icon] || Icons.Tag;
  const colors = colorMap[category.color] || colorMap.pink;
  return (
    <Link to={`/category/${category.slug}`} className="flex min-h-[66px] flex-col items-center justify-center gap-1 rounded-lg border border-[#252a3e] bg-[#101322] px-2 py-2 text-[10px] text-[#c9ccda] transition-all hover:border-[#ef3b93] hover:bg-gradient-to-b hover:from-[#261334] hover:to-[#111323] hover:text-white hover:shadow-[0_0_18px_#f2268020]">
      <span className={`grid h-[30px] w-[30px] place-items-center rounded-full ${colors.bg} ${colors.text}`}><Icon size={20} /></span>
      <span>{category.name}</span>
      {count !== undefined && <small className="text-[8px] text-[#72788f]">{count} คูปอง</small>}
    </Link>
  );
}

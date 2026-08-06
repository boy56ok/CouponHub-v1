import { type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingState({ message = 'กำลังโหลด...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 text-slate-400">
      <Loader2 size={32} className="animate-spin text-[#f72585]" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ icon, title, message, action }: { icon?: ReactNode; title: string; message?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/10 py-16 text-center">
      {icon && <div className="text-slate-500">{icon}</div>}
      <p className="text-sm font-semibold text-slate-300">{title}</p>
      {message && <p className="max-w-xs text-xs text-slate-500">{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/20 bg-red-950/20 py-12 text-center">
      <p className="text-sm text-red-300">{message}</p>
      {onRetry && <button onClick={onRetry} className="rounded-lg border border-red-500/30 px-4 py-1.5 text-xs text-red-300 hover:bg-red-500/10">ลองอีกครั้ง</button>}
    </div>
  );
}

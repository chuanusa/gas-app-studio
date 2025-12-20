import { cn } from '@/lib/utils';
import { Lock, Unlock } from 'lucide-react';

interface StatusBadgeProps {
  isLocked: boolean;
}

export function StatusBadge({ isLocked }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors",
        isLocked
          ? "bg-success/10 text-success border border-success/20"
          : "bg-muted text-muted-foreground border border-border"
      )}
    >
      {isLocked ? (
        <>
          <Lock className="w-3 h-3" />
          已鎖定
        </>
      ) : (
        <>
          <Unlock className="w-3 h-3" />
          未鎖定
        </>
      )}
    </span>
  );
}

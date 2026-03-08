import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, Lock, Unlock } from 'lucide-react';

interface DepartmentCardProps {
  name: string;
  current: number;
  total: number;
  isLocked: boolean;
  index: number;
}

export function DepartmentCard({ name, current, total, isLocked, index }: DepartmentCardProps) {
  const progress = (current / total) * 100;
  const isComplete = progress >= 100;
  const isLow = progress < 50;
  const remaining = total - current;

  return (
    <div 
      className={cn(
        "rounded-lg border border-border/50 bg-card p-3 transition-all duration-200 hover:shadow-md opacity-0 animate-scale-in",
        isComplete && "ring-1 ring-success/20"
      )}
      style={{ animationDelay: `${0.03 * index}s` }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-foreground">{name}</h3>
        <span className={cn(
          "inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full",
          isLocked 
            ? "text-success bg-success/10" 
            : "text-muted-foreground bg-muted/50"
        )}>
          {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
          {isLocked ? '已鎖定' : '未鎖定'}
        </span>
      </div>

      <div className="flex items-end justify-between mb-2">
        <div className="flex items-baseline gap-1">
          <span className={cn(
            "text-xl font-bold",
            isComplete ? "text-success" : isLow ? "text-warning" : "text-primary"
          )}>
            {current}
          </span>
          <span className="text-xs text-muted-foreground">/ {total}</span>
        </div>
        <span className={cn(
          "text-xs font-medium",
          isComplete ? "text-success" : isLow ? "text-warning" : "text-primary"
        )}>
          {Math.round(progress)}%
        </span>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            isComplete 
              ? "bg-gradient-to-r from-success to-success/80" 
              : isLow 
                ? "bg-gradient-to-r from-warning to-warning/80"
                : "bg-gradient-to-r from-primary to-primary/80"
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

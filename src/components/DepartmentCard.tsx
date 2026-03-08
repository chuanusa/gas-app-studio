import { cn } from '@/lib/utils';
import { CircularProgress } from '@/components/ui/CircularProgress';
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
        "card-elevated p-4 transition-all duration-300 hover:scale-[1.02] opacity-0 animate-scale-in",
        isComplete && "ring-1 ring-success/20"
      )}
      style={{ animationDelay: `${0.04 * index}s` }}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <span className={cn(
            "inline-flex items-center gap-1 text-[11px] mt-0.5",
            isLocked ? "text-success" : "text-muted-foreground"
          )}>
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            {isLocked ? '已鎖定' : '未鎖定'}
          </span>
        </div>
        <CircularProgress progress={progress} size={52} strokeWidth={4} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
            <CheckCircle2 className="w-3 h-3 text-success" />
            已報名
          </div>
          <p className="text-xl font-bold text-foreground">{current}</p>
        </div>
        <div className="bg-muted/50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-1.5 text-muted-foreground text-[11px] mb-0.5">
            <Clock className={cn("w-3 h-3", remaining > 0 ? "text-warning" : "text-success")} />
            {remaining > 0 ? '待報名' : '總人數'}
          </div>
          <p className={cn("text-xl font-bold", remaining > 0 ? "text-warning" : "text-foreground")}>
            {remaining > 0 ? remaining : total}
          </p>
        </div>
      </div>

      <div className="mt-3 h-1 rounded-full overflow-hidden bg-muted">
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

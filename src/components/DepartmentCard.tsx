import { cn } from '@/lib/utils';
import { CircularProgress } from '@/components/ui/CircularProgress';
import { Users, CheckCircle2, Clock, AlertCircle, Lock, Unlock } from 'lucide-react';

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
        "card-elevated p-5 transition-all duration-300 hover:scale-[1.02] opacity-0 animate-scale-in",
        isComplete && "ring-2 ring-success/20 bg-success/5"
      )}
      style={{ animationDelay: `${0.05 * index}s` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground text-lg">{name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            {isLocked ? (
              <span className="inline-flex items-center gap-1 text-xs text-success">
                <Lock className="w-3 h-3" />
                已鎖定
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Unlock className="w-3 h-3" />
                未鎖定
              </span>
            )}
          </div>
        </div>
        <CircularProgress progress={progress} size={64} strokeWidth={5} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-success" />
            已報名
          </div>
          <p className="text-2xl font-bold text-foreground">{current}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
            {remaining > 0 ? (
              <>
                <Clock className="w-3.5 h-3.5 text-warning" />
                待報名
              </>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-success" />
                總人數
              </>
            )}
          </div>
          <p className={cn(
            "text-2xl font-bold",
            remaining > 0 ? "text-warning" : "text-foreground"
          )}>
            {remaining > 0 ? remaining : total}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
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
    </div>
  );
}

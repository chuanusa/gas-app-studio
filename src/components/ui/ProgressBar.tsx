import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number;
  current: number;
  total: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ progress, current, total, showLabel = true, size = 'md' }: ProgressBarProps) {
  const isComplete = progress >= 100;
  const isLow = progress < 50;

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  }[size];

  return (
    <div className="space-y-1.5">
      <div className={cn("rounded-full overflow-hidden bg-muted", heightClass)}>
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
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className={cn(
            "font-medium",
            isComplete ? "text-success" : isLow ? "text-warning" : "text-primary"
          )}>
            {progress.toFixed(0)}%
          </span>
          <span className="text-muted-foreground">
            {current} / {total}
          </span>
        </div>
      )}
    </div>
  );
}

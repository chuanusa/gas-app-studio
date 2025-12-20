import { cn } from '@/lib/utils';

interface CircularProgressProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export function CircularProgress({ 
  progress, 
  size = 80, 
  strokeWidth = 6,
  className 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  
  const isComplete = progress >= 100;
  const isLow = progress < 50;
  const isMedium = progress >= 50 && progress < 100;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={
            isComplete 
              ? "hsl(var(--success))" 
              : isLow 
                ? "hsl(var(--warning))" 
                : "hsl(var(--primary))"
          }
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={cn(
          "text-lg font-bold",
          isComplete ? "text-success" : isLow ? "text-warning" : "text-primary"
        )}>
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
}

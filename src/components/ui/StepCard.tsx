import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  step: number;
  title: string;
  children: ReactNode;
  className?: string;
}

export function StepCard({ step, title, children, className }: StepCardProps) {
  return (
    <div 
      className={cn(
        "card-elevated p-4 sm:p-5 opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${step * 0.06}s` }}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex-shrink-0 w-7 h-7 rounded-md bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-xs shadow-sm">
          {step}
        </div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

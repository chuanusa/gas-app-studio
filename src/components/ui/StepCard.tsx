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
        "card-elevated p-5 opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${step * 0.08}s` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
          {step}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

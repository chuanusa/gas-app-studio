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
        "card-elevated p-6 opacity-0 animate-slide-up",
        className
      )}
      style={{ animationDelay: `${step * 0.1}s` }}
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-primary-foreground font-bold text-lg shadow-md">
          {step}
        </div>
        <h2 className="text-xl font-semibold text-foreground pt-1.5">{title}</h2>
      </div>
      <div className="pl-14">
        {children}
      </div>
    </div>
  );
}

import { Users, CheckCircle2, Clock, Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsOverviewProps {
  totalDepartments: number;
  completedDepartments: number;
  totalPeople: number;
  registeredPeople: number;
}

export function StatsOverview({ 
  totalDepartments, 
  completedDepartments, 
  totalPeople, 
  registeredPeople 
}: StatsOverviewProps) {
  const overallProgress = (registeredPeople / totalPeople) * 100;
  const pendingPeople = totalPeople - registeredPeople;

  const stats = [
    {
      label: '已報名',
      value: registeredPeople,
      subValue: `/ ${totalPeople}`,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: '待報名',
      value: pendingPeople,
      subValue: '人',
      icon: Clock,
      color: pendingPeople > 0 ? 'text-warning' : 'text-success',
      bgColor: pendingPeople > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
    {
      label: '完成部門',
      value: completedDepartments,
      subValue: `/ ${totalDepartments}`,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '進度',
      value: `${overallProgress.toFixed(0)}%`,
      subValue: '',
      icon: Users,
      color: overallProgress >= 100 ? 'text-success' : 'text-primary',
      bgColor: overallProgress >= 100 ? 'bg-success/10' : 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 mb-5">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="rounded-xl border border-border/50 bg-card p-3 opacity-0 animate-slide-up"
          style={{ animationDelay: `${0.1 * index}s` }}
        >
          <div className="flex items-center gap-2.5">
            <div className={cn("p-2 rounded-lg", stat.bgColor)}>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-muted-foreground truncate">{stat.label}</p>
              <p className="text-lg font-bold text-foreground leading-tight">
                {stat.value}
                <span className="text-xs font-normal text-muted-foreground ml-0.5">
                  {stat.subValue}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

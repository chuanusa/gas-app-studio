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
      label: '總報名人數',
      value: registeredPeople,
      subValue: `/ ${totalPeople}`,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: '待報名人數',
      value: pendingPeople,
      subValue: '人',
      icon: Clock,
      color: pendingPeople > 0 ? 'text-warning' : 'text-success',
      bgColor: pendingPeople > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
    {
      label: '已完成部門',
      value: completedDepartments,
      subValue: `/ ${totalDepartments}`,
      icon: Building2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: '整體進度',
      value: `${overallProgress.toFixed(0)}%`,
      subValue: '',
      icon: Users,
      color: overallProgress >= 100 ? 'text-success' : 'text-primary',
      bgColor: overallProgress >= 100 ? 'bg-success/10' : 'bg-primary/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="card-elevated p-4 opacity-0 animate-slide-up"
          style={{ animationDelay: `${0.1 * index}s` }}
        >
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", stat.bgColor)}>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xl font-bold text-foreground">
                {stat.value}
                <span className="text-sm font-normal text-muted-foreground ml-1">
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

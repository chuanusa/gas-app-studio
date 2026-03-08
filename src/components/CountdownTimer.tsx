import { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  deadline: Date;
}

function getTimeLeft(deadline: Date) {
  const diff = deadline.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
}

export function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(deadline)), 1000);
    return () => clearInterval(id);
  }, [deadline]);

  const isUrgent = !time.expired && time.days < 3;
  const units = [
    { label: '天', value: time.days },
    { label: '時', value: time.hours },
    { label: '分', value: time.minutes },
    { label: '秒', value: time.seconds },
  ];

  return (
    <div className={cn(
      "card-elevated p-5 opacity-0 animate-slide-up",
      time.expired && "ring-2 ring-destructive/30 bg-destructive/5",
      isUrgent && !time.expired && "ring-2 ring-warning/30 bg-warning/5"
    )}>
      <div className="flex items-center gap-2 mb-3">
        {isUrgent || time.expired ? (
          <AlertTriangle className={cn("w-5 h-5", time.expired ? "text-destructive" : "text-warning")} />
        ) : (
          <Clock className="w-5 h-5 text-primary" />
        )}
        <h3 className="font-semibold text-foreground">
          {time.expired ? '報名已截止' : '報名截止倒數'}
        </h3>
      </div>

      <div className="flex items-center justify-center gap-2">
        {units.map((u) => (
          <div key={u.label} className="flex flex-col items-center">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold",
              time.expired
                ? "bg-destructive/10 text-destructive"
                : isUrgent
                  ? "bg-warning/10 text-warning"
                  : "bg-primary/10 text-primary"
            )}>
              {String(u.value).padStart(2, '0')}
            </div>
            <span className="text-xs text-muted-foreground mt-1">{u.label}</span>
          </div>
        ))}
      </div>

      {!time.expired && (
        <p className="text-xs text-muted-foreground text-center mt-3">
          截止日期：{deadline.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      )}
    </div>
  );
}

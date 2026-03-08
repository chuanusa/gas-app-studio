import { useState } from 'react';
import { AlertTriangle, Bell, ChevronDown, ChevronUp, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface UnregisteredInfo {
  department: string;
  names: string[];
}

interface DeadlineNotificationProps {
  deadline: Date;
  unregisteredByDept: UnregisteredInfo[];
}

export function DeadlineNotification({ deadline, unregisteredByDept }: DeadlineNotificationProps) {
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / 86400000);
  const totalUnregistered = unregisteredByDept.reduce((acc, d) => acc + d.names.length, 0);

  if (dismissed || daysLeft > 2 || daysLeft < 0 || totalUnregistered === 0) return null;

  const handleNotifyAll = () => {
    toast({
      title: '催報通知已發送',
      description: `已向 ${unregisteredByDept.length} 個部門共 ${totalUnregistered} 位未報名同仁發送提醒。`,
    });
  };

  const handleNotifyDept = (dept: string, count: number) => {
    toast({
      title: `已通知「${dept}」`,
      description: `已向 ${count} 位未報名同仁發送提醒。`,
    });
  };

  return (
    <div className={cn(
      "rounded-xl border-2 border-[hsl(var(--warning))]/40 bg-[hsl(var(--warning))]/5 p-4 mb-4 animate-fade-in",
      daysLeft <= 1 && "border-destructive/40 bg-destructive/5"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className={cn(
            "mt-0.5 p-2 rounded-lg shrink-0",
            daysLeft <= 1 ? "bg-destructive/10" : "bg-[hsl(var(--warning))]/10"
          )}>
            <AlertTriangle className={cn(
              "w-4 h-4",
              daysLeft <= 1 ? "text-destructive" : "text-[hsl(var(--warning))]"
            )} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-3.5 h-3.5" />
              報名截止前 {daysLeft} 天提醒
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              目前仍有 <span className="font-semibold text-foreground">{unregisteredByDept.length}</span> 個部門共{' '}
              <span className="font-semibold text-foreground">{totalUnregistered}</span> 位同仁尚未完成報名，請儘速催報。
            </p>
          </div>
        </div>
        <button onClick={() => setDismissed(true)} className="text-muted-foreground hover:text-foreground transition-colors p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          className="btn-gradient-primary gap-1.5 h-8 text-xs"
          onClick={handleNotifyAll}
        >
          <Send className="w-3.5 h-3.5" />
          一鍵催報全部 ({totalUnregistered} 人)
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5 h-8 text-xs"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          查看未報名清單
        </Button>
      </div>

      {expanded && (
        <div className="mt-3 space-y-2 animate-fade-in">
          {unregisteredByDept.map((dept) => (
            <div
              key={dept.department}
              className="rounded-lg border border-border bg-card p-3 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-xs font-semibold text-foreground">{dept.department}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5 truncate">
                  {dept.names.join('、')}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="shrink-0 gap-1 h-7 text-[11px]"
                onClick={() => handleNotifyDept(dept.department, dept.names.length)}
              >
                <Send className="w-3 h-3" />
                催報 ({dept.names.length})
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

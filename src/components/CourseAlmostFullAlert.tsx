import { useMemo } from 'react';
import { AlertTriangle, Bell, X, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Course } from './CourseManagement';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface CourseAlmostFullAlertProps {
  courses: Course[];
  threshold: number;
  onThresholdChange: (value: number) => void;
  dismissedIds: string[];
  onDismiss: (id: string) => void;
}

export function CourseAlmostFullAlert({ courses, threshold, onThresholdChange, dismissedIds, onDismiss }: CourseAlmostFullAlertProps) {
  const almostFullCourses = useMemo(() =>
    courses.filter(c => {
      if (!c.enabled || dismissedIds.includes(c.id)) return false;
      const pct = (c.enrolled / c.capacity) * 100;
      return pct >= threshold;
    }),
    [courses, threshold, dismissedIds]
  );

  if (almostFullCourses.length === 0) return null;

  return (
    <div className="space-y-2 mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-medium text-[hsl(var(--warning))]">
          <Bell className="w-3.5 h-3.5" />
          <span>額滿提醒 ({almostFullCourses.length})</span>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors px-1.5 py-0.5 rounded hover:bg-muted/50">
              <Settings2 className="w-3 h-3" />
              閾值 {threshold}%
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3" align="end">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-foreground">提醒閾值設定</p>
                <span className="text-xs font-semibold text-primary">{threshold}%</span>
              </div>
              <Slider
                value={[threshold]}
                onValueChange={([v]) => onThresholdChange(v)}
                min={50}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>50%</span>
                <span>100%</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                當課程報名達到此百分比時顯示提醒
              </p>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {almostFullCourses.map(course => {
        const pct = Math.round((course.enrolled / course.capacity) * 100);
        const isFull = course.enrolled >= course.capacity;
        return (
          <div
            key={course.id}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg border p-2.5 text-sm",
              isFull
                ? "border-destructive/30 bg-destructive/5"
                : "border-[hsl(var(--warning))]/30 bg-[hsl(var(--warning))]/5"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertTriangle className={cn(
                "w-4 h-4 shrink-0",
                isFull ? "text-destructive" : "text-[hsl(var(--warning))]"
              )} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {course.name}
                  <span className={cn(
                    "ml-2 text-[10px] font-semibold",
                    isFull ? "text-destructive" : "text-[hsl(var(--warning))]"
                  )}>
                    {isFull ? '已額滿' : `${pct}% — 僅剩 ${course.capacity - course.enrolled} 名額`}
                  </span>
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {course.instructor} · {course.date} · {course.enrolled}/{course.capacity} 人
                </p>
              </div>
            </div>
            <button
              onClick={() => onDismiss(course.id)}
              className="shrink-0 p-1 rounded hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

import { StepCard } from '@/components/ui/StepCard';
import { DepartmentCard } from '@/components/DepartmentCard';
import { StatsOverview } from '@/components/StatsOverview';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Lock, RefreshCw, LayoutGrid, List, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';

const departmentData = [
  { name: '人資課', current: 1, total: 3, isLocked: false },
  { name: '政風課', current: 1, total: 1, isLocked: false },
  { name: '工安組', current: 7, total: 7, isLocked: false },
  { name: '工務組', current: 17, total: 17, isLocked: false },
  { name: '規劃組', current: 20, total: 20, isLocked: false },
  { name: '檢驗組', current: 20, total: 20, isLocked: false },
  { name: '土木隊', current: 15, total: 15, isLocked: false },
  { name: '建築隊', current: 8, total: 15, isLocked: false },
  { name: '電氣隊', current: 12, total: 14, isLocked: false },
  { name: '機械隊', current: 10, total: 21, isLocked: false },
  { name: '中部隊', current: 4, total: 24, isLocked: false },
  { name: '南部隊', current: 18, total: 22, isLocked: false },
];

const departments = departmentData.map(d => d.name);
const totalPeople = departmentData.reduce((acc, d) => acc + d.total, 0);
const registeredPeople = departmentData.reduce((acc, d) => acc + d.current, 0);
const completedDepartments = departmentData.filter(d => d.current === d.total).length;

export function DepartmentTable() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  return (
    <StepCard step={2} title="主管確認與下載">
      <p className="text-xs text-muted-foreground mb-3">
        請各部門主管確認同仁填報狀態，確認後可「鎖定」並「列印」簽核總表。
      </p>

      <StatsOverview 
        totalDepartments={departmentData.length}
        completedDepartments={completedDepartments}
        totalPeople={totalPeople}
        registeredPeople={registeredPeople}
      />

      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-muted-foreground">各部門報名狀態</h3>
        <div className="flex items-center gap-0.5 p-0.5 bg-muted/50 rounded-md">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              "p-1 rounded transition-colors",
              viewMode === 'grid' 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              "p-1 rounded transition-colors",
              viewMode === 'list' 
                ? "bg-background shadow-sm text-foreground" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 mb-4">
          {departmentData.map((dept, index) => (
            <DepartmentCard key={dept.name} {...dept} index={index} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>部門</th>
                  <th className="min-w-[140px]">填報進度</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept, index) => {
                  const progress = (dept.current / dept.total) * 100;
                  return (
                    <tr 
                      key={dept.name}
                      className="opacity-0 animate-fade-in"
                      style={{ animationDelay: `${0.3 + index * 0.03}s` }}
                    >
                      <td className="font-medium text-foreground text-sm">{dept.name}</td>
                      <td>
                        <ProgressBar progress={progress} current={dept.current} total={dept.total} size="sm" />
                      </td>
                      <td>
                        <StatusBadge isLocked={dept.isLocked} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h3 className="text-xs font-medium text-muted-foreground mb-2">快速選取部門</h3>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {departmentData.map((dept) => {
          const isSelected = selectedDept === dept.name;
          const isComplete = dept.current === dept.total;
          return (
            <button
              key={dept.name}
              onClick={() => setSelectedDept(isSelected ? null : dept.name)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : isComplete
                    ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/30 hover:border-[hsl(var(--success))]/60"
                    : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {isSelected && <Check className="w-3 h-3" />}
              {dept.name}
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-full",
                isSelected ? "bg-primary-foreground/20" : "bg-muted"
              )}>
                {dept.current}/{dept.total}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <Button size="sm" className="btn-gradient-primary gap-1.5 h-9 text-xs" disabled={!selectedDept}>
          <Printer className="w-3.5 h-3.5" />
          列印簽核表{selectedDept ? `（${selectedDept}）` : ''}
        </Button>
        <Button size="sm" className="btn-gradient-accent gap-1.5 h-9 text-xs" disabled={!selectedDept}>
          <Lock className="w-3.5 h-3.5" />
          鎖定部門
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 h-9 text-xs">
          <RefreshCw className="w-3.5 h-3.5" />
          重整
        </Button>
      </div>
    </StepCard>
  );
}

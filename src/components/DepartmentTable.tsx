import { StepCard } from '@/components/ui/StepCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Printer, Lock, RefreshCw } from 'lucide-react';

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

export function DepartmentTable() {
  return (
    <StepCard step={2} title="主管確認與下載">
      <p className="text-muted-foreground mb-6">
        請各部門主管或經辦確認部門同仁填報狀態。確認無誤後，可「鎖定」並「列印」簽核總表。
      </p>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>部門</th>
                <th className="min-w-[180px]">填報進度</th>
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
                    style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                  >
                    <td className="font-medium text-foreground">{dept.name}</td>
                    <td>
                      <ProgressBar 
                        progress={progress} 
                        current={dept.current} 
                        total={dept.total}
                        size="sm"
                      />
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

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Select>
          <SelectTrigger className="sm:w-64 h-11 bg-background">
            <SelectValue placeholder="選擇部門以列印..." />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 flex-wrap">
          <Button className="btn-gradient-primary gap-2">
            <Printer className="w-4 h-4" />
            列印簽核表
          </Button>
          <Button className="btn-gradient-accent gap-2">
            <Lock className="w-4 h-4" />
            鎖定部門提交
          </Button>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            重整列表
          </Button>
        </div>
      </div>
    </StepCard>
  );
}

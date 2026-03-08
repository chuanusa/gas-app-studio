import { StepCard } from '@/components/ui/StepCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { User, Building2 } from 'lucide-react';

const departments = [
  '人資課', '政風課', '工安組', '工務組', '規劃組', '檢驗組',
  '土木隊', '建築隊', '電氣隊', '機械隊', '中部隊', '南部隊'
];

export function RegistrationSection() {
  return (
    <StepCard step={1} title="登錄參加課程（個人報名）">
      <p className="text-sm text-muted-foreground mb-4">
        請選擇「部門」與「姓名」，系統將自動列出可報名的課程。
      </p>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            部門
          </Label>
          <Select>
            <SelectTrigger className="h-10 bg-background border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="請選擇部門..." />
            </SelectTrigger>
            <SelectContent>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <User className="w-3.5 h-3.5 text-primary" />
            姓名
          </Label>
          <Select>
            <SelectTrigger className="h-10 bg-background border-border hover:border-primary/50 transition-colors">
              <SelectValue placeholder="請選擇姓名..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placeholder">請先選擇部門</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </StepCard>
  );
}

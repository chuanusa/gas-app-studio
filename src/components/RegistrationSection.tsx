import { useState } from 'react';
import { StepCard } from '@/components/ui/StepCard';
import { Label } from '@/components/ui/label';
import { User, Building2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const departments = [
  '人資課', '政風課', '工安組', '工務組', '規劃組', '檢驗組',
  '土木隊', '建築隊', '電氣隊', '機械隊', '中部隊', '南部隊'
];

const mockNames: Record<string, string[]> = {
  '人資課': ['王小明', '李大華', '張美玲'],
  '政風課': ['陳志強'],
  '工安組': ['林建宏', '黃志偉', '吳美惠', '劉家豪'],
  '工務組': ['趙一', '錢二', '孫三'],
  '規劃組': ['周四', '吳五', '鄭六'],
  '檢驗組': ['王七', '馮八'],
  '土木隊': ['陳九', '褚十'],
  '建築隊': ['衛一', '蔣二'],
  '電氣隊': ['沈三', '韓四'],
  '機械隊': ['楊五', '朱六'],
  '中部隊': ['秦七', '尤八'],
  '南部隊': ['許九', '何十'],
};

export function RegistrationSection() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const names = selectedDept ? mockNames[selectedDept] ?? [] : [];

  return (
    <StepCard step={1} title="登錄參加課程（個人報名）">
      <p className="text-sm text-muted-foreground mb-4">
        請選擇「部門」與「姓名」，系統將自動列出可報名的課程。
      </p>

      <div className="space-y-4">
        <div>
          <Label className="flex items-center gap-1.5 text-sm font-medium mb-2">
            <Building2 className="w-3.5 h-3.5 text-primary" />
            部門
          </Label>
          <div className="flex flex-wrap gap-1.5">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => {
                    setSelectedDept(isSelected ? null : dept);
                    setSelectedName(null);
                  }}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {dept}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label className="flex items-center gap-1.5 text-sm font-medium mb-2">
            <User className="w-3.5 h-3.5 text-primary" />
            姓名
          </Label>
          {names.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {names.map((name) => {
                const isSelected = selectedName === name;
                return (
                  <button
                    key={name}
                    onClick={() => setSelectedName(isSelected ? null : name)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {name}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">請先選擇部門</p>
          )}
        </div>
      </div>
    </StepCard>
  );
}

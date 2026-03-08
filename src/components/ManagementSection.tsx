import { useState } from 'react';
import { StepCard } from '@/components/ui/StepCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, LayoutGrid, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const departments = [
  '人資課', '政風課', '工安組', '工務組', '規劃組', '檢驗組',
  '土木隊', '建築隊', '電氣隊', '機械隊', '中部隊', '南部隊'
];

export function ManagementSection() {
  const [selectedDept, setSelectedDept] = useState<string | null>(null);

  return (
    <StepCard step={4} title="部門管理控制台">
      <p className="text-sm text-muted-foreground mb-3">
        依「人員」或「課程」視角進行批次管理。
      </p>

      <div className="space-y-4">
        <div>
          <h3 className="text-xs font-medium text-muted-foreground mb-2">選擇部門</h3>
          <div className="flex flex-wrap gap-1.5">
            {departments.map((dept) => {
              const isSelected = selectedDept === dept;
              return (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(isSelected ? null : dept)}
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

        <Tabs defaultValue="personnel" className="w-full">
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-2 h-9 p-0.5 bg-muted/50">
            <TabsTrigger value="personnel" className="gap-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-3.5 h-3.5" />
              人員視角
            </TabsTrigger>
            <TabsTrigger value="course" className="gap-1.5 text-sm data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookOpen className="w-3.5 h-3.5" />
              課程視角
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personnel" className="mt-4">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <LayoutGrid className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedDept ? `已選擇「${selectedDept}」— 人員管理功能開發中` : '請先選擇部門以顯示人員管理卡片'}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="course" className="mt-4">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedDept ? `已選擇「${selectedDept}」— 課程管理功能開發中` : '請先選擇部門以顯示課程管理卡片'}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StepCard>
  );
}

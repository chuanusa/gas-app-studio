import { StepCard } from '@/components/ui/StepCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, BookOpen, LayoutGrid } from 'lucide-react';

const departments = [
  '人資課', '政風課', '工安組', '工務組', '規劃組', '檢驗組',
  '土木隊', '建築隊', '電氣隊', '機械隊', '中部隊', '南部隊'
];

export function ManagementSection() {
  return (
    <StepCard step={4} title="部門管理控制台">
      <p className="text-sm text-muted-foreground mb-4">
        依「人員」或「課程」視角進行批次管理。
      </p>

      <div className="space-y-4">
        <Select>
          <SelectTrigger className="w-full sm:w-56 h-10 bg-background text-sm">
            <SelectValue placeholder="請選擇部門..." />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>{dept}</SelectItem>
            ))}
          </SelectContent>
        </Select>

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
              <p className="text-sm text-muted-foreground">請先選擇部門以顯示人員管理卡片</p>
            </div>
          </TabsContent>

          <TabsContent value="course" className="mt-4">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-10 text-center">
              <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">請先選擇部門以顯示課程管理卡片</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StepCard>
  );
}

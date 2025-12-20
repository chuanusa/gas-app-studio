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
      <p className="text-muted-foreground mb-6">
        卡片式管理介面：可依「人員」或「課程」視角進行批次管理。
      </p>

      <div className="space-y-5">
        <Select>
          <SelectTrigger className="w-full sm:w-64 h-11 bg-background">
            <SelectValue placeholder="請選擇部門..." />
          </SelectTrigger>
          <SelectContent>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Tabs defaultValue="personnel" className="w-full">
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-2 h-11 p-1 bg-muted/50">
            <TabsTrigger value="personnel" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <Users className="w-4 h-4" />
              人員視角
            </TabsTrigger>
            <TabsTrigger value="course" className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
              <BookOpen className="w-4 h-4" />
              課程視角
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personnel" className="mt-5">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <LayoutGrid className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                請先選擇部門以顯示人員管理卡片
              </p>
            </div>
          </TabsContent>

          <TabsContent value="course" className="mt-5">
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <p className="text-muted-foreground">
                請先選擇部門以顯示課程管理卡片
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </StepCard>
  );
}

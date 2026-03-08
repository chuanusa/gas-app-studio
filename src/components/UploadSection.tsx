import { StepCard } from '@/components/ui/StepCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Building2, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';

const departments = [
  '人資課', '政風課', '工安組', '工務組', '規劃組', '檢驗組',
  '土木隊', '建築隊', '電氣隊', '機械隊', '中部隊', '南部隊'
];

export function UploadSection() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <StepCard step={3} title="上傳與管理">
      <p className="text-sm text-muted-foreground mb-4">
        請將已核章檔案（建議 PDF）上傳，可於下方追蹤歷史紀錄。
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <Building2 className="w-3.5 h-3.5 text-primary" />
              部門
            </Label>
            <Select>
              <SelectTrigger className="h-10 bg-background">
                <SelectValue placeholder="選擇部門..." />
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
              上傳者姓名
            </Label>
            <Input placeholder="請輸入姓名" className="h-10 bg-background" />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-sm font-medium">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              備註說明
            </Label>
            <Input placeholder="可選填" className="h-10 bg-background" />
          </div>
        </div>

        <div className="space-y-3">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <FileText className="w-3.5 h-3.5 text-primary" />
            選擇檔案
          </Label>
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl p-6 text-center transition-all",
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
            )}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDragActive(false)}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">拖曳檔案至此處</p>
                <p className="text-xs text-muted-foreground mt-0.5">支援 PDF、JPG、PNG</p>
              </div>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          <Button size="sm" className="w-full btn-gradient-primary gap-1.5 h-10">
            <Upload className="w-3.5 h-3.5" />
            上傳檔案
          </Button>
        </div>
      </div>
    </StepCard>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

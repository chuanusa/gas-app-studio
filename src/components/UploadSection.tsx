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
      <p className="text-muted-foreground mb-6">
        請將已核章完成的檔案（建議為 PDF）透過此處上傳。您可於下方追蹤歷史上傳紀錄。
      </p>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Building2 className="w-4 h-4 text-primary" />
              部門
            </Label>
            <Select>
              <SelectTrigger className="h-11 bg-background">
                <SelectValue placeholder="選擇您的部門..." />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <User className="w-4 h-4 text-primary" />
              上傳者姓名
            </Label>
            <Input 
              placeholder="請輸入您的姓名" 
              className="h-11 bg-background"
            />
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MessageSquare className="w-4 h-4 text-primary" />
              上傳說明
            </Label>
            <Input 
              placeholder="可選填備註說明" 
              className="h-11 bg-background"
            />
          </div>
        </div>

        {/* File Upload Zone */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4 text-primary" />
            選擇檔案
          </Label>
          <div
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center transition-all
              ${dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50 hover:bg-muted/50'
              }
            `}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDragActive(false)}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">
                  拖曳檔案至此處
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  或點擊選擇檔案（支援 PDF、JPG、PNG）
                </p>
              </div>
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>

          <Button className="w-full btn-gradient-primary gap-2 h-11">
            <Upload className="w-4 h-4" />
            上傳檔案
          </Button>
        </div>
      </div>
    </StepCard>
  );
}

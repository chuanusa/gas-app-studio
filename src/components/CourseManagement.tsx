import { useState } from 'react';
import { StepCard } from '@/components/ui/StepCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Plus, Edit2, Trash2, Search, Clock, MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { EnrollmentTrendChart } from '@/components/EnrollmentTrendChart';

export interface Course {
  id: string;
  name: string;
  category: string;
  hours: number;
  instructor: string;
  date: string;
  location: string;
  capacity: number;
  enrolled: number;
  description: string;
  enabled: boolean;
}

const categories = ['一般安全', '特殊作業', '消防訓練', '急救訓練', '環境保護', '法規宣導'];

const initialCourses: Course[] = [
  { id: '1', name: '一般工安教育訓練', category: '一般安全', hours: 3, instructor: '林安全', date: '2024-04-15', location: '第一會議室', capacity: 50, enrolled: 42, description: '基礎工安觀念與案例分析', enabled: true },
  { id: '2', name: '高空作業安全講習', category: '特殊作業', hours: 6, instructor: '陳高空', date: '2024-04-18', location: '訓練中心', capacity: 30, enrolled: 30, description: '高空作業安全規範、防墜設備使用與實作演練', enabled: true },
  { id: '3', name: '消防安全與逃生演練', category: '消防訓練', hours: 4, instructor: '王消防', date: '2024-04-20', location: '廠區廣場', capacity: 100, enrolled: 67, description: '滅火器使用、火場逃生要領、緊急疏散演練', enabled: true },
  { id: '4', name: 'CPR 及 AED 急救訓練', category: '急救訓練', hours: 4, instructor: '張急救', date: '2024-04-22', location: '醫護站', capacity: 25, enrolled: 25, description: '心肺復甦術與自動體外心臟電擊器操作', enabled: true },
  { id: '5', name: '有機溶劑作業危害預防', category: '環境保護', hours: 3, instructor: '劉環安', date: '2024-04-25', location: '第二會議室', capacity: 40, enrolled: 0, description: '有機溶劑種類辨識、個人防護具使用', enabled: false },
  { id: '6', name: '職業安全衛生法規概論', category: '法規宣導', hours: 2, instructor: '黃法規', date: '2024-04-28', location: '線上', capacity: 200, enrolled: 156, description: '最新法規修訂重點與合規要求說明', enabled: true },
];

const emptyCourse: Omit<Course, 'id'> = {
  name: '', category: '一般安全', hours: 3, instructor: '', date: '',
  location: '', capacity: 50, enrolled: 0, description: '', enabled: true,
};

export function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form, setForm] = useState<Omit<Course, 'id'>>(emptyCourse);

  const filtered = courses.filter(c => {
    const matchSearch = c.name.includes(search) || c.instructor.includes(search);
    const matchCat = filterCategory === 'all' || c.category === filterCategory;
    const matchStatus = filterStatus === 'all' || (filterStatus === 'enabled' ? c.enabled : !c.enabled);
    return matchSearch && matchCat && matchStatus;
  });

  const openCreate = () => {
    setEditingCourse(null);
    setForm(emptyCourse);
    setDialogOpen(true);
  };

  const openEdit = (course: Course) => {
    setEditingCourse(course);
    setForm({ name: course.name, category: course.category, hours: course.hours, instructor: course.instructor, date: course.date, location: course.location, capacity: course.capacity, enrolled: course.enrolled, description: course.description, enabled: course.enabled });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.instructor.trim()) {
      toast({ title: '請填寫必要欄位', description: '課程名稱與講師為必填。', variant: 'destructive' });
      return;
    }
    if (editingCourse) {
      setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...form } : c));
      toast({ title: '課程已更新', description: `「${form.name}」已成功更新。` });
    } else {
      const newCourse: Course = { ...form, id: Date.now().toString() };
      setCourses(prev => [...prev, newCourse]);
      toast({ title: '課程已新增', description: `「${form.name}」已成功新增。` });
    }
    setDialogOpen(false);
  };

  const handleDelete = (course: Course) => {
    setCourses(prev => prev.filter(c => c.id !== course.id));
    toast({ title: '課程已刪除', description: `「${course.name}」已移除。` });
  };

  const handleToggle = (course: Course) => {
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, enabled: !c.enabled } : c));
    toast({ title: course.enabled ? '課程已停用' : '課程已啟用', description: `「${course.name}」狀態已變更。` });
  };

  return (
    <StepCard step={2} title="課程種類管理">
      <p className="text-xs text-muted-foreground mb-3">
        新增、編輯或停用訓練課程，含講師、時數、地點、人數上限等完整資訊。
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-3">
        {[
          { label: '課程總數', value: courses.length, icon: BookOpen, color: 'text-primary' },
          { label: '啟用中', value: courses.filter(c => c.enabled).length, icon: Calendar, color: 'text-[hsl(var(--success))]' },
          { label: '已停用', value: courses.filter(c => !c.enabled).length, icon: Clock, color: 'text-destructive' },
          { label: '已報名', value: courses.reduce((a, c) => a + c.enrolled, 0), icon: Users, color: 'text-accent' },
          { label: '額滿課程', value: courses.filter(c => c.enrolled >= c.capacity).length, icon: MapPin, color: 'text-[hsl(var(--warning))]' },
        ].map(s => (
          <div key={s.label} className="rounded-lg border border-border bg-card p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 rounded-md bg-muted/50">
              <s.icon className={cn("w-3.5 h-3.5", s.color)} />
            </div>
            <div>
              <p className="text-base font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input placeholder="搜尋課程或講師..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 h-9 text-sm bg-background" />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="sm:w-32 h-9 text-xs bg-background"><SelectValue placeholder="類別" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部類別</SelectItem>
            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="sm:w-28 h-9 text-xs bg-background"><SelectValue placeholder="狀態" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀態</SelectItem>
            <SelectItem value="enabled">啟用</SelectItem>
            <SelectItem value="disabled">停用</SelectItem>
          </SelectContent>
        </Select>
        <Button size="sm" className="btn-gradient-primary gap-1.5 h-9 text-xs" onClick={openCreate}>
          <Plus className="w-3.5 h-3.5" />
          新增課程
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>課程名稱</th>
                <th>類別</th>
                <th>時數</th>
                <th className="hidden md:table-cell">講師</th>
                <th className="hidden lg:table-cell">日期</th>
                <th className="hidden lg:table-cell">地點</th>
                <th className="min-w-[130px]">報名進度</th>
                <th>狀態</th>
                <th className="text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((course, index) => (
                <tr key={course.id} className="opacity-0 animate-fade-in" style={{ animationDelay: `${0.1 + index * 0.03}s` }}>
                  <td className="font-medium text-foreground text-sm max-w-[180px]">
                    <div className="truncate">{course.name}</div>
                    {course.description && (
                      <div className="text-[10px] text-muted-foreground truncate mt-0.5">{course.description}</div>
                    )}
                  </td>
                  <td>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                      {course.category}
                    </span>
                  </td>
                  <td className="text-sm">{course.hours}h</td>
                  <td className="hidden md:table-cell text-sm text-muted-foreground">{course.instructor}</td>
                  <td className="hidden lg:table-cell text-xs text-muted-foreground">{course.date}</td>
                  <td className="hidden lg:table-cell text-xs text-muted-foreground">{course.location}</td>
                  <td>
                    {(() => {
                      const pct = Math.round((course.enrolled / course.capacity) * 100);
                      const isFull = course.enrolled >= course.capacity;
                      return (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className={cn("font-semibold", isFull ? "text-[hsl(var(--warning))]" : "text-foreground")}>
                              {course.enrolled}/{course.capacity}
                            </span>
                            <span className="text-muted-foreground">
                              {isFull ? '額滿' : `剩 ${course.capacity - course.enrolled}`}
                            </span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                isFull ? "bg-[hsl(var(--warning))]" : pct >= 80 ? "bg-accent" : "bg-primary"
                              )}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                  <td>
                    <span className={cn(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                      course.enabled ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-destructive/10 text-destructive"
                    )}>
                      {course.enabled ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-0.5">
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(course)}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleToggle(course)}>
                        <span className={cn("text-[10px] font-medium", course.enabled ? "text-destructive" : "text-[hsl(var(--success))]")}>
                          {course.enabled ? '停' : '啟'}
                        </span>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(course)}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-sm text-muted-foreground">沒有符合條件的課程</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">共 {filtered.length} 筆課程（模擬資料）</p>

      {/* Enrollment Trend Chart */}
      <div className="mt-4">
        <EnrollmentTrendChart courses={courses} />
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" />
              {editingCourse ? '編輯課程' : '新增課程'}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label className="text-xs">課程名稱 *</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="例：一般工安教育訓練" className="h-9 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">類別</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">時數</Label>
                <Input type="number" min={1} value={form.hours} onChange={e => setForm(f => ({ ...f, hours: +e.target.value }))} className="h-9 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">講師 *</Label>
                <Input value={form.instructor} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} placeholder="講師姓名" className="h-9 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">上課日期</Label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="h-9 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label className="text-xs">地點</Label>
                <Input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="上課地點" className="h-9 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-xs">人數上限</Label>
                <Input type="number" min={1} value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: +e.target.value }))} className="h-9 text-sm" />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label className="text-xs">課程描述</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="課程內容簡述..." className="text-sm min-h-[60px]" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label className="text-xs font-medium">啟用狀態</Label>
                <p className="text-[10px] text-muted-foreground">停用後員工將無法報名此課程</p>
              </div>
              <Switch checked={form.enabled} onCheckedChange={v => setForm(f => ({ ...f, enabled: v }))} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button size="sm" className="btn-gradient-primary" onClick={handleSave}>
              {editingCourse ? '儲存變更' : '新增課程'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </StepCard>
  );
}

import { useState } from 'react';
import { StepCard } from '@/components/ui/StepCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CourseManagement } from '@/components/CourseManagement';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, UserX, Edit2, Shield, Users, Activity, BarChart3, Workflow, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MermaidDiagram,
  designArchitectureChart,
  adminFlowChart,
  systemOverviewChart,
} from '@/components/MermaidDiagram';

interface MockUser {
  id: string;
  name: string;
  email: string;
  department: string;
  role: '員工' | '主管' | '上傳管理員';
  status: '啟用' | '停用';
  lastLogin: string;
}

const mockUsers: MockUser[] = [
  { id: '1', name: '王小明', email: 'wang@example.com', department: '人資課', role: '員工', status: '啟用', lastLogin: '2024-03-07' },
  { id: '2', name: '李美玲', email: 'li@example.com', department: '工安組', role: '主管', status: '啟用', lastLogin: '2024-03-08' },
  { id: '3', name: '張大偉', email: 'zhang@example.com', department: '工務組', role: '員工', status: '啟用', lastLogin: '2024-03-06' },
  { id: '4', name: '陳淑芬', email: 'chen@example.com', department: '規劃組', role: '主管', status: '啟用', lastLogin: '2024-03-08' },
  { id: '5', name: '林志豪', email: 'lin@example.com', department: '檢驗組', role: '員工', status: '停用', lastLogin: '2024-02-20' },
  { id: '6', name: '黃雅琪', email: 'huang@example.com', department: '土木隊', role: '上傳管理員', status: '啟用', lastLogin: '2024-03-07' },
  { id: '7', name: '吳建宏', email: 'wu@example.com', department: '建築隊', role: '員工', status: '啟用', lastLogin: '2024-03-05' },
  { id: '8', name: '周怡君', email: 'zhou@example.com', department: '電氣隊', role: '主管', status: '啟用', lastLogin: '2024-03-08' },
];

const stats = [
  { label: '總帳號數', value: 8, icon: Users, color: 'text-primary' },
  { label: '啟用中', value: 7, icon: Activity, color: 'text-[hsl(var(--success))]' },
  { label: '主管帳號', value: 3, icon: Shield, color: 'text-accent' },
  { label: '停用帳號', value: 1, icon: UserX, color: 'text-destructive' },
];

export function AdminSection() {
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const departments = [...new Set(mockUsers.map(u => u.department))];

  const filtered = mockUsers.filter(u => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchDept = filterDept === 'all' || u.department === filterDept;
    const matchRole = filterRole === 'all' || u.role === filterRole;
    const matchStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchSearch && matchDept && matchRole && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted/50">
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Management */}
      <StepCard step={1} title="使用者帳號管理">
        <p className="text-xs text-muted-foreground mb-3">
          新增、編輯或停用系統使用者帳號，並指派對應角色權限。
        </p>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="搜尋姓名或 Email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-9 text-sm bg-background"
            />
          </div>
          <Select value={filterDept} onValueChange={setFilterDept}>
            <SelectTrigger className="sm:w-32 h-9 text-xs bg-background">
              <SelectValue placeholder="部門" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部部門</SelectItem>
              {departments.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterRole} onValueChange={setFilterRole}>
            <SelectTrigger className="sm:w-32 h-9 text-xs bg-background">
              <SelectValue placeholder="角色" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部角色</SelectItem>
              <SelectItem value="員工">員工</SelectItem>
              <SelectItem value="主管">主管</SelectItem>
              <SelectItem value="上傳管理員">上傳管理員</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="sm:w-28 h-9 text-xs bg-background">
              <SelectValue placeholder="狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部狀態</SelectItem>
              <SelectItem value="啟用">啟用</SelectItem>
              <SelectItem value="停用">停用</SelectItem>
            </SelectContent>
          </Select>
          <Button size="sm" className="btn-gradient-primary gap-1.5 h-9 text-xs">
            <UserPlus className="w-3.5 h-3.5" />
            新增帳號
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>
                  <th>姓名</th>
                  <th>Email</th>
                  <th>部門</th>
                  <th>角色</th>
                  <th>狀態</th>
                  <th>最後登入</th>
                  <th className="text-right">操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, index) => (
                  <tr
                    key={user.id}
                    className="opacity-0 animate-fade-in"
                    style={{ animationDelay: `${0.1 + index * 0.03}s` }}
                  >
                    <td className="font-medium text-foreground text-sm">{user.name}</td>
                    <td className="text-xs text-muted-foreground">{user.email}</td>
                    <td className="text-sm">{user.department}</td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium",
                        user.role === '主管' && "bg-accent/10 text-accent",
                        user.role === '員工' && "bg-primary/10 text-primary",
                        user.role === '上傳管理員' && "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
                      )}>
                        {user.role === '主管' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium",
                        user.status === '啟用' ? "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]" : "bg-destructive/10 text-destructive"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="text-xs text-muted-foreground">{user.lastLogin}</td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                          <UserX className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-sm text-muted-foreground">
                      沒有符合條件的使用者
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground mt-2">
          共 {filtered.length} 筆結果（模擬資料）
        </p>
      </StepCard>

      {/* Course Management */}
      <CourseManagement />
    </div>
  );
}

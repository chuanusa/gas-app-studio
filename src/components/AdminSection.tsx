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
import { Search, UserPlus, UserX, Edit2, Shield, Users, Activity, BarChart3, Workflow, Settings, FileText, BookOpen, Target, Palette, Lock, Zap, TestTube, Rocket, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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

      {/* Flowcharts */}
      <StepCard step={3} title="設計與操作流程圖">
        <p className="text-xs text-muted-foreground mb-3">
          檢視系統設計架構與管理員操作流程，點擊節點可查看詳細說明。
        </p>
        <Tabs defaultValue="admin-op" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="admin-op" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Workflow className="w-3.5 h-3.5" />
              管理員操作流程
            </TabsTrigger>
            <TabsTrigger value="design-arch" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-3.5 h-3.5" />
              元件架構圖
            </TabsTrigger>
            <TabsTrigger value="sys-overview" className="text-xs gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-3.5 h-3.5" />
              系統總覽
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin-op">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-primary" />
                  系統管理員操作流程
                </CardTitle>
                <CardDescription className="text-xs">帳號管理、課程設定、系統配置的完整操作流程</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={adminFlowChart} id="admin-embed-flow" compact />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="design-arch">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" />
                  系統元件架構圖
                </CardTitle>
                <CardDescription className="text-xs">展示頁面層、區塊元件、功能元件與 UI 元件的層級關係</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={designArchitectureChart} id="admin-embed-arch" compact />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sys-overview">
            <Card className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  系統整體流程
                </CardTitle>
                <CardDescription className="text-xs">不同角色進入系統後的操作路徑與最終結果</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={systemOverviewChart} id="admin-embed-overview" compact />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </StepCard>

      {/* Design Philosophy & Requirements */}
      <StepCard step={4} title="設計理念與使用需求書">
        <p className="text-xs text-muted-foreground mb-4">
          系統設計核心理念、功能需求規格與技術架構說明文件。
        </p>

        <Accordion type="multiple" className="space-y-2">
          {/* 專案概述 */}
          <AccordionItem value="overview" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Target className="w-4 h-4 text-primary" />
                專案概述與核心價值
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-1">專案名稱</h4>
                <p className="text-muted-foreground text-xs">員工工安教育訓練報名系統（Employee Safety Training Registration System）</p>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">專案目標</h4>
                <p className="text-muted-foreground text-xs">建立現代化、高效率的數位報名平台，提供完整的工安教育訓練管理流程，包含個人報名、主管確認、檔案上傳與系統管理功能。</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: '🔄', title: '數位化轉型', desc: '取代傳統紙本作業，提升作業效率' },
                  { icon: '🔐', title: '權限分級', desc: '不同角色擁有對應的功能權限' },
                  { icon: '📊', title: '即時追蹤', desc: '即時掌握報名進度與統計資料' },
                  { icon: '📦', title: '資料整合', desc: '統一的資料管理與匯出功能' },
                ].map((item) => (
                  <div key={item.title} className="p-2.5 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-sm">{item.icon}</span>
                      <span className="text-xs font-semibold text-foreground">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 角色與權限 */}
          <AccordionItem value="roles" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                使用者角色與權限
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              {[
                { role: '員工', color: 'text-primary', duties: '個人報名與資料管理', perms: ['查看個人報名狀態', '填寫報名表單', '上傳個人證書文件', '查看截止時間倒數'] },
                { role: '主管', color: 'text-accent', duties: '部門管理與人員督導', perms: ['查看部門員工報名統計', '確認/駁回部門員工報名', '查看未報名人員清單', '接收截止日期通知', '匯出部門報名資料'] },
                { role: '上傳管理員', color: 'text-[hsl(var(--success))]', duties: '檔案與文件管理', perms: ['批量上傳檔案', '檔案分類與整理', '檔案下載與管理', '查看上傳進度統計'] },
                { role: '系統管理員', color: 'text-destructive', duties: '系統維護與全域管理', perms: ['使用者帳號管理', '課程設定與管理', '系統權限設定', '全域資料統計', '課程額滿通知設定'] },
              ].map((r) => (
                <div key={r.role} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Shield className={cn("w-3.5 h-3.5", r.color)} />
                    <span className={cn("text-xs font-bold", r.color)}>{r.role}</span>
                    <span className="text-[11px] text-muted-foreground">— {r.duties}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {r.perms.map((p) => (
                      <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 bg-background rounded text-[11px] text-muted-foreground">
                        ✅ {p}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* 技術架構 */}
          <AccordionItem value="tech" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-primary" />
                技術架構與設計系統
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-xs">技術棧</h4>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    ['前端框架', 'React 18 + TypeScript'],
                    ['構建工具', 'Vite'],
                    ['UI 框架', 'Tailwind CSS + shadcn/ui'],
                    ['狀態管理', 'React Context API'],
                    ['路由管理', 'React Router DOM'],
                    ['圖表庫', 'Recharts'],
                    ['表單處理', 'React Hook Form + Zod'],
                    ['流程圖', 'Mermaid.js'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center gap-1.5 text-[11px]">
                      <span className="text-muted-foreground">{label}：</span>
                      <span className="font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-xs">專案結構</h4>
                <pre className="text-[11px] text-muted-foreground font-mono leading-relaxed">
{`src/
├── components/      # 元件庫
│   ├── ui/         # 基礎 UI 元件
│   └── feature/    # 功能性元件
├── contexts/       # 狀態管理
├── hooks/          # 自訂 Hooks
├── lib/            # 工具函數
└── pages/          # 頁面元件`}
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* UI/UX 設計 */}
          <AccordionItem value="uiux" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                UI/UX 設計準則
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              <div className="p-3 bg-muted/30 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 text-xs">色彩系統</h4>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: '主品牌藍', var: '--primary', sample: 'bg-primary' },
                    { name: '成功綠', var: '--success', sample: 'bg-[hsl(var(--success))]' },
                    { name: '警告黃', var: '--warning', sample: 'bg-[hsl(var(--warning))]' },
                    { name: '錯誤紅', var: '--destructive', sample: 'bg-destructive' },
                    { name: '強調色', var: '--accent', sample: 'bg-accent' },
                    { name: '靜音色', var: '--muted', sample: 'bg-muted' },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-2">
                      <div className={cn("w-4 h-4 rounded", c.sample)} />
                      <span className="text-[11px] text-muted-foreground">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">字型階層</h4>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p>text-xs (11px) — 輔助說明</p>
                    <p>text-sm (14px) — 內文</p>
                    <p>text-base (16px) — 標題</p>
                    <p>text-lg (18px) — 大標題</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">響應式斷點</h4>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p>📱 手機：320-767px</p>
                    <p>📟 平板：768-1023px</p>
                    <p>🖥️ 桌面：1024px+</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 功能需求 */}
          <AccordionItem value="features" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                功能需求規格
              </span>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 text-sm">
              {[
                {
                  title: '報名管理系統',
                  items: [
                    '個人報名：姓名、部門、Email、電話、課程選擇、證書上傳',
                    '表單驗證：姓名 2-10 字元、Email 格式、手機格式、檔案 ≤5MB',
                    '主管審核：核准/駁回操作、駁回原因填寫、即時通知',
                  ],
                },
                {
                  title: '課程管理系統',
                  items: [
                    '課程資訊：名稱、日期、地點、容量、講師、分類、狀態',
                    '額滿通知：閾值 50%-100%（間隔 5%）、即時檢查、Alert 顯示',
                  ],
                },
                {
                  title: '檔案管理系統',
                  items: [
                    '支援格式：PDF/DOC/DOCX (10MB)、JPG/PNG/GIF (5MB)、ZIP/RAR (50MB)',
                    '功能：批量上傳、分類整理、縮圖預覽、批量下載',
                  ],
                },
                {
                  title: '統計與報表',
                  items: [
                    '匯出格式：CSV（UTF-8 BOM 中文）、Excel',
                    '圖表類型：時間序列圖、圓餅圖、進度條',
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">{section.title}</h4>
                  <ul className="space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-[11px] text-muted-foreground flex gap-1.5">
                        <span className="text-primary mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* 安全性 */}
          <AccordionItem value="security" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                安全性要求
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { title: '資料保護', items: ['加密傳輸', '前端不儲存敏感資料', '存取日誌記錄'] },
                  { title: '權限控制', items: ['角色權限分離', '前端路由保護', 'API 端點驗證'] },
                  { title: '輸入驗證', items: ['所有輸入驗證', '防止 XSS 攻擊', '檔案類型限制'] },
                ].map((group) => (
                  <div key={group.title} className="p-2.5 bg-muted/30 rounded-lg">
                    <h4 className="font-semibold text-foreground mb-1.5 text-xs">{group.title}</h4>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item} className="text-[11px] text-muted-foreground">🛡️ {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 效能與部署 */}
          <AccordionItem value="performance" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                效能要求與部署
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">效能指標</h4>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p>⚡ 首次載入 &lt; 3 秒</p>
                    <p>⚡ 頁面切換 &lt; 500ms</p>
                    <p>⚡ 按鈕回應 &lt; 100ms</p>
                    <p>⚡ 圖片 Lazy Loading</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">部署與監控</h4>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p>🚀 Node.js 18+ / ES2020</p>
                    <p>📊 系統可用性 &gt; 99.9%</p>
                    <p>📉 錯誤率 &lt; 0.1%</p>
                    <p>💾 每日自動備份（7天保留）</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* 未來規劃 */}
          <AccordionItem value="roadmap" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline gap-2">
              <span className="flex items-center gap-2">
                <Rocket className="w-4 h-4 text-primary" />
                未來擴充規劃
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">Phase 2</h4>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p>☐ 行動裝置 APP</p>
                    <p>☐ 多語言支援</p>
                    <p>☐ 即時通知系統</p>
                    <p>☐ 進階分析儀表板</p>
                  </div>
                </div>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-1.5 text-xs">Phase 3</h4>
                  <div className="space-y-1 text-[11px] text-muted-foreground">
                    <p>☐ API 開放平台</p>
                    <p>☐ 第三方系統整合</p>
                    <p>☐ AI 智能推薦</p>
                    <p>☐ 區塊鏈憑證驗證</p>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p className="text-[11px] text-muted-foreground mt-3 text-right">
          文件版本：v1.0 ｜ 最後更新：2024-03-08
        </p>
      </StepCard>
    </div>
  );
}

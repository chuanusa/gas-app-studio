import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Workflow, Users, Settings, Upload, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MermaidDiagram,
  systemOverviewChart,
  employeeFlowChart,
  managerFlowChart,
  uploadAdminFlowChart,
  adminFlowChart,
  designArchitectureChart,
  dataFlowChart,
} from '@/components/MermaidDiagram';

export default function FlowchartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  返回首頁
                </Button>
              </Link>
              <div className="w-px h-5 bg-border" />
              <div className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                <h1 className="text-sm font-bold text-foreground">系統流程圖</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2 bg-transparent p-0">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <FileText className="w-4 h-4" />
              系統總覽
            </TabsTrigger>
            <TabsTrigger value="operations" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Users className="w-4 h-4" />
              操作流程
            </TabsTrigger>
            <TabsTrigger value="design" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Settings className="w-4 h-4" />
              設計架構
            </TabsTrigger>
            <TabsTrigger value="dataflow" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2">
              <Workflow className="w-4 h-4" />
              資料流程
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  系統整體流程
                </CardTitle>
                <CardDescription>展示不同角色進入系統後的操作路徑與最終結果</CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={systemOverviewChart} id="system-overview" />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="operations" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />員工報名流程</CardTitle>
                  <CardDescription>員工查看課程、填寫報名表單、上傳證書的完整流程</CardDescription>
                </CardHeader>
                <CardContent><MermaidDiagram chart={employeeFlowChart} id="employee-flow" /></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserCheck className="w-5 h-5" />主管審核流程</CardTitle>
                  <CardDescription>主管查看部門統計、審核報名、匯出資料的操作流程</CardDescription>
                </CardHeader>
                <CardContent><MermaidDiagram chart={managerFlowChart} id="manager-flow" /></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Upload className="w-5 h-5" />上傳管理員流程</CardTitle>
                  <CardDescription>檔案上傳、分類管理、下載與刪除的完整流程</CardDescription>
                </CardHeader>
                <CardContent><MermaidDiagram chart={uploadAdminFlowChart} id="upload-admin-flow" /></CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />系統管理員流程</CardTitle>
                  <CardDescription>帳號管理、課程設定、系統配置的操作流程</CardDescription>
                </CardHeader>
                <CardContent><MermaidDiagram chart={adminFlowChart} id="admin-flow" /></CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5" />元件架構圖</CardTitle>
                <CardDescription>展示系統的元件層級與依賴關係</CardDescription>
              </CardHeader>
              <CardContent><MermaidDiagram chart={designArchitectureChart} id="design-arch" /></CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dataflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Workflow className="w-5 h-5" />資料流程圖</CardTitle>
                <CardDescription>展示使用者操作到資料庫的完整資料流動過程</CardDescription>
              </CardHeader>
              <CardContent><MermaidDiagram chart={dataFlowChart} id="data-flow" /></CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

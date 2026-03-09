import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Workflow, Users, Settings, Upload, UserCheck } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import mermaid from 'mermaid';

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose',
  fontFamily: 'system-ui, sans-serif',
});

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    };
    renderChart();
  }, [chart, id]);

  return (
    <div
      ref={containerRef}
      className="overflow-auto p-4 bg-muted/30 rounded-lg"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// 流程圖定義
const systemOverviewChart = `
graph TD
    A[使用者登入系統] --> B{角色判定}
    B -->|員工| C[員工操作流程]
    B -->|主管| D[主管操作流程]
    B -->|上傳管理員| E[檔案管理流程]
    B -->|系統管理員| F[系統管理流程]
    C --> G[報名完成]
    D --> H[審核完成]
    E --> I[檔案歸檔]
    F --> J[系統設定完成]
`;

const employeeFlowChart = `
flowchart TD
    Start([進入系統]) --> View[查看可報名課程]
    View --> Check{是否已報名?}
    Check -->|是| Status[查看報名狀態]
    Check -->|否| Fill[填寫報名表單]
    Fill --> Validate{表單驗證}
    Validate -->|失敗| Error[顯示錯誤訊息]
    Error --> Fill
    Validate -->|通過| Upload{是否需上傳證書?}
    Upload -->|是| UploadFile[上傳證書檔案]
    Upload -->|否| Submit[送出報名]
    UploadFile --> FileCheck{檔案驗證}
    FileCheck -->|格式錯誤| FileError[提示檔案格式]
    FileError --> UploadFile
    FileCheck -->|通過| Submit
    Submit --> Confirm[顯示報名成功]
    Confirm --> Wait[等待主管審核]
    Wait --> Result{審核結果}
    Result -->|通過| Done([報名完成])
    Result -->|駁回| Reason[查看駁回原因]
    Reason --> Fill
    Status --> End([結束])
`;

const managerFlowChart = `
flowchart TD
    Start([進入主管頁面]) --> Notify{截止日通知?}
    Notify -->|是| ViewNotify[查看未報名名單]
    Notify -->|否| Dashboard[查看部門統計]
    ViewNotify --> Dashboard
    Dashboard --> List[查看部門報名清單]
    List --> Select[選取報名紀錄]
    Select --> Review[檢視報名詳情]
    Review --> Action{審核動作}
    Action -->|核准| Approve[確認核准]
    Action -->|駁回| RejectForm[填寫駁回原因]
    RejectForm --> Reject[確認駁回]
    Approve --> UpdateStatus[更新報名狀態]
    Reject --> UpdateStatus
    UpdateStatus --> NotifyEmployee[通知員工結果]
    NotifyEmployee --> More{還有待審核?}
    More -->|是| Select
    More -->|否| Export{匯出資料?}
    Export -->|是| ExportData[匯出 CSV/Excel]
    Export -->|否| End([結束])
    ExportData --> End
`;

const uploadAdminFlowChart = `
flowchart TD
    Start([進入上傳管理頁面]) --> Choose{操作選擇}
    Choose -->|上傳| SelectFiles[選擇檔案]
    Choose -->|管理| Browse[瀏覽已上傳檔案]
    SelectFiles --> DragDrop[拖曳或點選上傳]
    DragDrop --> FileValidate{檔案驗證}
    FileValidate -->|不符| ShowError[顯示錯誤]
    ShowError --> SelectFiles
    FileValidate -->|通過| Categorize[選擇分類]
    Categorize --> AddDesc[填寫說明]
    AddDesc --> UploadAction[開始上傳]
    UploadAction --> Progress[顯示上傳進度]
    Progress --> Complete{上傳完成?}
    Complete -->|成功| Success[顯示成功訊息]
    Complete -->|失敗| Retry[重試上傳]
    Retry --> UploadAction
    Success --> End([結束])
    Browse --> Filter[篩選檔案]
    Filter --> FileAction{檔案操作}
    FileAction -->|下載| Download[下載檔案]
    FileAction -->|刪除| ConfirmDel[確認刪除]
    FileAction -->|預覽| Preview[檔案預覽]
    ConfirmDel --> Delete[執行刪除]
    Download --> End
    Delete --> End
    Preview --> End
`;

const adminFlowChart = `
flowchart TD
    Start([進入管理後台]) --> Tab{功能選擇}
    Tab -->|帳號管理| UserList[使用者列表]
    Tab -->|課程管理| CourseList[課程列表]
    Tab -->|系統設定| Settings[系統設定]
    UserList --> Search[搜尋篩選使用者]
    Search --> UserAction{帳號操作}
    UserAction -->|新增| CreateForm[填寫帳號資料]
    UserAction -->|編輯| EditForm[修改帳號資料]
    UserAction -->|停用| DisableConfirm[確認停用]
    CreateForm --> AssignRole[指派角色權限]
    AssignRole --> SaveUser[儲存帳號]
    EditForm --> SaveUser
    DisableConfirm --> SaveUser
    SaveUser --> End([返回列表])
`;

const designArchitectureChart = `
graph TB
    subgraph Pages
        P1[Index]
        P2[FlowchartPage]
        P3[NotFound]
    end
    
    subgraph Sections
        S1[RegistrationSection]
        S2[ManagementSection]
        S3[UploadSection]
        S4[AdminSection]
    end
    
    subgraph Components
        C1[Header]
        C2[StatsOverview]
        C3[DepartmentTable]
        C4[CourseManagement]
    end
    
    subgraph UIComponents
        U1[Button]
        U2[Card]
        U3[Table]
        U4[Dialog]
    end
    
    P1 --> S1
    P1 --> S2
    P1 --> S3
    P1 --> S4
    S1 --> C1
    S2 --> C2
    S2 --> C3
    S4 --> C4
    C1 --> U1
    C2 --> U2
    C3 --> U3
    C4 --> U4
`;

const dataFlowChart = `
sequenceDiagram
    participant U as 使用者
    participant C as React元件
    participant CTX as Context
    participant API as API層
    participant DB as 資料庫
    
    U->>C: 操作介面
    C->>CTX: 讀取/更新狀態
    CTX-->>C: 返回狀態
    C->>API: 發送請求
    API->>DB: 資料操作
    DB-->>API: 返回結果
    API-->>C: 響應資料
    C->>C: 更新UI
    C-->>U: 顯示結果
`;

export default function FlowchartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
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

      {/* Main Content */}
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

          {/* 系統總覽 */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  系統整體流程
                </CardTitle>
                <CardDescription>
                  展示不同角色進入系統後的操作路徑與最終結果
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={systemOverviewChart} id="system-overview" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 操作流程 */}
          <TabsContent value="operations" className="space-y-6">
            <div className="grid gap-6">
              {/* 員工流程 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    員工報名流程
                  </CardTitle>
                  <CardDescription>
                    員工查看課程、填寫報名表單、上傳證書的完整流程
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={employeeFlowChart} id="employee-flow" />
                </CardContent>
              </Card>

              {/* 主管流程 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5" />
                    主管審核流程
                  </CardTitle>
                  <CardDescription>
                    主管查看部門統計、審核報名、匯出資料的操作流程
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={managerFlowChart} id="manager-flow" />
                </CardContent>
              </Card>

              {/* 上傳管理員流程 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    上傳管理員流程
                  </CardTitle>
                  <CardDescription>
                    檔案上傳、分類管理、下載與刪除的完整流程
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={uploadAdminFlowChart} id="upload-admin-flow" />
                </CardContent>
              </Card>

              {/* 系統管理員流程 */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    系統管理員流程
                  </CardTitle>
                  <CardDescription>
                    帳號管理、課程設定、系統配置的操作流程
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MermaidDiagram chart={adminFlowChart} id="admin-flow" />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 設計架構 */}
          <TabsContent value="design" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  元件架構圖
                </CardTitle>
                <CardDescription>
                  展示系統的元件層級與依賴關係
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={designArchitectureChart} id="design-arch" />
              </CardContent>
            </Card>
          </TabsContent>

          {/* 資料流程 */}
          <TabsContent value="dataflow" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Workflow className="w-5 h-5" />
                  資料流程圖
                </CardTitle>
                <CardDescription>
                  展示使用者操作到資料庫的完整資料流動過程
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MermaidDiagram chart={dataFlowChart} id="data-flow" />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

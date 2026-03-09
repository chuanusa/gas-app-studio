import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Workflow, Users, Settings, Upload, UserCheck, Download, Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import mermaid from 'mermaid';


// Node descriptions mapping
const nodeDescriptions: Record<string, { title: string; description: string }> = {
  // System Overview
  'A': { title: '使用者登入系統', description: '使用者透過帳號密碼或 SSO 進行身份驗證，系統會記錄登入時間與 IP。' },
  'B': { title: '角色判定', description: '系統根據使用者帳號所綁定的角色（員工、主管、上傳管理員、系統管理員）自動導向對應的操作介面。' },
  'C': { title: '員工操作流程', description: '員工可查看可報名課程、填寫報名表單、上傳所需證書文件。' },
  'D': { title: '主管操作流程', description: '主管可查看部門報名統計、審核員工報名申請、匯出報表資料。' },
  'E': { title: '檔案管理流程', description: '上傳管理員負責管理系統中的檔案，包含上傳、分類、下載與刪除操作。' },
  'F': { title: '系統管理流程', description: '系統管理員可進行帳號管理、課程設定、系統參數配置等進階操作。' },
  'G': { title: '報名完成', description: '員工完成報名後，系統自動發送通知給對應主管進行審核。' },
  'H': { title: '審核完成', description: '主管完成所有待審核項目後，系統更新報名狀態並通知相關員工。' },
  'I': { title: '檔案歸檔', description: '檔案上傳完成後，系統自動歸檔並建立索引，方便後續查詢。' },
  'J': { title: '系統設定完成', description: '管理員完成系統設定後，變更即時生效並記錄操作日誌。' },

  // Employee Flow
  'Start': { title: '進入系統', description: '員工透過瀏覽器進入教育訓練報名系統首頁。' },
  'View': { title: '查看可報名課程', description: '系統列出所有目前開放報名的課程，包含課程名稱、時間、地點、剩餘名額等資訊。' },
  'Check': { title: '是否已報名？', description: '系統檢查該員工是否已經報名此課程，避免重複報名。' },
  'Status': { title: '查看報名狀態', description: '顯示員工已報名課程的審核狀態：待審核、已核准、已駁回。' },
  'Fill': { title: '填寫報名表單', description: '員工需填寫個人資料、選擇課程梯次、填寫報名動機等必要欄位。' },
  'Validate': { title: '表單驗證', description: '系統驗證所有必填欄位是否完整、格式是否正確（如 Email、電話號碼等）。' },
  'Error': { title: '顯示錯誤訊息', description: '當表單驗證失敗時，系統會標記錯誤欄位並顯示具體的錯誤說明。' },
  'UploadFile': { title: '上傳證書檔案', description: '部分課程需要員工上傳相關證書或資格文件，支援 PDF、JPG、PNG 格式。' },
  'FileCheck': { title: '檔案驗證', description: '系統驗證上傳檔案的格式、大小（上限 10MB）是否符合要求。' },
  'FileError': { title: '提示檔案格式', description: '當檔案不符合規定時，提示使用者允許的檔案格式與大小限制。' },
  'Submit': { title: '送出報名', description: '所有資料驗證通過後，員工確認送出報名申請。' },
  'Confirm': { title: '顯示報名成功', description: '系統顯示報名成功訊息，包含報名編號與預計審核時間。' },
  'Wait': { title: '等待主管審核', description: '報名申請送出後，系統自動通知對應主管，員工需等待審核結果。' },
  'Result': { title: '審核結果', description: '主管完成審核後，系統通知員工審核結果（通過或駁回）。' },
  'Done': { title: '報名完成', description: '報名獲得核准，員工可查看課程詳情與上課提醒。' },
  'Reason': { title: '查看駁回原因', description: '若報名被駁回，員工可查看主管填寫的駁回理由，並可修改後重新送出。' },
  'End': { title: '結束', description: '流程結束，返回系統首頁。' },

  // Manager Flow
  'Notify': { title: '截止日通知？', description: '系統檢查是否有即將截止的課程報名，若有則顯示通知提醒主管。' },
  'ViewNotify': { title: '查看未報名名單', description: '主管可查看部門內尚未完成必修課程報名的員工名單。' },
  'Dashboard': { title: '查看部門統計', description: '顯示部門整體報名狀況的統計圖表，包含報名率、通過率等指標。' },
  'List': { title: '查看部門報名清單', description: '列出部門內所有員工的報名記錄，可依狀態、課程名稱篩選。' },
  'Select': { title: '選取報名紀錄', description: '主管從清單中選取需要審核的報名紀錄。' },
  'Review': { title: '檢視報名詳情', description: '顯示員工的報名詳細資料，包含個人資料、報名動機、上傳的證書等。' },
  'Action': { title: '審核動作', description: '主管決定對此報名進行核准或駁回操作。' },
  'Approve': { title: '確認核准', description: '主管確認核准該筆報名，系統記錄核准時間與核准人。' },
  'RejectForm': { title: '填寫駁回原因', description: '主管選擇駁回時，必須填寫駁回理由以通知員工。' },
  'Reject': { title: '確認駁回', description: '主管確認駁回操作，系統記錄駁回原因與時間。' },
  'UpdateStatus': { title: '更新報名狀態', description: '系統自動更新該筆報名的狀態為「已核准」或「已駁回」。' },
  'NotifyEmployee': { title: '通知員工結果', description: '系統透過站內通知或 Email 通知員工審核結果。' },
  'More': { title: '還有待審核？', description: '系統檢查是否還有其他待審核的報名紀錄。' },
  'Export': { title: '匯出資料？', description: '主管可選擇是否將報名資料匯出為檔案。' },
  'ExportData': { title: '匯出 CSV/Excel', description: '系統將篩選後的報名資料匯出為 CSV 或 Excel 格式供下載。' },

  // Upload Admin Flow
  'Choose': { title: '操作選擇', description: '上傳管理員選擇要執行的操作：上傳新檔案或管理已有檔案。' },
  'SelectFiles': { title: '選擇檔案', description: '從本機電腦選擇要上傳的檔案，支援多檔同時選取。' },
  'Browse': { title: '瀏覽已上傳檔案', description: '列出系統中所有已上傳的檔案，支援分類瀏覽與搜尋。' },
  'DragDrop': { title: '拖曳或點選上傳', description: '支援拖曳檔案到上傳區域，或點選按鈕選擇檔案。' },
  'FileValidate': { title: '檔案驗證', description: '驗證檔案格式、大小是否符合系統規定（支援 PDF、DOC、JPG、PNG，上限 50MB）。' },
  'ShowError': { title: '顯示錯誤', description: '顯示檔案驗證失敗的具體原因，如格式不支援或檔案過大。' },
  'Categorize': { title: '選擇分類', description: '為上傳的檔案選擇分類標籤，如：證書、教材、公告等。' },
  'AddDesc': { title: '填寫說明', description: '為檔案新增文字說明，方便後續搜尋與識別用途。' },
  'UploadAction': { title: '開始上傳', description: '確認檔案資訊後開始上傳，系統顯示上傳進度。' },
  'Progress': { title: '顯示上傳進度', description: '即時顯示上傳百分比與預估剩餘時間。' },
  'Complete': { title: '上傳完成？', description: '系統確認檔案是否成功上傳至伺服器。' },
  'Success': { title: '顯示成功訊息', description: '上傳成功後顯示檔案名稱、大小與存放位置。' },
  'Retry': { title: '重試上傳', description: '上傳失敗時可選擇重新上傳，系統會保留已填寫的分類與說明。' },
  'Filter': { title: '篩選檔案', description: '依分類、上傳日期、檔案類型等條件篩選檔案列表。' },
  'FileAction': { title: '檔案操作', description: '對選取的檔案執行操作：下載、刪除或預覽。' },
  'Download': { title: '下載檔案', description: '將選取的檔案下載到本機電腦。' },
  'ConfirmDel': { title: '確認刪除', description: '刪除前顯示確認對話框，避免誤刪重要檔案。' },
  'Preview': { title: '檔案預覽', description: '在瀏覽器中預覽檔案內容（支援 PDF 與圖片格式）。' },
  'Delete': { title: '執行刪除', description: '確認後永久刪除檔案，此操作無法復原。' },

  // Admin Flow
  'Tab': { title: '功能選擇', description: '系統管理員選擇要操作的功能模組：帳號管理、課程管理或系統設定。' },
  'UserList': { title: '使用者列表', description: '顯示系統中所有使用者帳號，包含姓名、角色、狀態等資訊。' },
  'CourseList': { title: '課程列表', description: '顯示所有課程資料，可進行新增、編輯、停用等管理操作。' },
  'Settings': { title: '系統設定', description: '配置系統參數，如報名截止提醒天數、檔案大小限制、通知設定等。' },
  'Search': { title: '搜尋篩選使用者', description: '依姓名、部門、角色等條件搜尋與篩選使用者。' },
  'UserAction': { title: '帳號操作', description: '選擇對使用者帳號執行的操作：新增、編輯或停用。' },
  'CreateForm': { title: '填寫帳號資料', description: '填寫新帳號的基本資料：姓名、Email、部門、職稱等。' },
  'EditForm': { title: '修改帳號資料', description: '修改現有帳號的資料，如更換部門、更新聯絡資訊等。' },
  'DisableConfirm': { title: '確認停用', description: '停用帳號前需確認，停用後該帳號將無法登入系統。' },
  'AssignRole': { title: '指派角色權限', description: '為帳號指派系統角色（員工、主管、上傳管理員、系統管理員），角色決定可存取的功能。' },
  'SaveUser': { title: '儲存帳號', description: '儲存帳號資料變更，系統自動記錄修改歷程。' },

  // Design Architecture
  'P1': { title: 'Index 頁面', description: '系統主頁面，整合所有功能區塊。' },
  'P2': { title: 'FlowchartPage 頁面', description: '流程圖展示頁面，使用 Mermaid 繪製互動式流程圖。' },
  'P3': { title: 'NotFound 頁面', description: '404 錯誤頁面。' },
  'S1': { title: 'RegistrationSection', description: '員工報名區塊。' },
  'S2': { title: 'ManagementSection', description: '主管管理區塊。' },
  'S3': { title: 'UploadSection', description: '檔案上傳區塊。' },
  'S4': { title: 'AdminSection', description: '系統管理區塊。' },
  'C1': { title: 'Header 元件', description: '系統頂部導覽列。' },
  'C2': { title: 'StatsOverview 元件', description: '統計概覽元件。' },
  'C3': { title: 'DepartmentTable 元件', description: '部門資料表格。' },
  'C4': { title: 'CourseManagement 元件', description: '課程管理元件。' },
  'U1': { title: 'Button 元件', description: 'UI 按鈕元件。' },
  'U2': { title: 'Card 元件', description: 'UI 卡片元件。' },
  'U3': { title: 'Table 元件', description: 'UI 表格元件。' },
  'U4': { title: 'Dialog 元件', description: 'UI 對話框元件。' },

  // Data Flow
  'U': { title: '使用者', description: '系統的終端使用者。' },
  'CTX': { title: 'Context 狀態管理', description: 'React Context 全域狀態管理。' },
  'API': { title: 'API 層', description: 'API 請求層。' },
  'DB': { title: '資料庫', description: '後端資料庫。' },
};

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<{ title: string; description: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'Noto Sans TC, system-ui, sans-serif',
      themeVariables: isDark ? {
        primaryColor: '#1a7a8a',
        primaryTextColor: '#e5e7eb',
        primaryBorderColor: '#2d8a9a',
        lineColor: '#6b7280',
        secondaryColor: '#1e293b',
        tertiaryColor: '#0f172a',
        noteBkgColor: '#1e293b',
        noteTextColor: '#e5e7eb',
      } : undefined,
    });

    const renderChart = async () => {
      try {
        const uniqueId = `${id}-${Date.now()}`;
        const { svg: rawSvg } = await mermaid.render(uniqueId, chart);
        // Chart definitions are hardcoded, not user input — safe to render directly
        setSvg(rawSvg);
      } catch (error) {
        console.error('Mermaid render error:', error);
      }
    };
    renderChart();
  }, [chart, id]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const nodeEl = target.closest('.node, .actor, [id*="flowchart-"], [id*="node"]');
    if (!nodeEl) return;

    const elId = nodeEl.id || '';
    const match = elId.match(/flowchart-(\w+)-\d+/) || elId.match(/(\w+)/);
    const textEl = nodeEl.querySelector('.nodeLabel, .label, text, span');
    const textContent = textEl?.textContent?.trim() || '';

    let nodeInfo: { title: string; description: string } | null = null;
    if (match) {
      const nodeKey = match[1];
      if (nodeDescriptions[nodeKey]) {
        nodeInfo = nodeDescriptions[nodeKey];
      }
    }
    if (!nodeInfo && textContent) {
      const found = Object.values(nodeDescriptions).find(
        (desc) => desc.title === textContent || textContent.includes(desc.title)
      );
      if (found) nodeInfo = found;
    }
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
      setDialogOpen(true);
    }
  }, []);

  const handleExportSVG = useCallback(() => {
    if (!svg) return;
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${id}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svg, id]);

  const handleExportPNG = useCallback(() => {
    if (!containerRef.current) return;
    const svgEl = containerRef.current.querySelector('svg');
    if (!svgEl) return;

    const canvas = document.createElement('canvas');
    const rect = svgEl.getBoundingClientRect();
    const scale = 2;
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);

    const data = new XMLSerializer().serializeToString(svgEl);
    const img = new window.Image();
    const svgBlob = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, rect.width, rect.height);
      URL.revokeObjectURL(url);
      const pngUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = pngUrl;
      a.download = `${id}.png`;
      a.click();
    };
    img.src = url;
  }, [id]);

  return (
    <>
      <div
        ref={containerRef}
        className="overflow-auto p-4 bg-muted/30 rounded-lg cursor-pointer [&_.node]:transition-opacity [&_.node:hover]:opacity-80"
        dangerouslySetInnerHTML={{ __html: svg }}
        onClick={handleClick}
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">
          💡 點擊節點查看詳細說明
        </p>
        <div className="flex gap-1.5">
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={handleExportSVG}>
            <Download className="w-3 h-3" />
            SVG
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={handleExportPNG}>
            <Image className="w-3 h-3" />
            PNG
          </Button>
        </div>
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              {selectedNode?.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-2">
              {selectedNode?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
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
    subgraph Pages["頁面層 Pages"]
        P1["Index 首頁"]
        P2["FlowchartPage 流程圖頁"]
        P3["NotFound 404頁面"]
    end
    subgraph Sections["區塊元件 Sections"]
        S1["RegistrationSection 員工報名區"]
        S2["ManagementSection 主管管理區"]
        S3["UploadSection 檔案上傳區"]
        S4["AdminSection 系統管理區"]
    end
    subgraph Components["功能元件 Components"]
        C1["Header 頂部導覽列"]
        C2["StatsOverview 統計概覽"]
        C3["DepartmentTable 部門表格"]
        C4["CourseManagement 課程管理"]
    end
    subgraph UIComponents["基礎 UI 元件"]
        U1["Button 按鈕"]
        U2["Card 卡片"]
        U3["Table 表格"]
        U4["Dialog 對話框"]
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

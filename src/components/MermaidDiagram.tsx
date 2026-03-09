import { useEffect, useRef, useState, useCallback } from 'react';
import { Download, Image, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
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
export const nodeDescriptions: Record<string, { title: string; description: string }> = {
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
  'Choose': { title: '操作選擇', description: '上傳管理員選擇要執行的操作：上傳新檔案或管理已有檔案。' },
  'SelectFiles': { title: '選擇檔案', description: '從本機電腦選擇要上傳的檔案，支援多檔同時選取。' },
  'Browse': { title: '瀏覽已上傳檔案', description: '列出系統中所有已上傳的檔案，支援分類瀏覽與搜尋。' },
  'DragDrop': { title: '拖曳或點選上傳', description: '支援拖曳檔案到上傳區域，或點選按鈕選擇檔案。' },
  'FileValidate': { title: '檔案驗證', description: '驗證檔案格式、大小是否符合系統規定。' },
  'ShowError': { title: '顯示錯誤', description: '顯示檔案驗證失敗的具體原因。' },
  'Categorize': { title: '選擇分類', description: '為上傳的檔案選擇分類標籤。' },
  'AddDesc': { title: '填寫說明', description: '為檔案新增文字說明。' },
  'UploadAction': { title: '開始上傳', description: '確認檔案資訊後開始上傳。' },
  'Progress': { title: '顯示上傳進度', description: '即時顯示上傳百分比與預估剩餘時間。' },
  'Complete': { title: '上傳完成？', description: '系統確認檔案是否成功上傳。' },
  'Success': { title: '顯示成功訊息', description: '上傳成功後顯示檔案資訊。' },
  'Retry': { title: '重試上傳', description: '上傳失敗時可重新上傳。' },
  'Filter': { title: '篩選檔案', description: '依條件篩選檔案列表。' },
  'FileAction': { title: '檔案操作', description: '對檔案執行下載、刪除或預覽。' },
  'Download': { title: '下載檔案', description: '下載選取的檔案。' },
  'ConfirmDel': { title: '確認刪除', description: '刪除前顯示確認對話框。' },
  'Preview': { title: '檔案預覽', description: '在瀏覽器中預覽檔案。' },
  'Delete': { title: '執行刪除', description: '確認後永久刪除檔案。' },
  'Tab': { title: '功能選擇', description: '選擇帳號管理、課程管理或系統設定。' },
  'UserList': { title: '使用者列表', description: '顯示所有使用者帳號。' },
  'CourseList': { title: '課程列表', description: '顯示所有課程資料。' },
  'Settings': { title: '系統設定', description: '配置系統參數。' },
  'Search': { title: '搜尋篩選使用者', description: '依條件搜尋使用者。' },
  'UserAction': { title: '帳號操作', description: '新增、編輯或停用帳號。' },
  'CreateForm': { title: '填寫帳號資料', description: '填寫新帳號的基本資料。' },
  'EditForm': { title: '修改帳號資料', description: '修改現有帳號資料。' },
  'DisableConfirm': { title: '確認停用', description: '停用帳號前需確認。' },
  'AssignRole': { title: '指派角色權限', description: '為帳號指派系統角色。' },
  'SaveUser': { title: '儲存帳號', description: '儲存帳號資料變更。' },
};

interface MermaidDiagramProps {
  chart: string;
  id: string;
  compact?: boolean;
}

export function MermaidDiagram({ chart, id, compact = false }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [selectedNode, setSelectedNode] = useState<{ title: string; description: string } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    mermaid.initialize({
      startOnLoad: false,
      theme: 'base',
      securityLevel: 'loose',
      fontFamily: 'Noto Sans TC, system-ui, sans-serif',
      flowchart: {
        curve: 'basis',
        padding: 20,
        nodeSpacing: 30,
        rankSpacing: 50,
        htmlLabels: true,
        useMaxWidth: true,
      },
      sequence: {
        mirrorActors: false,
        messageAlign: 'center',
        boxMargin: 12,
        noteMargin: 12,
        messageMargin: 40,
        actorFontWeight: '600',
      },
      themeVariables: isDark ? {
        // Dark mode palette
        primaryColor: '#1e3a5f',
        primaryTextColor: '#e2e8f0',
        primaryBorderColor: '#38bdf8',
        secondaryColor: '#1e293b',
        secondaryTextColor: '#cbd5e1',
        secondaryBorderColor: '#475569',
        tertiaryColor: '#0f172a',
        tertiaryTextColor: '#94a3b8',
        tertiaryBorderColor: '#334155',
        lineColor: '#64748b',
        textColor: '#e2e8f0',
        mainBkg: '#1e3a5f',
        nodeBorder: '#38bdf8',
        clusterBkg: '#0f172a80',
        clusterBorder: '#334155',
        titleColor: '#e2e8f0',
        edgeLabelBackground: '#1e293b',
        nodeTextColor: '#e2e8f0',
        // Sequence diagram
        actorBkg: '#1e3a5f',
        actorBorder: '#38bdf8',
        actorTextColor: '#e2e8f0',
        actorLineColor: '#475569',
        signalColor: '#94a3b8',
        signalTextColor: '#e2e8f0',
        labelBoxBkgColor: '#1e293b',
        labelBoxBorderColor: '#475569',
        labelTextColor: '#e2e8f0',
        loopTextColor: '#cbd5e1',
        noteBkgColor: '#1a2744',
        noteTextColor: '#e2e8f0',
        noteBorderColor: '#38bdf8',
        activationBkgColor: '#1e3a5f',
        activationBorderColor: '#38bdf8',
        sequenceNumberColor: '#0ea5e9',
      } : {
        // Light mode palette
        primaryColor: '#dbeafe',
        primaryTextColor: '#1e3a5f',
        primaryBorderColor: '#3b82f6',
        secondaryColor: '#f0fdf4',
        secondaryTextColor: '#166534',
        secondaryBorderColor: '#86efac',
        tertiaryColor: '#fef3c7',
        tertiaryTextColor: '#92400e',
        tertiaryBorderColor: '#fbbf24',
        lineColor: '#94a3b8',
        textColor: '#334155',
        mainBkg: '#dbeafe',
        nodeBorder: '#3b82f6',
        clusterBkg: '#f8fafc',
        clusterBorder: '#cbd5e1',
        titleColor: '#1e293b',
        edgeLabelBackground: '#ffffff',
        nodeTextColor: '#1e3a5f',
        // Sequence diagram
        actorBkg: '#dbeafe',
        actorBorder: '#3b82f6',
        actorTextColor: '#1e3a5f',
        actorLineColor: '#cbd5e1',
        signalColor: '#64748b',
        signalTextColor: '#334155',
        labelBoxBkgColor: '#f8fafc',
        labelBoxBorderColor: '#cbd5e1',
        labelTextColor: '#334155',
        loopTextColor: '#475569',
        noteBkgColor: '#eff6ff',
        noteTextColor: '#1e3a5f',
        noteBorderColor: '#3b82f6',
        activationBkgColor: '#dbeafe',
        activationBorderColor: '#3b82f6',
        sequenceNumberColor: '#3b82f6',
      },
    });

    const renderChart = async () => {
      try {
        const uniqueId = `${id}-${Date.now()}`;
        const { svg: rawSvg } = await mermaid.render(uniqueId, chart);
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

  const handleZoomIn = () => setZoom(z => Math.min(z + 0.2, 2.5));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.2, 0.4));
  const handleZoomReset = () => setZoom(1);

  return (
    <>
      <div className="relative group">
        {/* Zoom controls */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-card/90 backdrop-blur-sm border border-border/60 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomOut} title="縮小">
            <ZoomOut className="w-3.5 h-3.5" />
          </Button>
          <span className="text-xs text-muted-foreground min-w-[3rem] text-center font-mono">
            {Math.round(zoom * 100)}%
          </span>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomIn} title="放大">
            <ZoomIn className="w-3.5 h-3.5" />
          </Button>
          <div className="w-px h-4 bg-border/60" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleZoomReset} title="重設">
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Diagram container */}
        <div
          ref={containerRef}
          className="overflow-auto rounded-xl border border-border/40 bg-gradient-to-br from-muted/20 via-background to-muted/30 cursor-pointer mermaid-container"
          style={{ maxHeight: '70vh' }}
          onClick={handleClick}
        >
          <div
            className="p-6 min-w-fit transition-transform duration-200 origin-top-left"
            style={{ transform: `scale(${zoom})` }}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between mt-3 px-1">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          點擊節點查看詳細說明
        </p>
        {!compact && (
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 rounded-lg border-border/60" onClick={handleExportSVG}>
              <Download className="w-3 h-3" />
              SVG
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1.5 rounded-lg border-border/60" onClick={handleExportPNG}>
              <Image className="w-3 h-3" />
              PNG
            </Button>
          </div>
        )}
      </div>

      {/* Node detail dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md border-border/60">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2.5 text-base">
              <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow" />
              {selectedNode?.title}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed pt-3">
              {selectedNode?.description}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ─── Chart definitions with styling ────────────────────────────

export const systemOverviewChart = `
graph TD
    A["🔐 使用者登入系統"]:::startNode --> B{"🔀 角色判定"}:::decisionNode
    B -->|"👤 員工"| C["📋 員工操作流程"]:::processNode
    B -->|"👔 主管"| D["📊 主管操作流程"]:::processNode
    B -->|"📤 上傳管理員"| E["📂 檔案管理流程"]:::processNode
    B -->|"⚙️ 系統管理員"| F["🔧 系統管理流程"]:::processNode
    C --> G["✅ 報名完成"]:::successNode
    D --> H["📝 審核完成"]:::successNode
    E --> I["🗃️ 檔案歸檔"]:::successNode
    F --> J["✔️ 系統設定完成"]:::successNode

    classDef startNode fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f,font-weight:600
    classDef decisionNode fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e,font-weight:600
    classDef processNode fill:#f0fdf4,stroke:#22c55e,stroke-width:2px,color:#166534
    classDef successNode fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#065f46,font-weight:600
`;

export const employeeFlowChart = `
flowchart TD
    Start(["▶️ 進入系統"]):::startNode --> View["📃 查看可報名課程"]:::processNode
    View --> Check{"❓ 是否已報名?"}:::decisionNode
    Check -->|是| Status["ℹ️ 查看報名狀態"]:::infoNode
    Check -->|否| Fill["✏️ 填寫報名表單"]:::processNode
    Fill --> Validate{"✅ 表單驗證"}:::decisionNode
    Validate -->|失敗| Error["⚠️ 顯示錯誤訊息"]:::errorNode
    Error --> Fill
    Validate -->|通過| Upload{"❓ 是否需上傳證書?"}:::decisionNode
    Upload -->|是| UploadFile["☁️ 上傳證書檔案"]:::processNode
    Upload -->|否| Submit["📨 送出報名"]:::actionNode
    UploadFile --> FileCheck{"📄 檔案驗證"}:::decisionNode
    FileCheck -->|格式錯誤| FileError["❌ 提示檔案格式"]:::errorNode
    FileError --> UploadFile
    FileCheck -->|通過| Submit
    Submit --> Confirm["✅ 顯示報名成功"]:::successNode
    Confirm --> Wait["⏳ 等待主管審核"]:::waitNode
    Wait --> Result{"⚖️ 審核結果"}:::decisionNode
    Result -->|通過| Done(["🏁 報名完成"]):::successNode
    Result -->|駁回| Reason["💬 查看駁回原因"]:::errorNode
    Reason --> Fill
    Status --> End(["🛑 結束"]):::endNode

    classDef startNode fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f,font-weight:600
    classDef processNode fill:#f0fdf4,stroke:#22c55e,stroke-width:1.5px,color:#166534
    classDef decisionNode fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e,font-weight:500
    classDef errorNode fill:#fef2f2,stroke:#ef4444,stroke-width:1.5px,color:#991b1b
    classDef successNode fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#065f46,font-weight:600
    classDef actionNode fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6,font-weight:500
    classDef waitNode fill:#faf5ff,stroke:#a855f7,stroke-width:1.5px,color:#6b21a8
    classDef infoNode fill:#eff6ff,stroke:#60a5fa,stroke-width:1.5px,color:#1d4ed8
    classDef endNode fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#475569,font-weight:600
`;

export const managerFlowChart = `
flowchart TD
    Start(["▶️ 進入主管頁面"]):::startNode --> Notify{"🔔 截止日通知?"}:::decisionNode
    Notify -->|是| ViewNotify["👥 查看未報名名單"]:::processNode
    Notify -->|否| Dashboard["📊 查看部門統計"]:::infoNode
    ViewNotify --> Dashboard
    Dashboard --> List["📋 查看部門報名清單"]:::processNode
    List --> Select["🖱️ 選取報名紀錄"]:::processNode
    Select --> Review["🔍 檢視報名詳情"]:::infoNode
    Review --> Action{"⚖️ 審核動作"}:::decisionNode
    Action -->|"✅ 核准"| Approve["👍 確認核准"]:::successNode
    Action -->|"❌ 駁回"| RejectForm["💬 填寫駁回原因"]:::errorNode
    RejectForm --> Reject["👎 確認駁回"]:::errorNode
    Approve --> UpdateStatus["🔄 更新報名狀態"]:::actionNode
    Reject --> UpdateStatus
    UpdateStatus --> NotifyEmployee["📧 通知員工結果"]:::actionNode
    NotifyEmployee --> More{"❓ 還有待審核?"}:::decisionNode
    More -->|是| Select
    More -->|否| Export{"📥 匯出資料?"}:::decisionNode
    Export -->|是| ExportData["📊 匯出 CSV/Excel"]:::processNode
    Export -->|否| End(["🛑 結束"]):::endNode
    ExportData --> End

    classDef startNode fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f,font-weight:600
    classDef processNode fill:#f0fdf4,stroke:#22c55e,stroke-width:1.5px,color:#166534
    classDef decisionNode fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e,font-weight:500
    classDef errorNode fill:#fef2f2,stroke:#ef4444,stroke-width:1.5px,color:#991b1b
    classDef successNode fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#065f46,font-weight:600
    classDef actionNode fill:#ede9fe,stroke:#8b5cf6,stroke-width:1.5px,color:#5b21b6
    classDef infoNode fill:#eff6ff,stroke:#60a5fa,stroke-width:1.5px,color:#1d4ed8
    classDef endNode fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#475569,font-weight:600
`;

export const uploadAdminFlowChart = `
flowchart TD
    Start(["▶️ 進入上傳管理頁面"]):::startNode --> Choose{"↔️ 操作選擇"}:::decisionNode
    Choose -->|"📤 上傳"| SelectFiles["📥 選擇檔案"]:::processNode
    Choose -->|"📁 管理"| Browse["📂 瀏覽已上傳檔案"]:::processNode
    SelectFiles --> DragDrop["👆 拖曳或點選上傳"]:::processNode
    DragDrop --> FileValidate{"🛡️ 檔案驗證"}:::decisionNode
    FileValidate -->|不符| ShowError["🚫 顯示錯誤"]:::errorNode
    ShowError --> SelectFiles
    FileValidate -->|通過| Categorize["🏷️ 選擇分類"]:::processNode
    Categorize --> AddDesc["✏️ 填寫說明"]:::processNode
    AddDesc --> UploadAction["☁️ 開始上傳"]:::actionNode
    UploadAction --> Progress["⏳ 顯示上傳進度"]:::waitNode
    Progress --> Complete{"✔️ 上傳完成?"}:::decisionNode
    Complete -->|成功| Success["✅ 顯示成功訊息"]:::successNode
    Complete -->|失敗| Retry["🔁 重試上傳"]:::errorNode
    Retry --> UploadAction
    Success --> End(["🛑 結束"]):::endNode
    Browse --> Filter["🔍 篩選檔案"]:::processNode
    Filter --> FileAction{"⋯ 檔案操作"}:::decisionNode
    FileAction -->|"📥 下載"| Download["💾 下載檔案"]:::processNode
    FileAction -->|"🗑️ 刪除"| ConfirmDel["⚠️ 確認刪除"]:::errorNode
    FileAction -->|"👁️ 預覽"| Preview["🔎 檔案預覽"]:::infoNode
    ConfirmDel --> Delete["🗑️ 執行刪除"]:::errorNode
    Download --> End
    Delete --> End
    Preview --> End

    classDef startNode fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f,font-weight:600
    classDef processNode fill:#f0fdf4,stroke:#22c55e,stroke-width:1.5px,color:#166534
    classDef decisionNode fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e,font-weight:500
    classDef errorNode fill:#fef2f2,stroke:#ef4444,stroke-width:1.5px,color:#991b1b
    classDef successNode fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#065f46,font-weight:600
    classDef actionNode fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6,font-weight:500
    classDef waitNode fill:#faf5ff,stroke:#a855f7,stroke-width:1.5px,color:#6b21a8
    classDef infoNode fill:#eff6ff,stroke:#60a5fa,stroke-width:1.5px,color:#1d4ed8
    classDef endNode fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#475569,font-weight:600
`;

export const adminFlowChart = `
flowchart TD
    Start(["▶️ 進入管理後台"]):::startNode --> Tab{"📱 功能選擇"}:::decisionNode
    Tab -->|"👥 帳號管理"| UserList["📇 使用者列表"]:::processNode
    Tab -->|"📚 課程管理"| CourseList["🎓 課程列表"]:::processNode
    Tab -->|"⚙️ 系統設定"| Settings["🎚️ 系統設定"]:::processNode
    UserList --> Search["🔍 搜尋篩選使用者"]:::processNode
    Search --> UserAction{"👤 帳號操作"}:::decisionNode
    UserAction -->|"➕ 新增"| CreateForm["🆕 填寫帳號資料"]:::actionNode
    UserAction -->|"✏️ 編輯"| EditForm["📝 修改帳號資料"]:::actionNode
    UserAction -->|"🚫 停用"| DisableConfirm["⚠️ 確認停用"]:::errorNode
    CreateForm --> AssignRole["🏷️ 指派角色權限"]:::processNode
    AssignRole --> SaveUser["💾 儲存帳號"]:::successNode
    EditForm --> SaveUser
    DisableConfirm --> SaveUser
    SaveUser --> End(["⬅️ 返回列表"]):::endNode

    classDef startNode fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f,font-weight:600
    classDef processNode fill:#f0fdf4,stroke:#22c55e,stroke-width:1.5px,color:#166534
    classDef decisionNode fill:#fef3c7,stroke:#f59e0b,stroke-width:2px,color:#92400e,font-weight:500
    classDef errorNode fill:#fef2f2,stroke:#ef4444,stroke-width:1.5px,color:#991b1b
    classDef successNode fill:#ecfdf5,stroke:#10b981,stroke-width:2px,color:#065f46,font-weight:600
    classDef actionNode fill:#ede9fe,stroke:#8b5cf6,stroke-width:2px,color:#5b21b6,font-weight:500
    classDef endNode fill:#f1f5f9,stroke:#94a3b8,stroke-width:2px,color:#475569,font-weight:600
`;

export const designArchitectureChart = `
graph TB
    subgraph Pages["📄 頁面層 Pages"]
        P1["🏠 Index 首頁"]:::pageNode
        P2["🔀 FlowchartPage 流程圖頁"]:::pageNode
        P3["🚫 NotFound 404頁面"]:::pageNode
    end
    subgraph Sections["🧩 區塊元件 Sections"]
        S1["📋 RegistrationSection"]:::sectionNode
        S2["📝 ManagementSection"]:::sectionNode
        S3["📤 UploadSection"]:::sectionNode
        S4["🔧 AdminSection"]:::sectionNode
    end
    subgraph Components["📦 功能元件 Components"]
        C1["☰ Header"]:::compNode
        C2["📈 StatsOverview"]:::compNode
        C3["📊 DepartmentTable"]:::compNode
        C4["📚 CourseManagement"]:::compNode
    end
    subgraph UIComponents["🎨 基礎 UI 元件"]
        U1["🔲 Button"]:::uiNode
        U2["🪪 Card"]:::uiNode
        U3["📋 Table"]:::uiNode
        U4["🪟 Dialog"]:::uiNode
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

    classDef pageNode fill:#dbeafe,stroke:#3b82f6,stroke-width:2px,color:#1e3a5f,font-weight:600
    classDef sectionNode fill:#fef3c7,stroke:#f59e0b,stroke-width:1.5px,color:#92400e
    classDef compNode fill:#f0fdf4,stroke:#22c55e,stroke-width:1.5px,color:#166534
    classDef uiNode fill:#faf5ff,stroke:#a855f7,stroke-width:1.5px,color:#6b21a8
`;

export const dataFlowChart = `
sequenceDiagram
    participant U as 👤 使用者
    participant C as 🖥️ React元件
    participant CTX as 📦 Context
    participant API as ⚙️ API層
    participant DB as 🗄️ 資料庫
    U->>C: 操作介面
    activate C
    C->>CTX: 讀取/更新狀態
    CTX-->>C: 返回狀態
    C->>API: 發送請求
    activate API
    API->>DB: 資料操作
    activate DB
    DB-->>API: 返回結果
    deactivate DB
    API-->>C: 響應資料
    deactivate API
    C->>C: 更新UI
    C-->>U: 顯示結果
    deactivate C
`;

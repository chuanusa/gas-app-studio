# 員工工安教育訓練報名系統 - 設計流程圖

## 📋 總覽

本文件描述系統的設計架構、元件關係、狀態管理與資料流。

---

## 🏗️ 系統架構

```mermaid
graph TD
    subgraph Frontend[前端應用]
        Router[React Router] --> Pages[頁面元件]
        Pages --> Components[功能元件]
        Components --> UI[UI 元件庫]
        Pages --> Contexts[狀態管理]
        Pages --> Hooks[自訂 Hooks]
    end
    subgraph Design[設計系統]
        Tokens[設計 Tokens] --> Tailwind[Tailwind CSS]
        Tailwind --> Shadcn[shadcn/ui]
        Shadcn --> CustomUI[自訂 UI 元件]
    end
    subgraph Build[建構工具]
        Vite[Vite] --> HMR[熱模組替換]
        Vite --> Bundle[打包最佳化]
    end
    Frontend --> Design
    Frontend --> Build
```

---

## 📁 專案結構設計

```mermaid
graph LR
    subgraph src[src/]
        subgraph pages[pages/]
            Index[Index.tsx]
            NotFound[NotFound.tsx]
        end
        subgraph components[components/]
            Header[Header]
            Registration[RegistrationSection]
            Department[DepartmentTable]
            Upload[UploadSection]
            Management[ManagementSection]
            Admin[AdminSection]
            Course[CourseManagement]
            Alert[CourseAlmostFullAlert]
            Countdown[CountdownTimer]
            Deadline[DeadlineNotification]
        end
        subgraph uiLib[components/ui/]
            Button[Button]
            Card[Card]
            StepCard[StepCard]
            StatusBadge[StatusBadge]
            ProgressBar[ProgressBar]
            CircularProgress[CircularProgress]
        end
        subgraph contexts[contexts/]
            RoleCtx[RoleContext]
            ThemeCtx[ThemeColorContext]
        end
    end
    Index --> Header
    Index --> Registration
    Index --> Department
    Index --> Upload
    Index --> Admin
    Index --> Countdown
```

---

## 🎨 設計 Token 架構

```mermaid
graph TD
    subgraph CSS[index.css CSS Variables]
        Primary["--primary: 210 100% 50%"]
        Secondary["--secondary: 210 40% 98%"]
        Success["--success: 120 100% 25%"]
        Warning["--warning: 38 92% 50%"]
        Destructive["--destructive: 0 84% 60%"]
        BG["--background"]
        FG["--foreground"]
        Muted["--muted"]
        Accent["--accent"]
    end
    subgraph TW[tailwind.config.ts]
        TWPrimary[primary]
        TWSecondary[secondary]
        TWAccent[accent]
        TWMuted[muted]
        TWDestructive[destructive]
    end
    subgraph Components[元件使用]
        Semantic["bg-primary / text-foreground"]
        Custom["btn-gradient-primary"]
        Status["StatusBadge variants"]
    end
    CSS --> TW
    TW --> Components
```

### 色彩對照

| Token | HSL 值 | 用途 |
|-------|--------|------|
| `--primary` | 210 100% 50% | 主品牌色、按鈕、連結 |
| `--secondary` | 210 40% 98% | 次要背景、卡片 |
| `--success` | 120 100% 25% | 成功狀態、已完成 |
| `--warning` | 38 92% 50% | 警告提示、即將截止 |
| `--destructive` | 0 84% 60% | 錯誤、刪除、駁回 |
| `--muted` | 210 40% 95% | 靜音文字、輔助資訊 |
| `--accent` | 210 40% 80% | 強調元素、主管標記 |

---

## 🔄 狀態管理設計

```mermaid
graph TD
    subgraph Global[全域狀態 Context]
        RoleCtx[RoleContext]
        ThemeCtx[ThemeColorContext]
    end
    subgraph Local[元件本地狀態]
        FormState[表單狀態]
        FilterState[篩選狀態]
        UIState[UI 互動狀態]
    end
    subgraph RoleFlow[角色切換流程]
        Switcher[RoleSwitcher] -->|setRole| RoleCtx
        RoleCtx -->|role| Index[Index.tsx]
        Index -->|條件渲染| Views[對應角色頁面]
    end
    subgraph ThemeFlow[主題切換流程]
        ThemeSwitcher[ThemeSwitcher] -->|setColor| ThemeCtx
        ThemeCtx -->|themeColor| CSS[CSS 變數更新]
    end
```

### 角色與頁面對應

```mermaid
graph LR
    Role{role 狀態} -->|employee| Emp[RegistrationSection + CountdownTimer]
    Role -->|manager| Mgr[DeadlineNotification + DepartmentTable + ManagementSection]
    Role -->|upload| Upl[UploadSection + CountdownTimer]
    Role -->|admin| Adm[AdminSection + CourseManagement]
```

---

## 📦 元件設計規範

### 元件層級結構

```mermaid
graph TD
    subgraph L1[第一層: 頁面]
        Index[Index.tsx]
    end
    subgraph L2[第二層: 區塊元件]
        Header[Header]
        RegSection[RegistrationSection]
        DeptTable[DepartmentTable]
        UploadSec[UploadSection]
        AdminSec[AdminSection]
        MgmtSec[ManagementSection]
    end
    subgraph L3[第三層: 功能元件]
        CourseMgmt[CourseManagement]
        CourseAlert[CourseAlmostFullAlert]
        Countdown[CountdownTimer]
        Deadline[DeadlineNotification]
        RoleSwitch[RoleSwitcher]
        ThemeSwitch[ThemeSwitcher]
        EnrollChart[EnrollmentTrendChart]
        DeptCard[DepartmentCard]
        NavLink[NavLink]
        StatsOv[StatsOverview]
    end
    subgraph L4[第四層: UI 基礎元件]
        StepCard[StepCard]
        StatusBadge[StatusBadge]
        ProgressBar[ProgressBar]
        CircProg[CircularProgress]
        ShadcnUI[shadcn/ui 元件群]
    end
    L1 --> L2
    L2 --> L3
    L3 --> L4
```

### 元件 Props 設計原則

| 原則 | 說明 | 範例 |
|------|------|------|
| 單一職責 | 每個元件只負責一個功能 | `CountdownTimer` 只處理倒數 |
| Props 最小化 | 只傳遞必要的資料 | `deadline: Date` |
| 語義化命名 | Props 名稱反映用途 | `onThresholdChange` |
| 預設值設定 | 提供合理預設值 | `threshold = 90` |

---

## 📐 佈局設計

### 響應式網格系統

```mermaid
graph TD
    subgraph Mobile[手機 320-767px]
        M1[單欄佈局]
        M2[堆疊式卡片]
        M3[漢堡選單]
    end
    subgraph Tablet[平板 768-1023px]
        T1[雙欄佈局]
        T2[側邊欄摺疊]
        T3[簡化表格]
    end
    subgraph Desktop[桌面 1024px+]
        D1[主內容 + 側邊欄]
        D2[完整表格]
        D3[多欄統計卡]
    end
```

### 頁面佈局結構

```
+------------------------------------------+
|              Header (固定)                |
|  Logo | 導航連結 | 角色切換 | 主題切換     |
+------------------------------------------+
|                                          |
|  +----------------------------------+    |
|  |         主要內容區域              |    |
|  |                                  |    |
|  |  員工: 報名表單 + 倒數計時       |    |
|  |  主管: 統計表格 + 審核列表       |    |
|  |  上傳: 檔案管理 + 倒數計時       |    |
|  |  管理: 帳號管理 + 課程管理       |    |
|  |                                  |    |
|  +----------------------------------+    |
|                                          |
+------------------------------------------+
|              Footer (版權宣告)            |
+------------------------------------------+
```

---

## 📊 資料流設計

### 報名資料流

```mermaid
sequenceDiagram
    participant E as 員工
    participant F as 報名表單
    participant V as 表單驗證
    participant S as 狀態管理
    participant M as 主管介面

    E->>F: 填寫報名資料
    F->>V: 觸發即時驗證
    V-->>F: 回傳驗證結果
    F->>S: 送出報名資料
    S-->>E: 顯示報名成功
    S->>M: 更新待審清單
    M->>S: 審核結果
    S-->>E: 通知審核結果
```

### 課程額滿通知流

```mermaid
sequenceDiagram
    participant E as 員工報名
    participant C as 課程資料
    participant T as 閾值檢查
    participant A as 管理員介面

    E->>C: 新增報名
    C->>T: 計算報名率
    T->>T: 比對閾值設定
    alt 達到閾值
        T->>A: 觸發額滿提醒
        A-->>A: 顯示 Alert 橫幅
    else 未達閾值
        T-->>C: 繼續接受報名
    end
```

---

## 🧩 設計模式

### 1. 複合元件模式 (Compound Components)

```tsx
// StepCard 包裹內容
<StepCard step={1} title="報名資訊">
  <FormFields />
  <SubmitButton />
</StepCard>
```

### 2. 受控元件模式 (Controlled Components)

```tsx
// 父元件控制狀態
const [threshold, setThreshold] = useState(90);
<CourseAlmostFullAlert
  threshold={threshold}
  onThresholdChange={setThreshold}
/>
```

### 3. 條件渲染模式 (Conditional Rendering)

```tsx
// 根據角色渲染不同介面
{role === 'employee' && <RegistrationSection />}
{role === 'manager' && <DepartmentTable />}
{role === 'admin' && <AdminSection />}
```

---

## 🎯 效能最佳化策略

```mermaid
graph TD
    subgraph Rendering[渲染最佳化]
        Memo[React.memo]
        Callback[useCallback]
        UseMemo[useMemo]
    end
    subgraph Loading[載入最佳化]
        Lazy[React.lazy]
        Suspense[Suspense]
        LazyImg[圖片 Lazy Loading]
    end
    subgraph Bundle[打包最佳化]
        Split[Code Splitting]
        Tree[Tree Shaking]
        Compress[壓縮]
    end
    Rendering --> Performance[效能目標]
    Loading --> Performance
    Bundle --> Performance
    Performance --> Target["FCP < 1.5s / TTI < 3s"]
```

---

## 🔮 未來擴充設計

```mermaid
graph LR
    subgraph Phase1[Phase 1 - 現有]
        FE[前端 SPA]
        Mock[Mock 資料]
    end
    subgraph Phase2[Phase 2 - 後端整合]
        API[REST API]
        DB[PostgreSQL]
        Auth[認證系統]
    end
    subgraph Phase3[Phase 3 - 進階功能]
        RT[即時通知]
        Analytics[進階分析]
        Mobile[行動 APP]
    end
    Phase1 --> Phase2 --> Phase3
```

---

*文件版本：v1.0 ｜ 最後更新：2024-03-08*

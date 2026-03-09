# 員工工安教育訓練報名系統 - 操作流程圖

## 📋 總覽

本文件描述系統各角色的操作流程與互動關係。

---

## 🔄 系統整體流程

```mermaid
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
```

---

## 👤 員工操作流程

### 1. 報名流程

```mermaid
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
```

### 2. 表單驗證規則

| 欄位 | 規則 | 錯誤提示 |
|------|------|----------|
| 姓名 | 必填，2-10 字元 | 請輸入有效姓名 |
| Email | 必填，有效格式 | 請輸入有效 Email |
| 電話 | 必填，手機格式 | 請輸入有效手機號碼 |
| 部門 | 必填，下拉選取 | 請選擇所屬部門 |
| 課程 | 必填，下拉選取 | 請選擇報名課程 |
| 檔案 | 選填，PDF/JPG/PNG，≤5MB | 檔案格式或大小不符 |

---

## 👔 主管操作流程

### 1. 審核流程

```mermaid
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
```

### 2. 截止日通知觸發條件

| 條件 | 動作 |
|------|------|
| 距截止日 ≤ 3 天 | 顯示黃色警告通知 |
| 距截止日 ≤ 1 天 | 顯示紅色緊急通知 |
| 部門未報名率 > 30% | 額外顯示未報名人員清單 |

---

## 📁 上傳管理員操作流程

### 1. 檔案管理流程

```mermaid
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
    AddDesc --> Upload[開始上傳]
    Upload --> Progress[顯示上傳進度]
    Progress --> Complete{上傳完成?}
    Complete -->|成功| Success[顯示成功訊息]
    Complete -->|失敗| Retry[重試上傳]
    Retry --> Upload
    Success --> End([結束])
    Browse --> Filter[篩選檔案]
    Filter --> Action{檔案操作}
    Action -->|下載| Download[下載檔案]
    Action -->|刪除| ConfirmDel[確認刪除]
    Action -->|預覽| Preview[檔案預覽]
    ConfirmDel --> Delete[執行刪除]
    Download --> End
    Delete --> End
    Preview --> End
```

### 2. 支援檔案格式

| 類型 | 格式 | 大小限制 |
|------|------|----------|
| 文件 | PDF, DOC, DOCX | 10MB |
| 圖片 | JPG, PNG, GIF | 5MB |
| 壓縮檔 | ZIP, RAR | 50MB |

---

## ⚙️ 系統管理員操作流程

### 1. 帳號管理流程

```mermaid
flowchart TD
    Start([進入管理後台]) --> Tab{功能選擇}
    Tab -->|帳號管理| UserList[使用者列表]
    Tab -->|課程管理| CourseList[課程列表]
    Tab -->|系統設定| Settings[系統設定]
    UserList --> Search[搜尋/篩選使用者]
    Search --> UserAction{帳號操作}
    UserAction -->|新增| CreateForm[填寫帳號資料]
    UserAction -->|編輯| EditForm[修改帳號資料]
    UserAction -->|停用| DisableConfirm[確認停用]
    CreateForm --> AssignRole[指派角色權限]
    AssignRole --> SaveUser[儲存帳號]
    EditForm --> SaveUser
    DisableConfirm --> SaveUser
    SaveUser --> End([返回列表])
```

### 2. 課程管理流程

```mermaid
flowchart TD
    Start([課程管理]) --> Action{操作選擇}
    Action -->|新增課程| Create[填寫課程資訊]
    Action -->|編輯課程| Edit[修改課程資訊]
    Action -->|額滿設定| Threshold[設定通知閾值]
    Create --> SetInfo[設定名稱/日期/地點/人數]
    SetInfo --> SetInstructor[設定講師]
    SetInstructor --> Publish{發佈?}
    Publish -->|草稿| SaveDraft[儲存草稿]
    Publish -->|發佈| PublishCourse[發佈課程]
    Edit --> SetInfo
    Threshold --> SliderSet[調整閾值百分比]
    SliderSet --> Preview[預覽觸發效果]
    Preview --> SaveThreshold[儲存設定]
    SaveDraft --> End([返回列表])
    PublishCourse --> End
    SaveThreshold --> End
```

### 3. 閾值通知流程

```mermaid
flowchart TD
    Enroll[員工報名] --> CalcRate[計算報名率]
    CalcRate --> CheckThreshold{達到閾值?}
    CheckThreshold -->|否| Wait[繼續等待]
    CheckThreshold -->|是| Alert[觸發額滿提醒]
    Alert --> ShowBanner[顯示警告橫幅]
    ShowBanner --> AdminView[管理員查看]
    AdminView --> Decision{處理方式}
    Decision -->|增加名額| Expand[擴充課程容量]
    Decision -->|關閉報名| Close[關閉報名入口]
    Decision -->|忽略| Dismiss[關閉提醒]
    Expand --> CalcRate
    Close --> End([結束])
    Dismiss --> End
```

---

## 🔐 權限控制流程

```mermaid
flowchart TD
    Request[使用者請求] --> Auth{已登入?}
    Auth -->|否| Login[導向登入頁]
    Auth -->|是| RoleCheck{角色驗證}
    RoleCheck -->|無權限| Deny[顯示 403 頁面]
    RoleCheck -->|有權限| Route[載入對應頁面]
    Route --> ActionCheck{操作權限檢查}
    ActionCheck -->|允許| Execute[執行操作]
    ActionCheck -->|拒絕| ActionDeny[提示權限不足]
```

### 權限對照表

| 功能 | 員工 | 主管 | 上傳管理員 | 系統管理員 |
|------|:----:|:----:|:----------:|:----------:|
| 個人報名 | ✅ | ❌ | ❌ | ❌ |
| 查看部門統計 | ❌ | ✅ | ❌ | ✅ |
| 審核報名 | ❌ | ✅ | ❌ | ✅ |
| 檔案上傳管理 | ❌ | ❌ | ✅ | ✅ |
| 帳號管理 | ❌ | ❌ | ❌ | ✅ |
| 課程管理 | ❌ | ❌ | ❌ | ✅ |
| 匯出資料 | ❌ | ✅ | ✅ | ✅ |
| 系統設定 | ❌ | ❌ | ❌ | ✅ |

---

## 📊 資料匯出流程

```mermaid
flowchart TD
    Start([選擇匯出]) --> Format{選擇格式}
    Format -->|CSV| SetCSV[設定 UTF-8 BOM 編碼]
    Format -->|Excel| SetExcel[設定 Excel 格式]
    SetCSV --> Filter[篩選匯出範圍]
    SetExcel --> Filter
    Filter --> Generate[產生檔案]
    Generate --> Download[瀏覽器下載]
    Download --> End([完成])
```

---

*文件版本：v1.0 ｜ 最後更新：2024-03-08*

# 員工工安教育訓練報名系統 - 設計準則與需求書

## 📋 專案概述

### 專案名稱
員工工安教育訓練報名系統（Employee Safety Training Registration System）

### 專案目標
建立一個現代化、高效率的數位報名平台，提供完整的工安教育訓練管理流程，包含個人報名、主管確認、檔案上傳與系統管理功能。

### 核心價值
- **數位化轉型**：取代傳統紙本作業，提升作業效率
- **權限分級**：不同角色擁有對應的功能權限
- **即時追蹤**：即時掌握報名進度與統計資料
- **資料整合**：統一的資料管理與匯出功能

## 🎯 系統架構

### 技術棧
- **前端框架**：React 18 + TypeScript
- **構建工具**：Vite
- **UI 框架**：Tailwind CSS + shadcn/ui
- **狀態管理**：React Context API
- **路由管理**：React Router DOM
- **圖表庫**：Recharts
- **表單處理**：React Hook Form + Zod
- **動畫效果**：Tailwind CSS Animations

### 設計系統架構
```
src/
├── components/          # 元件庫
│   ├── ui/             # 基礎 UI 元件
│   └── feature/        # 功能性元件
├── contexts/           # 狀態管理
├── hooks/              # 自訂 Hooks
├── lib/                # 工具函數
└── pages/              # 頁面元件
```

## 👥 使用者角色與權限

### 1. 員工 (Employee)
**主要職責**：個人報名與資料管理
- ✅ 查看個人報名狀態
- ✅ 填寫報名表單
- ✅ 上傳個人證書文件
- ✅ 查看截止時間倒數
- ❌ 無法查看其他員工資料

### 2. 主管 (Manager)
**主要職責**：部門管理與人員督導
- ✅ 查看部門員工報名統計
- ✅ 確認/駁回部門員工報名
- ✅ 查看未報名人員清單
- ✅ 接收截止日期通知
- ✅ 匯出部門報名資料
- ❌ 無法管理其他部門

### 3. 上傳管理員 (Upload Admin)
**主要職責**：檔案與文件管理
- ✅ 批量上傳檔案
- ✅ 檔案分類與整理
- ✅ 檔案下載與管理
- ✅ 查看上傳進度統計
- ❌ 無法修改使用者權限

### 4. 系統管理員 (Admin)
**主要職責**：系統維護與全域管理
- ✅ 使用者帳號管理
- ✅ 課程設定與管理
- ✅ 系統權限設定
- ✅ 全域資料統計
- ✅ 系統設定調整
- ✅ 課程額滿通知設定

## 🎨 UI/UX 設計準則

### 視覺設計原則

#### 1. 色彩系統
```css
/* 主色調 */
--primary: 210 100% 50%        /* 主品牌藍 */
--primary-foreground: 0 0% 100%

/* 輔助色調 */
--secondary: 210 40% 98%       /* 淺灰藍 */
--accent: 210 40% 80%          /* 強調色 */
--muted: 210 40% 95%           /* 靜音色 */

/* 功能色彩 */
--success: 120 100% 25%        /* 成功綠 */
--warning: 38 92% 50%          /* 警告黃 */
--destructive: 0 84% 60%       /* 錯誤紅 */
```

#### 2. 字型系統
- **標題字體**：Inter (顯示用)
- **內文字體**：system-ui (易讀性)
- **字型大小階層**：text-xs (11px) → text-sm (14px) → text-base (16px) → text-lg (18px)

#### 3. 間距系統
- **微間距**：0.5rem (8px)
- **標準間距**：1rem (16px) 
- **大間距**：1.5rem (24px)
- **區塊間距**：2rem (32px)

### 元件設計標準

#### 1. 按鈕規範
```tsx
// 主要按鈕
<Button className="btn-gradient-primary">
  主要動作
</Button>

// 次要按鈕  
<Button variant="outline">
  次要動作
</Button>

// 危險按鈕
<Button variant="destructive">
  刪除動作
</Button>
```

#### 2. 卡片元件
```tsx
<StepCard step={1} title="標題">
  <p className="text-xs text-muted-foreground mb-3">
    描述文字
  </p>
  {/* 內容區域 */}
</StepCard>
```

#### 3. 表格設計
- 使用 `table-modern` 類別
- 行間距：`py-3 px-4`
- 字型大小：標題 `text-xs`，內容 `text-sm`
- 斑馬紋：`odd:bg-muted/20`

### 響應式設計

#### 1. 斷點系統
- **手機**：320px - 767px
- **平板**：768px - 1023px  
- **桌面**：1024px+

#### 2. 網格佈局
```tsx
// 手機：1欄，平板：2欄，桌面：3欄
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// 主內容 + 側邊欄佈局
<div className="grid gap-4 lg:grid-cols-[1fr_280px]">
```

## 🛡️ 安全性要求

### 1. 資料保護
- 所有個人資料採用加密傳輸
- 敏感資料不得儲存於前端
- 實作資料存取日誌記錄

### 2. 權限控制
- 嚴格的角色權限分離
- 前端路由保護
- API 端點權限驗證

### 3. 輸入驗證
- 所有使用者輸入需進行驗證
- 防止 XSS 攻擊
- 檔案上傳類型限制

## 📊 功能需求規格

### 1. 報名管理系統

#### 1.1 個人報名功能
```typescript
interface RegistrationForm {
  employeeId: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  courseId: string;
  certificationFile?: File;
  specialRequirements?: string;
}
```

**驗證規則**：
- 姓名：必填，2-10個字元
- Email：必填，有效格式
- 電話：必填，手機格式
- 檔案：PDF/JPG/PNG，最大5MB

#### 1.2 主管確認功能
```typescript
interface ApprovalAction {
  registrationId: string;
  action: 'approve' | 'reject';
  comment?: string;
  timestamp: Date;
}
```

### 2. 課程管理系統

#### 2.1 課程基本資訊
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxCapacity: number;
  currentEnrollment: number;
  instructor: string;
  category: string;
  status: 'draft' | 'published' | 'full' | 'completed';
}
```

#### 2.2 報名額滿通知
- **閾值設定**：50%-100%，間隔5%
- **通知觸發**：即時檢查報名狀態
- **顯示方式**：Alert 元件 + 可關閉功能

### 3. 檔案管理系統

#### 3.1 上傳功能
```typescript
interface FileUpload {
  files: File[];
  category: string;
  description?: string;
  tags?: string[];
}
```

**支援格式**：
- 文件：PDF, DOC, DOCX
- 圖片：JPG, PNG, GIF
- 壓縮檔：ZIP, RAR

#### 3.2 檔案組織
- 按部門分類儲存
- 自動產生縮圖預覽
- 批量下載功能

### 4. 統計與報表

#### 4.1 資料匯出格式
```typescript
interface ExportData {
  format: 'csv' | 'excel';
  data: any[];
  filename: string;
  encoding: 'utf-8-bom'; // 確保中文顯示
}
```

#### 4.2 統計圖表
- 報名趨勢：時間序列圖
- 部門分佈：圓餅圖
- 完成率：進度條
- 即時更新：每5秒重新整理

## 🎯 性能要求

### 1. 載入效能
- 首次載入時間 < 3秒
- 頁面切換延遲 < 500ms
- 圖片載入採用 lazy loading

### 2. 互動效能
- 按鈕點擊回應 < 100ms
- 表單驗證即時回饋
- 檔案上傳進度顯示

### 3. 資料處理
- 表格分頁載入（每頁50筆）
- 搜尋結果即時篩選
- 大檔案分塊上傳

## 🧪 測試策略

### 1. 單元測試
- 元件邏輯測試
- 工具函數測試
- Hook 功能測試

### 2. 整合測試
- API 整合測試
- 路由導航測試
- 權限控制測試

### 3. E2E 測試
- 完整使用者流程
- 跨瀏覽器相容性
- 行動裝置測試

## 🚀 部署與維運

### 1. 部署需求
- Node.js 18+
- 支援 ES2020
- CDN 靜態資源

### 2. 監控指標
- 系統可用性 > 99.9%
- 錯誤率 < 0.1%
- 使用者滿意度追蹤

### 3. 備份策略
- 每日自動備份
- 7天備份保留
- 災難復原計畫

## 📈 未來擴充規劃

### Phase 2 功能
- [ ] 行動裝置 APP
- [ ] 多語言支援
- [ ] 即時通知系統
- [ ] 進階分析儀表板

### Phase 3 功能  
- [ ] API 開放平台
- [ ] 第三方系統整合
- [ ] AI 智能推薦
- [ ] 區塊鏈憑證驗證

---

## 📞 聯絡資訊

**專案負責人**：系統開發團隊
**文件版本**：v1.0
**最後更新**：2024-03-08

---

*此文件遵循 MIT 授權條款，詳細內容請參考 LICENSE 檔案。*
import { Header } from '@/components/Header';
import { RegistrationSection } from '@/components/RegistrationSection';
import { DepartmentTable } from '@/components/DepartmentTable';
import { UploadSection } from '@/components/UploadSection';
import { ManagementSection } from '@/components/ManagementSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Helmet } from 'react-helmet-async';

// 設定報名截止日期為 14 天後
const DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

const Index = () => {
  return (
    <>
      <Helmet>
        <title>員工工安教育訓練報名系統 | 數位化報名平台</title>
        <meta name="description" content="現代化、高效率的員工工安教育訓練數位報名平台。提供個人報名、主管確認、檔案上傳等完整功能。" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Countdown + Department Overview */}
          <div className="grid gap-6 lg:grid-cols-[1fr_280px] mb-6">
            <DepartmentTable />
            <CountdownTimer deadline={DEADLINE} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              <RegistrationSection />
            </div>
            
            {/* Right Column */}
            <div className="space-y-6">
              <UploadSection />
            </div>
          </div>
          
          {/* Full Width Section */}
          <div className="mt-6">
            <ManagementSection />
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            © 2024 員工工安教育訓練報名系統 - 高效率數位報名平台
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

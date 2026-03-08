import { Header } from '@/components/Header';
import { RegistrationSection } from '@/components/RegistrationSection';
import { DepartmentTable } from '@/components/DepartmentTable';
import { UploadSection } from '@/components/UploadSection';
import { ManagementSection } from '@/components/ManagementSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { useRole } from '@/contexts/RoleContext';
import { Helmet } from 'react-helmet-async';

const DEADLINE = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

const Index = () => {
  const { role } = useRole();

  return (
    <>
      <Helmet>
        <title>員工工安教育訓練報名系統 | 數位化報名平台</title>
        <meta name="description" content="現代化、高效率的員工工安教育訓練數位報名平台。提供個人報名、主管確認、檔案上傳等完整功能。" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {role === 'employee' && (
            <>
              <CountdownTimer deadline={DEADLINE} />
              <div className="grid gap-5 lg:grid-cols-2 mt-5">
                <RegistrationSection />
              </div>
            </>
          )}
          {role === 'manager' && (
            <>
              <div className="grid gap-5 lg:grid-cols-[1fr_260px]">
                <DepartmentTable />
                <CountdownTimer deadline={DEADLINE} />
              </div>
              <div className="mt-5">
                <ManagementSection />
              </div>
            </>
          )}
          {role === 'upload' && (
            <>
              <CountdownTimer deadline={DEADLINE} />
              <div className="grid gap-5 mt-5">
                <UploadSection />
              </div>
            </>
          )}
        </main>
        
        <footer className="border-t border-border bg-muted/30 py-4">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
            © 2024 員工工安教育訓練報名系統
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

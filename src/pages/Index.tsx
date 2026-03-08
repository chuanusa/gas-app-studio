import { Header } from '@/components/Header';
import { RegistrationSection } from '@/components/RegistrationSection';
import { DepartmentTable } from '@/components/DepartmentTable';
import { UploadSection } from '@/components/UploadSection';
import { ManagementSection } from '@/components/ManagementSection';
import { AdminSection } from '@/components/AdminSection';
import { CountdownTimer } from '@/components/CountdownTimer';
import { DeadlineNotification } from '@/components/DeadlineNotification';
import { useRole } from '@/contexts/RoleContext';
import { Helmet } from 'react-helmet-async';

// 設定為 1.5 天後以觸發通知（demo 用途，正式環境改為實際截止日）
const DEADLINE = new Date(Date.now() + 1.5 * 24 * 60 * 60 * 1000);

const unregisteredByDept = [
  { department: '人資課', names: ['李大華', '張美玲'] },
  { department: '建築隊', names: ['建築隊員工9', '建築隊員工10', '建築隊員工11', '建築隊員工12', '建築隊員工13', '建築隊員工14', '建築隊員工15'] },
  { department: '電氣隊', names: ['電氣隊員工13', '電氣隊員工14'] },
  { department: '機械隊', names: ['機械隊員工11', '機械隊員工12', '機械隊員工13', '機械隊員工14', '機械隊員工15', '機械隊員工16', '機械隊員工17', '機械隊員工18', '機械隊員工19', '機械隊員工20', '機械隊員工21'] },
  { department: '中部隊', names: ['中部隊員工5', '中部隊員工6', '中部隊員工7', '中部隊員工8', '中部隊員工9', '中部隊員工10', '中部隊員工11', '中部隊員工12', '中部隊員工13', '中部隊員工14', '中部隊員工15', '中部隊員工16', '中部隊員工17', '中部隊員工18', '中部隊員工19', '中部隊員工20', '中部隊員工21', '中部隊員工22', '中部隊員工23', '中部隊員工24'] },
  { department: '南部隊', names: ['南部隊員工19', '南部隊員工20', '南部隊員工21', '南部隊員工22'] },
];

const Index = () => {
  const { role } = useRole();

  return (
    <>
      <Helmet>
        <title>員工工安教育訓練報名系統 | 數位化報名平台</title>
        <meta name="description" content="現代化、高效率的員工工安教育訓練數位報名平台。提供個人報名、主管確認、檔案上傳等完整功能。" />
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {role === 'employee' && (
            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <RegistrationSection />
              <CountdownTimer deadline={DEADLINE} />
            </div>
          )}
          {role === 'manager' && (
            <div className="space-y-4">
              <DeadlineNotification deadline={DEADLINE} unregisteredByDept={unregisteredByDept} />
              <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                <DepartmentTable />
                <CountdownTimer deadline={DEADLINE} />
              </div>
              <ManagementSection />
            </div>
          )}
          {role === 'upload' && (
            <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
              <UploadSection />
              <CountdownTimer deadline={DEADLINE} />
            </div>
          )}
          {role === 'admin' && (
            <AdminSection />
          )}
        </main>
        
        <footer className="border-t border-border bg-muted/30 py-3">
          <div className="max-w-6xl mx-auto px-4 text-center text-xs text-muted-foreground">
            © 2024 員工工安教育訓練報名系統
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;

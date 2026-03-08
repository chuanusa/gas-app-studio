import { GraduationCap, Shield } from 'lucide-react';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useRole } from '@/contexts/RoleContext';

export function Header() {
  const { role } = useRole();

  return (
    <header className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center justify-center gap-3 mb-4 opacity-0 animate-fade-in">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
            <Shield className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          員工工安教育訓練報名系統
        </h1>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          現代化、高效率的數位報名平台
        </p>
        
        {/* Role Switcher */}
        <div className="flex items-center justify-center gap-4 mt-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.25s' }}>
          <RoleSwitcher />
          <div className="w-px h-6 bg-border" />
          <ThemeSwitcher />
        </div>

        <div className="flex items-center justify-center gap-6 mt-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>系統運作中</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>{role === 'manager' ? '主管管理模式' : '員工報名模式'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

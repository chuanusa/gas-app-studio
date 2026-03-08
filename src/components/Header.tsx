import { Shield, GraduationCap } from 'lucide-react';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { useRole } from '@/contexts/RoleContext';

export function Header() {
  const { role } = useRole();

  return (
    <header className="relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative max-w-6xl mx-auto">
        {/* Top bar: controls */}
        <div className="flex items-center justify-between mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>系統運作中</span>
          </div>
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <div className="w-px h-5 bg-border" />
            <ThemeSwitcher />
          </div>
        </div>

        {/* Title row */}
        <div className="flex items-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20 flex-shrink-0">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              員工工安教育訓練報名系統
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-muted-foreground">現代化、高效率的數位報名平台</p>
              <span className="text-muted-foreground/40">·</span>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>{role === 'manager' ? '主管管理模式' : role === 'upload' ? '上傳管理模式' : '員工報名模式'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

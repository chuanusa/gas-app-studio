import { Shield } from 'lucide-react';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';

export function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo + Title */}
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-bold text-foreground">工安教育訓練報名</h1>
              <p className="text-[11px] text-muted-foreground hidden sm:block">數位化報名平台</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <RoleSwitcher />
            <div className="w-px h-5 bg-border hidden sm:block" />
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

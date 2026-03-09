import { useState } from 'react';
import { Shield, Workflow, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { RoleSwitcher } from '@/components/RoleSwitcher';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

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

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/flowchart">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                <Workflow className="w-3.5 h-3.5" />
                流程圖
              </Button>
            </Link>
            <RoleSwitcher />
            <div className="w-px h-5 bg-border" />
            <ThemeSwitcher />
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="切換選單"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-200 ease-in-out",
            mobileOpen ? "max-h-48 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between">
              <Link to="/flowchart" onClick={() => setMobileOpen(false)}>
                <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                  <Workflow className="w-3.5 h-3.5" />
                  流程圖
                </Button>
              </Link>
              <ThemeSwitcher />
            </div>
            <RoleSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}

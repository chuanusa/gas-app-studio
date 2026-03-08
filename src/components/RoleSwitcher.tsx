import { useRole, UserRole } from '@/contexts/RoleContext';
import { User, Shield, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

const roles: { value: UserRole; label: string; icon: typeof User }[] = [
  { value: 'employee', label: '員工', icon: User },
  { value: 'manager', label: '主管', icon: Shield },
  { value: 'upload', label: '上傳', icon: Upload },
];

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-lg border border-border/50">
      {roles.map((r) => (
        <button
          key={r.value}
          onClick={() => setRole(r.value)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
            role === r.value
              ? "bg-background shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <r.icon className="w-3.5 h-3.5" />
          {r.label}
        </button>
      ))}
    </div>
  );
}

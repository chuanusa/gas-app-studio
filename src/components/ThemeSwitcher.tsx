import { useThemeColor, themeOptions } from '@/contexts/ThemeColorContext';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
  const { color, setColor } = useThemeColor();

  return (
    <div className="flex items-center gap-1">
      {themeOptions.map((t) => (
        <button
          key={t.value}
          onClick={() => setColor(t.value)}
          title={t.label}
          className={cn(
            "w-5 h-5 rounded-full border-2 transition-all",
            color === t.value
              ? "border-foreground scale-110 shadow-sm"
              : "border-transparent hover:scale-105 opacity-70 hover:opacity-100"
          )}
          style={{ background: t.preview }}
        />
      ))}
    </div>
  );
}

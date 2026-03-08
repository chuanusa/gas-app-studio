import { useThemeColor, ThemeColor, themeOptions } from '@/contexts/ThemeColorContext';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
  const { color, setColor } = useThemeColor();

  return (
    <div className="flex items-center gap-2">
      <Palette className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-1.5">
        {themeOptions.map((t) => (
          <button
            key={t.value}
            onClick={() => setColor(t.value)}
            title={t.label}
            className={cn(
              "w-6 h-6 rounded-full border-2 transition-all",
              color === t.value
                ? "border-foreground scale-110 shadow-md"
                : "border-transparent hover:scale-105"
            )}
            style={{ background: t.preview }}
          />
        ))}
      </div>
    </div>
  );
}

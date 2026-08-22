import { useTheme, type Theme } from "@/contexts/ThemeContext";
import { Sun, Moon, Laptop } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "button" | "segmented";
  showLabel?: boolean;
}

const themeOptions: Array<{
  value: Theme;
  label: string;
  icon: typeof Sun;
  title: string;
}> = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
    title: "Light Mode",
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
    title: "Dark Mode",
  },
  {
    value: "system",
    label: "Auto",
    icon: Laptop,
    title: "System Mode",
  },
];

export function ThemeToggle({
  className = "",
  variant = "button",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Direct 1-click toggle between light and dark
  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    }
  };

  const isDark = resolvedTheme === "dark";

  if (variant === "segmented") {
    return (
      <div
        className={`inline-flex items-center rounded-xl p-1 bg-surface-muted border border-border ${className}`}
        role="radiogroup"
        aria-label="Appearance selection"
      >
        {themeOptions.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              title={opt.title}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-surface text-primary shadow-sm font-bold border border-border/80"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {showLabel && <span>{opt.label}</span>}
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Direct 1-Click Interactive Toggle Button
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Current theme: ${resolvedTheme}. Click to switch to ${isDark ? "light" : "dark"} mode.`}
      title={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      className={`group relative flex h-9 items-center justify-center gap-2 rounded-xl border border-border bg-surface px-2.5 text-text-muted shadow-sm hover:border-primary/40 hover:bg-surface-hover hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 cursor-pointer ${className}`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transform transition-transform duration-300 rotate-0 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transform transition-transform duration-300 -rotate-12 group-hover:rotate-0" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-text-primary capitalize">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

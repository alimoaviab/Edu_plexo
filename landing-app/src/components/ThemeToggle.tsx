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
        className={`inline-flex items-center rounded-full p-1 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 ${className}`}
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-sm font-bold border border-slate-200/80 dark:border-slate-700"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
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
      className={`group relative flex h-9 items-center justify-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-3 text-slate-700 dark:text-slate-300 shadow-sm hover:border-sky-500/40 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/30 transition-all duration-200 cursor-pointer backdrop-blur-md ${className}`}
    >
      <div className="relative flex h-5 w-5 items-center justify-center">
        {isDark ? (
          <Sun className="h-4 w-4 text-amber-400 transform transition-transform duration-300 rotate-0 group-hover:rotate-45" />
        ) : (
          <Moon className="h-4 w-4 text-slate-700 dark:text-slate-200 transform transition-transform duration-300 -rotate-12 group-hover:rotate-0" />
        )}
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">
          {isDark ? "Light" : "Dark"}
        </span>
      )}
    </button>
  );
}

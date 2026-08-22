import { AppIcon } from "shared/ui/AppIcon";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  iconColor?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, iconBg = "bg-primary/10", iconColor = "text-primary", trend }: StatCardProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 shadow-sm hover:shadow-md hover:border-border-strong transition-all group text-text-primary">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-muted truncate">{title}</p>
          <p className="mt-2 text-2xl font-bold text-text-primary tracking-tight">{value}</p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <AppIcon name={trend.positive ? "trending_up" : "trending_down"} size={14} className={` ${trend.positive ? "text-success" : "text-error"} `} />
              <span className={`text-xs font-semibold ${trend.positive ? "text-success" : "text-error"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`h-11 w-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

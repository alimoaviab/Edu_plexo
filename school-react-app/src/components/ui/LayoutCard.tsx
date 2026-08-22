import React from "react";

interface LayoutCardProps {
  children: React.ReactNode;
  isActive?: boolean;
  isEditing?: boolean;
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export function LayoutCard({ 
  children, 
  isActive, 
  isEditing, 
  className = "", 
  onClick,
  icon,
  title,
  subtitle,
  badge,
  actions
}: LayoutCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col p-4 rounded-xl border transition-all duration-300 bg-surface hover:shadow-lg hover:-translate-y-0.5 ${
        isActive 
          ? "ring-1 ring-primary/50 border-primary/40 bg-gradient-to-b from-primary/10 to-surface shadow-sm" 
          : "border-border shadow-sm hover:border-border-strong"
      } ${isEditing ? "border-primary bg-primary/5" : ""} ${className}`}
    >
      {/* Top Section */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {icon && (
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:scale-105 ${
              isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-surface-muted text-text-muted"
            }`}>
              {icon}
            </div>
          )}
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-text-primary tracking-tight leading-none truncate group-hover:text-primary transition-colors">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && (
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-1 transition-opacity">
            {actions}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

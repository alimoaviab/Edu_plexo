import { ReactNode } from "react";
import { AppIcon } from "shared/ui/AppIcon";
import { Drawer } from "./Drawer";

interface DetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  width?: string;
}

export function DetailsPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  width = "max-w-xl",
}: DetailsPanelProps) {
  return (
    <Drawer isOpen={isOpen} onClose={onClose} width={width}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <AppIcon name="Badge" size={20} />
          </div>
          <div>
            <h2 className="text-md font-black text-slate-800 tracking-tight leading-none">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="h-9 w-9 rounded-xl border border-slate-200/80 bg-white text-slate-400 hover:text-slate-700 hover:bg-slate-50 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm"
          aria-label="Close panel"
        >
          <AppIcon name="X" size={18} />
        </button>
      </div>

      {/* Body Content */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        {children}
      </div>
    </Drawer>
  );
}

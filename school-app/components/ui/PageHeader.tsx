import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: string;
}

export function PageHeader({ title, description, actions, eyebrow }: PageHeaderProps) {
  return (
    <div className="mb-3 flex flex-col gap-2.5 md:flex-row md:items-center md:justify-between">
      <div>
        {eyebrow && (
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-blue-700">
            {eyebrow}
          </span>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">{title}</h1>
        {description && <p className="mt-1 max-w-2xl text-sm leading-5 text-slate-600">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 md:pt-0.5">{actions}</div>}
    </div>
  );
}

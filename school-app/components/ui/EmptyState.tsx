import { ReactNode } from "react";
import Link from "next/link";
import { Card } from "./Card";
import { Button } from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick?: () => void;
    href?: string;
  };
  icon?: ReactNode | string;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
  const iconContent = typeof icon === "string" ? (
    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
      <span className="material-symbols-outlined text-3xl">{icon}</span>
    </div>
  ) : icon ? (
    <div className="mb-5 text-blue-600">{icon}</div>
  ) : null;

  return (
    <Card className="flex flex-col items-center justify-center border-dashed border-2 px-4 py-8 text-center md:px-6">
      {iconContent}
      <h3 className="text-lg font-semibold tracking-tight text-slate-950">{title}</h3>
      <p className="mx-auto mb-6 mt-2 max-w-sm text-sm leading-6 text-slate-500">{description}</p>
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/15 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              {action.label}
            </Link>
          ) : (
            <Button onClick={action.onClick} variant="primary">
              <span className="material-symbols-outlined text-lg">add</span>
              {action.label}
            </Button>
          )}
        </>
      )}
    </Card>
  );
}

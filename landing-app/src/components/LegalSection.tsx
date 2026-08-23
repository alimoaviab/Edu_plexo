/**
 * Typography primitives used by the legal pages so all three (Privacy,
 * Terms, Cookies) read with consistent rhythm and spacing.
 */

import type { ReactNode } from 'react';

interface LegalSectionProps {
  number?: string | number;
  title: string;
  children: ReactNode;
}

export function LegalSection({ number, title, children }: LegalSectionProps) {
  return (
    <section className="border-t border-slate-200/60 dark:border-slate-800 py-10 first:border-t-0 first:pt-0">
      <div className="flex items-baseline gap-3 mb-4">
        {number != null ? (
          <span className="text-xs font-bold text-blue-600 dark:text-sky-400 tracking-widest">
            {String(number).padStart(2, '0')}
          </span>
        ) : null}
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
      </div>
      <div className="prose-legal text-slate-600 dark:text-slate-300 leading-relaxed text-[15px] space-y-4">
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 list-disc pl-5 marker:text-blue-500 dark:marker:text-sky-400 text-slate-600 dark:text-slate-300">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

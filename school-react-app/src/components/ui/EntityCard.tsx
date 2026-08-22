import { AppIcon } from "shared/ui/AppIcon";
/**
 * Universal entity card — the single card design used by every list page
 * (Classes, Teachers, Students, Tests, Exams, Homework, Events, Behavior,
 * Live Classes, Leave, Results, …).
 *
 * Visual contract is locked to the "Classes" card — that's the master
 * design reference. The component composes the same primitives (header,
 * metrics grid, footer with action buttons) but exposes them as props so
 * every module can plug its own data + actions without copying markup.
 *
 * Anatomy (top → bottom):
 *
 *   ┌─ HEADER ─────────────────────────────────────────────┐
 *   │ [icon] Title                                [actions]│
 *   │        Subtitle                                      │
 *   └──────────────────────────────────────────────────────┘
 *   ┌─ METRICS (optional) ─────────────────────────────────┐
 *   │ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
 *   │ │label │ │label │ │label │ │label │                  │
 *   │ │value │ │value │ │value │ │value │                  │
 *   │ └──────┘ └──────┘ └──────┘ └──────┘                  │
 *   └──────────────────────────────────────────────────────┘
 *   ┌─ CONTEXT ROW (optional) ─────────────────────────────┐
 *   │ avatars/text                              View →     │
 *   └──────────────────────────────────────────────────────┘
 *   ┌─ ACTIONS ────────────────────────────────────────────┐
 *   │  [Action 1]   [Action 2]   [Action 3]                │
 *   └──────────────────────────────────────────────────────┘
 *
 * Typography, spacing, ring, radius and hover behaviour mirror the
 * existing ClassCard so the entire app feels like one design system.
 */

import { Link } from "react-router-dom";
import { ReactNode } from "react";

// ─── Types ───────────────────────────────────────────────────────────────

export type EntityCardAccent =
  | "blue"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "slate"
  | "indigo"
  | "purple";

const accentMap: Record<EntityCardAccent, { bar: string; chip: string; bg: string; text: string }> = {
  blue: { bar: "bg-primary", chip: "bg-primary/10 text-primary border-primary/20", bg: "bg-primary", text: "text-primary" },
  emerald: { bar: "bg-emerald-500", chip: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", bg: "bg-emerald-500", text: "text-emerald-500" },
  violet: { bar: "bg-violet-500", chip: "bg-violet-500/10 text-violet-500 border-violet-500/20", bg: "bg-violet-500", text: "text-violet-500" },
  amber: { bar: "bg-amber-500", chip: "bg-amber-500/10 text-amber-500 border-amber-500/20", bg: "bg-amber-500", text: "text-amber-500" },
  rose: { bar: "bg-rose-500", chip: "bg-rose-500/10 text-rose-500 border-rose-500/20", bg: "bg-rose-500", text: "text-rose-500" },
  slate: { bar: "bg-border-strong", chip: "bg-surface-muted text-text-secondary border-border", bg: "bg-surface-muted", text: "text-text-muted" },
  indigo: { bar: "bg-indigo-500", chip: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20", bg: "bg-indigo-500", text: "text-indigo-500" },
  purple: { bar: "bg-purple-500", chip: "bg-purple-500/10 text-purple-500 border-purple-500/20", bg: "bg-purple-500", text: "text-purple-500" },
};

export interface EntityCardMetric {
  label: string;
  value: ReactNode;
  /** Optional value tint — e.g. "text-blue-600" for highlighted metrics. */
  tone?: string;
}

export interface EntityCardAction {
  label: string;
  /** Material symbols icon name. */
  icon?: string;
  /** Render as a link (uses react-router) when provided. */
  to?: string;
  /** Render as a button. Either `to` or `onClick` should be set. */
  onClick?: () => void;
  /** Color bucket — same accent palette as the card itself. */
  accent?: EntityCardAccent;
  /** When true, render filled (primary) instead of subtle outline. */
  primary?: boolean;
  /** Disabled state. */
  disabled?: boolean;
  /** Hide entirely when condition fails (e.g. role-gated actions). */
  hidden?: boolean;
  title?: string;
}

export interface EntityCardHoverAction {
  label: string;
  icon: string;
  onClick: () => void;
  /** Hover-state color bucket: blue, rose, etc. */
  accent?: "blue" | "rose" | "emerald" | "amber" | "slate";
}

export interface EntityCardProps {
  /** Top-left avatar / icon block. Either an icon name or a custom node. */
  icon?: string | ReactNode;
  /** Color bucket for the icon background and the left-edge status bar. */
  accent?: EntityCardAccent;

  /** Big title (entity name). */
  title: string;
  /** Small subtitle below the title (e.g. "2024-25", subject name, …). */
  subtitle?: string;
  /** Optional inline status pill rendered next to the title. */
  status?: { label: string; accent?: EntityCardAccent };

  /** Optional top-right hover-only action buttons (edit, delete, etc). */
  hoverActions?: EntityCardHoverAction[];

  /** 2/4-tile metrics grid in the body. Pass [] or omit to skip. */
  metrics?: EntityCardMetric[];

  /** Optional free-form body content rendered between header and footer. */
  children?: ReactNode;

  /**
   * Optional context row above the action buttons — typically a clickable
   * link with a "View →" hint (e.g. "12 Students").
   */
  context?: {
    label: ReactNode;
    icon?: ReactNode; // small avatars / count pip
    to?: string;
    onClick?: () => void;
  };

  /**
   * Footer action buttons — rendered as a 1-3 column equal-width grid so
   * cards stay visually balanced regardless of action count.
   */
  actions?: EntityCardAction[];

  className?: string;
}

// ─── Component ───────────────────────────────────────────────────────────

export function EntityCard({
  icon,
  accent = "blue",
  title,
  subtitle,
  status,
  hoverActions,
  metrics,
  children,
  context,
  actions,
  className = "",
}: EntityCardProps) {
  const accentTone = accentMap[accent];
  const visibleActions = (actions ?? []).filter((a) => !a.hidden);
  const colCount = Math.max(1, Math.min(visibleActions.length, 3));
  const gridColsClass =
    colCount === 1 ? "grid-cols-1" : colCount === 2 ? "grid-cols-2" : "grid-cols-3";

  return (
    <div
      className={`group relative bg-surface rounded-xl border border-border shadow-sm hover:shadow-md hover:border-border-strong transition-all text-text-primary ${className}`}
    >
      {/* Left status accent bar — shared with timetable/homework cards. */}
      <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${accentTone.bar}`} />

      <div className="px-4 py-3.5 flex flex-col h-full">
        {/* ─── Header ──────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {icon !== undefined && (
              <div
                className={`h-10 w-10 shrink-0 rounded-lg ${accentTone.bg} text-white flex items-center justify-center shadow-sm`}
              >
                {typeof icon === "string" ? (
                  <AppIcon name={icon} size={18} />
                ) : (
                  icon
                )}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="text-[13px] font-bold text-text-primary tracking-tight truncate">
                  {title}
                </h3>
                {status && (
                  <span
                    className={`inline-flex shrink-0 items-center px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${
                      accentMap[status.accent ?? "blue"].chip
                    }`}
                  >
                    {status.label}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className={`text-[11px] font-bold ${accentTone.text} truncate mt-0.5`}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Hover actions (edit/delete pills) */}
          {hoverActions && hoverActions.length > 0 && (
            <div className="flex gap-2 shrink-0">
              {hoverActions.map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    a.onClick();
                  }}
                  title={a.label}
                  aria-label={a.label}
                  className={`h-7 w-7 inline-flex items-center justify-center rounded-md bg-surface border border-border text-text-muted hover:text-primary hover:border-primary shadow-sm transition-colors ${
                    a.accent === "rose"
                      ? "hover:text-rose-500 hover:border-rose-500/40"
                      : a.accent === "emerald"
                        ? "hover:text-emerald-500 hover:border-emerald-500/40"
                        : a.accent === "amber"
                          ? "hover:text-amber-500 hover:border-amber-500/40"
                          : ""
                  }`}
                >
                  <AppIcon name={a.icon} size={14} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ─── Metrics grid ───────────────────────────────────────── */}
        {metrics && metrics.length > 0 && (
          <div
            className={`grid gap-1.5 mb-3 ${
              metrics.length === 2
                ? "grid-cols-2"
                : metrics.length === 3
                  ? "grid-cols-3"
                  : "grid-cols-2"
            }`}
          >
            {metrics.map((m, i) => (
              <div
                key={i}
                className="px-2 py-1.5 rounded-lg bg-surface-muted border border-border text-center"
              >
                <p className="text-[8px] font-bold text-text-muted uppercase tracking-widest mb-0.5">
                  {m.label}
                </p>
                <p
                  className={`text-[11px] font-bold truncate ${m.tone ?? "text-text-primary"}`}
                >
                  {m.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ─── Free-form body slot ───────────────────────────────── */}
        {children && <div className="mb-3">{children}</div>}

        {/* ─── Context row (e.g. "12 Students  View →") ──────────── */}
        {context && (
          <ContextRow
            label={context.label}
            icon={context.icon}
            to={context.to}
            onClick={context.onClick}
          />
        )}

        {/* ─── Action buttons ─────────────────────────────────────── */}
        {visibleActions.length > 0 && (
          <div
            className={`mt-auto pt-3 ${
              context ? "" : "border-t border-border"
            } grid ${gridColsClass} gap-1.5`}
          >
            {visibleActions.map((a, i) => (
              <ActionButton key={i} action={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function ContextRow({
  label,
  icon,
  to,
  onClick,
}: {
  label: ReactNode;
  icon?: ReactNode;
  to?: string;
  onClick?: () => void;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-2 min-w-0">
        {icon}
        <span className="text-[10px] font-bold text-text-primary truncate">{label}</span>
      </div>
      {(to || onClick) && (
        <span className="text-[9px] font-bold text-text-muted uppercase tracking-widest shrink-0 group-hover:text-primary transition-colors">
          View →
        </span>
      )}
    </>
  );
  const cls =
    "flex items-center justify-between border-t border-border pt-3 mb-3";
  if (to) {
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={`${cls} text-left`}>
        {inner}
      </button>
    );
  }
  return <div className={cls}>{inner}</div>;
}

function ActionButton({ action }: { action: EntityCardAction }) {
  const accent = accentMap[action.accent ?? "blue"];
  const baseClass = `flex h-8 w-full items-center justify-center gap-1 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed`;

  // Primary: filled colored background. Subtle: soft tinted background.
  const variantClass = action.primary
    ? `${accent.bg} text-white shadow-sm hover:opacity-90`
    : `bg-surface-muted border border-border ${accent.text} hover:bg-surface hover:border-border-strong`;

  const iconNode = action.icon && (
    <AppIcon name={action.icon} size={13} />
  );

  if (action.to && !action.disabled) {
    return (
      <Link to={action.to} className={`${baseClass} ${variantClass}`} title={action.title}>
        {iconNode}
        {action.label}
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={action.onClick}
      disabled={action.disabled}
      className={`${baseClass} ${variantClass}`}
      title={action.title}
    >
      {iconNode}
      {action.label}
    </button>
  );
}

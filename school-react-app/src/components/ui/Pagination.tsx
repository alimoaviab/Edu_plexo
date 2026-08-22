import { AppIcon } from "shared/ui/AppIcon";
import { memo } from "react";

type PaginationProps = {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  isFetching?: boolean;
  pageSizeOptions?: number[];
  hideLimit?: boolean;
  className?: string;
};

const DEFAULT_SIZES = [10, 25, 50, 100];

function buildPageSequence(current: number, total: number): Array<number | "…"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const seq: Array<number | "…"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) seq.push("…");
  for (let i = start; i <= end; i += 1) seq.push(i);
  if (end < total - 1) seq.push("…");
  seq.push(total);
  return seq;
}

export const Pagination = memo(function Pagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  isFetching,
  pageSizeOptions = DEFAULT_SIZES,
  hideLimit = false,
  className = "",
}: PaginationProps) {
  if (!total) return null;

  const startRow = Math.min(total, (page - 1) * limit + 1);
  const endRow = Math.min(total, page * limit);
  const sequence = buildPageSequence(page, pages);

  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-3 px-2 py-3 text-[11px] ${className}`}
    >
      <div className="flex items-center gap-2 text-text-muted font-medium">
        <span>
          {startRow}-{endRow} of <span className="font-bold text-text-primary">{total}</span>
        </span>
        {isFetching && (
          <span className="inline-flex items-center gap-1 text-primary">
            <AppIcon name="Loader2" size={12} className="animate-spin" />
            updating
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {!hideLimit && onLimitChange && (
          <label className="flex items-center gap-1 text-text-muted">
            Rows
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="bg-surface border border-border rounded px-1.5 py-0.5 text-[11px] font-bold text-text-primary focus:outline-none focus:border-primary"
            >
              {pageSizeOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            className="h-7 w-7 flex items-center justify-center rounded border border-border bg-surface text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <AppIcon name="ChevronLeft" size={14} />
          </button>

          {sequence.map((p, idx) =>
            p === "…" ? (
              <span key={`gap-${idx}`} className="px-1 text-text-muted">
                …
              </span>
            ) : (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`h-7 min-w-[28px] px-1.5 rounded text-[11px] font-bold transition-colors ${
                  p === page
                    ? "bg-primary text-white border border-primary font-bold shadow-sm"
                    : "bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            type="button"
            disabled={page >= pages}
            onClick={() => onPageChange(Math.min(pages, page + 1))}
            className="h-7 w-7 flex items-center justify-center rounded border border-border bg-surface text-text-muted hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <AppIcon name="ChevronRight" size={14} />
          </button>
        </div>
      </div>
    </div>
  );
});

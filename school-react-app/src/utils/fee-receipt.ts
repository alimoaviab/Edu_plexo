/**
 * Real fee receipt + statement export.
 *
 * Companion to `marksheet.ts`. Generates printable HTML for two flows:
 *   - exportFeeReceipt(payment, options)   single-payment receipt
 *   - exportFeeStatement(report, options)  full ledger statement
 *
 * Both build a self-contained HTML document in a hidden iframe and trigger
 * `window.print()` so users can save as PDF or send to a physical printer
 * without any third-party dependency. The visual language matches the
 * marksheet template (same letterhead, typography, spacing) so school-
 * branded documents feel like a single family.
 */

// ────────────────────────────────────────────────────────────────────────
// Public types
// ────────────────────────────────────────────────────────────────────────

export interface FeeReceiptOptions {
  /** School name printed on the header. Defaults to "School". */
  schoolName?: string;
  /** Optional school address line under the name. */
  schoolAddress?: string;
  /** Optional principal name printed in the signature row. */
  principal?: string;
  /** Currency prefix, defaults to "Rs." */
  currency?: string;
}

export interface FeeReceiptPayment {
  receipt_no: string;
  date: string;
  amount: number;
  fee_type: string;
  method: string;
  status: string;
}

export interface FeeReceiptStudent {
  /** Student display name. */
  name: string;
  /** Class + section, e.g. "Grade 8 - A". */
  className: string;
  /** Roll number / admission number. */
  rollNo?: string;
  /** Academic year string. */
  academicYear?: string;
}

export interface FeeStatementSummary {
  total_fee: number;
  collected: number;
  pending: number;
  percentage_paid: number;
  status: string;
}

export interface FeeStatementDetail {
  fee_type: string;
  amount: number;
  due_date: string;
  status: string;
  payment_date?: string | null;
  receipt_no?: string | null;
}

export interface FeeStatementInput {
  student: FeeReceiptStudent;
  summary: FeeStatementSummary;
  details: FeeStatementDetail[];
  payments: FeeReceiptPayment[];
}

// ────────────────────────────────────────────────────────────────────────
// Internal helpers — escape, format, base styles, print frame.
// Kept separate from `marksheet.ts` so the two utilities can evolve
// independently without coupling.
// ────────────────────────────────────────────────────────────────────────

function htmlEscape(s: string | number | undefined | null): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function fmtMoney(amount: number, currency: string): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${currency} ${safe.toLocaleString()}`;
}

function fmtToday(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusTone(status: string): { bg: string; fg: string } {
  const s = status.toLowerCase();
  if (s === "paid")
    return { bg: "#dbeafe", fg: "#1d4ed8" }; // blue
  if (s === "partial")
    return { bg: "#dcfce7", fg: "#15803d" }; // emerald
  if (s === "overdue" || s === "failed")
    return { bg: "#fee2e2", fg: "#b91c1c" }; // rose
  return { bg: "#fef3c7", fg: "#b45309" }; // amber default
}

const baseStyles = `
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #0f172a;
    background: #fff;
  }
  .sheet {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 48px;
  }
  .header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 16px;
    margin-bottom: 24px;
    gap: 24px;
  }
  .header h1 {
    margin: 0;
    font-size: 22px;
    letter-spacing: 0.5px;
  }
  .header .school-meta {
    font-size: 11px;
    color: #475569;
    margin-top: 4px;
  }
  .header .badge {
    text-align: right;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
    color: #2563eb;
    text-transform: uppercase;
  }
  .header .receipt-meta {
    text-align: right;
    font-size: 10px;
    color: #475569;
    margin-top: 6px;
    line-height: 1.5;
  }
  .summary-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 24px;
    margin-bottom: 24px;
    font-size: 12px;
  }
  .summary-grid .label {
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 9px;
    font-weight: 700;
  }
  .summary-grid .value {
    color: #0f172a;
    font-weight: 600;
    margin-top: 2px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
  }
  thead th {
    background: #f1f5f9;
    color: #0f172a;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px 12px;
    text-align: left;
    border-bottom: 1px solid #cbd5e1;
  }
  tbody td {
    padding: 10px 12px;
    font-size: 12px;
    border-bottom: 1px solid #e2e8f0;
  }
  tbody tr:last-child td { border-bottom: none; }
  .amount { text-align: right; font-variant-numeric: tabular-nums; font-weight: 600; }
  .totals {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
  .totals .stat {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px 14px;
  }
  .totals .stat .lbl {
    font-size: 9px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: 700;
  }
  .totals .stat .val {
    font-size: 18px;
    font-weight: 700;
    margin-top: 6px;
    color: #0f172a;
  }
  .total-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 24px;
    gap: 24px;
    align-items: flex-end;
  }
  .total-row .grand {
    text-align: right;
  }
  .total-row .grand .lbl {
    font-size: 9px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    font-weight: 700;
  }
  .total-row .grand .val {
    font-size: 26px;
    font-weight: 800;
    margin-top: 4px;
    color: #0f172a;
    letter-spacing: -0.5px;
  }
  .pill {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .footer {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 11px;
    color: #475569;
  }
  .signature {
    border-top: 1px solid #94a3b8;
    padding-top: 6px;
    width: 220px;
    text-align: center;
    font-weight: 600;
  }
  .note {
    margin-top: 20px;
    padding: 10px 14px;
    border: 1px dashed #cbd5e1;
    border-radius: 8px;
    font-size: 10px;
    color: #475569;
    line-height: 1.5;
  }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .sheet { padding: 20px; }
    .no-print { display: none; }
  }
</style>
`;

function renderHeader(
  opts: FeeReceiptOptions,
  badge: string,
  rightExtra?: string,
): string {
  return `
    <div class="header">
      <div>
        <h1>${htmlEscape(opts.schoolName || "School")}</h1>
        <div class="school-meta">${htmlEscape(opts.schoolAddress || "Official Fee Document")}</div>
      </div>
      <div>
        <div class="badge">${htmlEscape(badge)}</div>
        ${rightExtra || ""}
      </div>
    </div>
  `;
}

function renderFooter(opts: FeeReceiptOptions): string {
  return `
    <div class="footer">
      <div>
        <div>Issued on ${htmlEscape(fmtToday())}</div>
        <div style="margin-top:4px;color:#94a3b8;font-size:10px;">
          This is a system-generated document. No physical signature required.
        </div>
      </div>
      <div class="signature">${htmlEscape(opts.principal || "Authorized Signatory")}</div>
    </div>
  `;
}

function renderStudentBlock(student: FeeReceiptStudent): string {
  return `
    <div class="summary-grid">
      <div>
        <div class="label">Student</div>
        <div class="value">${htmlEscape(student.name)}</div>
      </div>
      <div>
        <div class="label">Class</div>
        <div class="value">${htmlEscape(student.className)}</div>
      </div>
      ${student.rollNo
        ? `<div>
            <div class="label">Roll / Admission</div>
            <div class="value">${htmlEscape(student.rollNo)}</div>
          </div>`
        : ""}
      ${student.academicYear
        ? `<div>
            <div class="label">Academic Year</div>
            <div class="value">${htmlEscape(student.academicYear)}</div>
          </div>`
        : ""}
    </div>
  `;
}

function renderStatusPill(status: string): string {
  const tone = statusTone(status);
  return `
    <span class="pill" style="background:${tone.bg};color:${tone.fg};">
      ${htmlEscape(status || "—")}
    </span>
  `;
}

/**
 * Open a hidden iframe, write the supplied HTML, and trigger the browser
 * print dialog. Cleans up the iframe after a short delay so the dialog has
 * time to spawn before tear-down.
 */
function printHtmlDocument(html: string, title: string): void {
  if (typeof window === "undefined") return;

  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.setAttribute("title", title);
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.style.opacity = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument;
  if (!doc) {
    document.body.removeChild(frame);
    // Last-resort fallback: open in a new window.
    const popup = window.open("", "_blank");
    if (popup) {
      popup.document.write(html);
      popup.document.close();
      popup.focus();
      popup.print();
    }
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  const trigger = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      setTimeout(() => {
        if (frame.parentNode) frame.parentNode.removeChild(frame);
      }, 1000);
    }
  };

  if (frame.contentWindow?.document.readyState === "complete") {
    trigger();
  } else {
    frame.addEventListener("load", trigger, { once: true });
  }
}

// ────────────────────────────────────────────────────────────────────────
// Public exports
// ────────────────────────────────────────────────────────────────────────

/**
 * Single-payment receipt — used by the "Print" action on every payment row
 * in the fee history list.
 */
export function exportFeeReceipt(
  payment: FeeReceiptPayment,
  student: FeeReceiptStudent,
  opts: FeeReceiptOptions = {},
): void {
  const currency = opts.currency || "Rs.";
  const tone = statusTone(payment.status);

  const rightExtra = `
    <div class="receipt-meta">
      <div><strong>Receipt No.</strong> ${htmlEscape(payment.receipt_no || "—")}</div>
      <div><strong>Date</strong> ${htmlEscape(payment.date || fmtToday())}</div>
    </div>
  `;

  const html = `<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8" />
    <title>Fee Receipt — ${htmlEscape(payment.receipt_no || student.name)}</title>
    ${baseStyles}
  </head><body>
    <div class="sheet">
      ${renderHeader(opts, "Fee Receipt", rightExtra)}
      ${renderStudentBlock(student)}

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Method</th>
            <th>Status</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${htmlEscape(payment.fee_type || "Fee Payment")}</td>
            <td>${htmlEscape(payment.method || "—")}</td>
            <td>
              <span class="pill" style="background:${tone.bg};color:${tone.fg};">
                ${htmlEscape(payment.status || "paid")}
              </span>
            </td>
            <td class="amount">${fmtMoney(payment.amount, currency)}</td>
          </tr>
        </tbody>
      </table>

      <div class="total-row">
        <div class="grand">
          <div class="lbl">Amount Paid</div>
          <div class="val">${fmtMoney(payment.amount, currency)}</div>
        </div>
      </div>

      <div class="note">
        Please retain this receipt as proof of payment. For any queries
        regarding this transaction, contact the school accounts office and
        quote the receipt number above.
      </div>

      ${renderFooter(opts)}
    </div>
  </body></html>`;

  printHtmlDocument(html, `Receipt ${payment.receipt_no}`);
}

/**
 * Full ledger statement — used by the page-level "Print Statement" button.
 * Lists every fee component and every payment under one branded document.
 */
export function exportFeeStatement(
  input: FeeStatementInput,
  opts: FeeReceiptOptions = {},
): void {
  const currency = opts.currency || "Rs.";
  const { student, summary, details, payments } = input;

  const detailRows = details
    .map(
      (d) => `
        <tr>
          <td>${htmlEscape(d.fee_type)}</td>
          <td>${htmlEscape(d.due_date || "—")}</td>
          <td>${renderStatusPill(d.status)}</td>
          <td>${htmlEscape(d.receipt_no || "—")}</td>
          <td class="amount">${fmtMoney(d.amount, currency)}</td>
        </tr>
      `,
    )
    .join("");

  const paymentRows = payments
    .map(
      (p) => `
        <tr>
          <td>${htmlEscape(p.receipt_no)}</td>
          <td>${htmlEscape(p.date)}</td>
          <td>${htmlEscape(p.fee_type)}</td>
          <td>${htmlEscape(p.method || "—")}</td>
          <td class="amount">${fmtMoney(p.amount, currency)}</td>
        </tr>
      `,
    )
    .join("");

  const html = `<!DOCTYPE html><html lang="en"><head>
    <meta charset="utf-8" />
    <title>Fee Statement — ${htmlEscape(student.name)}</title>
    ${baseStyles}
  </head><body>
    <div class="sheet">
      ${renderHeader(opts, "Fee Statement")}
      ${renderStudentBlock(student)}

      <div class="totals">
        <div class="stat">
          <div class="lbl">Total Fee</div>
          <div class="val">${fmtMoney(summary.total_fee, currency)}</div>
        </div>
        <div class="stat">
          <div class="lbl">Collected</div>
          <div class="val">${fmtMoney(summary.collected, currency)}</div>
        </div>
        <div class="stat">
          <div class="lbl">Pending</div>
          <div class="val">${fmtMoney(summary.pending, currency)}</div>
        </div>
        <div class="stat">
          <div class="lbl">Paid %</div>
          <div class="val">${Number(summary.percentage_paid || 0)}%</div>
        </div>
      </div>

      <h3 style="margin-top:32px;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#475569;">
        Fee Components
      </h3>
      <table>
        <thead>
          <tr>
            <th>Fee Type</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Receipt</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${detailRows || `<tr><td colspan="5" style="text-align:center;color:#94a3b8;font-size:11px;padding:18px 0;">No fee components recorded.</td></tr>`}
        </tbody>
      </table>

      <h3 style="margin-top:32px;font-size:12px;letter-spacing:1.2px;text-transform:uppercase;color:#475569;">
        Payment History
      </h3>
      <table>
        <thead>
          <tr>
            <th>Receipt No.</th>
            <th>Date</th>
            <th>Fee Type</th>
            <th>Method</th>
            <th class="amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${paymentRows || `<tr><td colspan="5" style="text-align:center;color:#94a3b8;font-size:11px;padding:18px 0;">No payments recorded yet.</td></tr>`}
        </tbody>
      </table>

      <div class="total-row">
        <div class="grand">
          <div class="lbl">Outstanding Balance</div>
          <div class="val">${fmtMoney(summary.pending, currency)}</div>
        </div>
      </div>

      <div class="note">
        This statement reflects fees as of ${htmlEscape(fmtToday())}. For
        the most up-to-date balance please refer to the school portal or
        contact the accounts office.
      </div>

      ${renderFooter(opts)}
    </div>
  </body></html>`;

  printHtmlDocument(html, `Fee Statement ${student.name}`);
}

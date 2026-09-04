/**
 * PaymentPage — Executive manual institutional settlement & proof upload.
 *
 * Provides:
 *   1. Institutional Plan Summary Banner (Hero Obsidian/Indigo Theme with pure white typography)
 *   2. Step 1: Official Corporate Bank & Mobile Wallet Accounts with 1-click copy
 *   3. Step 2: Proof of Transfer Upload (Screenshot + Transaction Reference ID + Bank SMS)
 *   4. Instant audit logging and SLA confirmation
 */

import { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import { AppIcon } from "shared/ui/AppIcon";
import { showToast } from "@/utils/toast";
import * as service from "../services/subscription.service";
import { useSubscription } from "../hooks/useSubscription";
import type { Plan } from "../services/subscription.service";

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast(`${label} copied to clipboard!`, "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(`Could not copy ${label}`, "error");
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 shrink-0 ${
        copied
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-700 border border-slate-200/80"
      }`}
      title={`Copy ${label}`}
    >
      {copied ? (
        <>
          <AppIcon name="Check" size={13} className="text-emerald-600" />
          <span>Copied!</span>
        </>
      ) : (
        <>
          <AppIcon name="Copy" size={13} />
          <span>Copy</span>
        </>
      )}
    </button>
  );
}

interface AccountRowProps {
  label: string;
  value: string;
  highlight?: boolean;
}

function AccountRow({ label, value, highlight }: AccountRowProps) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0 gap-4">
      <span className="text-xs font-semibold text-slate-500 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`font-mono font-bold text-sm tracking-wide select-all truncate ${
            highlight ? "text-blue-700 dark:text-blue-600" : "text-slate-800"
          }`}
        >
          {value}
        </span>
        <CopyButton value={value} label={label} />
      </div>
    </div>
  );
}

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { current, plans } = useSubscription();

  // Renewal flows arrive without a plan in navigation state — fall back to
  // the Owner's current plan so "Renew Plan" never dead-ends.
  const statePlan = location.state?.plan as Plan | undefined;
  const fallbackPlan = useMemo(() => {
    const sub = current?.subscription;
    if (!sub || !sub.plan_name || sub.plan_name === "trial") return undefined;	const match = (plans || []).find(
			(p) =>
				(sub.plan_id && (p.id === sub.plan_id || p.name === sub.plan_id)) ||
				p.id === sub.plan_name ||
				p.name === sub.plan_name ||
				p.name === `plan_${sub.plan_name}` ||
				sub.plan_name.toLowerCase().includes(p.name.toLowerCase())
		);
    return match;
  }, [current, plans]);
  const plan = statePlan ?? fallbackPlan;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [smsText, setSmsText] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);	const rolePrefix = location.pathname.startsWith("/admin") ? "/admin" : "/owner";
	const planIsCurrent = Boolean(
		current?.subscription &&
			current.subscription.plan_name !== "trial" &&
			((current.subscription.plan_id && (current.subscription.plan_id === plan?.id || current.subscription.plan_id === plan?.name)) ||
				current.subscription.plan_name === plan?.name ||
				current.subscription.plan_name === plan?.display_name)
	);

  useEffect(() => {
    if (!plan) {
      navigate(`${rolePrefix}/subscription`);
    }
  }, [plan, navigate, rolePrefix]);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [file]);

  if (!plan) return null;

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      showToast("File size must be under 10MB.", "error");
      return;
    }
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !smsText && !transactionId) {
      showToast("Please provide a payment screenshot or transaction ID.", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      let screenshotUrl = "";
      if (file) {
        screenshotUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      const txId = transactionId || smsText.slice(0, 50) || "FILE_" + (file?.name || Date.now());
      const res = await service.submitPaymentProof({
        plan_id: plan.id,
        transaction_id: txId,
        amount: plan.price,
        notes: smsText,
        screenshot_url: screenshotUrl,
      });

      if (res.ok) {
        showToast(
          "Payment proof submitted! Verification is pending. If your payment is not approved, please contact +92 306 4944326.",
          "success"
        );
        navigate(`${rolePrefix}/subscription`);
      } else {
        showToast(res.error?.message || "Failed to submit proof. Please try again.", "error");
      }
    } catch {
      showToast("An unexpected error occurred. Please contact billing support at +92 306 4944326.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const accounts = [
    {
      id: "alfalah",
      bank: "Bank Alfalah",
      type: "Corporate Bank Transfer",
      color: "blue",
      icon: "Building",
      badge: "Primary Account",
      rows: [
        { label: "Account Title", value: "Ali Moavia" },
        { label: "Account Number", value: "59705002080213", highlight: true },
      ],
    },
    {
      id: "easypaisa",
      bank: "Easypaisa",
      type: "Instant Mobile Wallet",
      color: "emerald",
      icon: "Smartphone",
      badge: "Fastest Settlement",
      rows: [
        { label: "Account Title", value: "Ali Moavia" },
        { label: "Mobile Number", value: "0306-4944326", highlight: true },
      ],
    },
    {
      id: "habibmetro",
      bank: "Habib Metro Bank",
      type: "Corporate Bank Transfer",
      color: "purple",
      icon: "Building2",
      badge: "Alternate Bank",
      rows: [
        { label: "Account Title", value: "Ali Moavia" },
        { label: "Account Number", value: "6984729308714105093", highlight: true },
      ],
    },
  ];

  return (
    <SchoolShell eyebrow="Owner Portal" title="Subscription Upgrade">
      <div className="max-w-6xl mx-auto space-y-8 pb-16">
        {/* Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => navigate(`${rolePrefix}/subscription`)}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:border-slate-300 transition-all shadow-sm cursor-pointer shrink-0"
              title="Return to Subscription Plans"
            >
              <AppIcon name="ArrowLeft" size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700">
                  Step 2 of 2
                </span>
                <span className="text-xs font-semibold text-slate-400">· Manual Invoice Settlement</span>
              </div>					<h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
						{statePlan && !planIsCurrent ? `Upgrade to ${plan.display_name}` : `Renew ${plan.display_name}`}
					</h1>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <AppIcon name="ShieldCheck" size={16} className="text-emerald-500" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        {/* Plan Summary Banner (Hero Theme with PURE WHITE Typography) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border-2 border-blue-500/40 p-6 sm:p-8 text-white shadow-2xl shadow-blue-950/40">
          {/* Subtle lighting glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 -bottom-16 w-48 h-48 bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0 border border-white/20">
                <AppIcon name="Sparkles" size={28} className="text-yellow-300" />
              </div>
              <div>
                <span className="inline-block text-xs font-bold text-blue-300 uppercase tracking-widest mb-1">
                  Selected Subscription Tier
                </span>
                {/* CRITICAL: Strict pure white font */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {plan.display_name}
                </h2>
                <div className="flex flex-wrap items-center gap-2.5 mt-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-white/10 text-blue-200 border border-white/15">
                    <AppIcon name="Users" size={13} className="text-blue-300" />
                    <span>Up to <strong className="text-white">{plan.student_limit.toLocaleString()} students</strong></span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    <AppIcon name="CheckCircle" size={13} className="text-emerald-400" />
                    <span>All Platform Modules Unlocked</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Price Box */}
            <div className="text-left md:text-right border-t md:border-t-0 pt-4 md:pt-0 border-white/10 shrink-0">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                Total Amount Payable
              </p>
              {/* CRITICAL: Strict pure white font */}
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums">
                PKR {plan.price.toLocaleString()}
              </p>
              <p className="text-xs font-semibold text-blue-300/90 mt-0.5">
                Billed monthly · Zero hidden fees
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Step 1 Accounts (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-600/30">
                  1
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Send Payment
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Transfer exactly <strong className="text-slate-900">PKR {plan.price.toLocaleString()}</strong> to any official account:
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {/* Properly rendered SVG icon badge */}
                      <div
                        className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                          account.color === "blue"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : account.color === "emerald"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-purple-50 text-purple-600 border border-purple-100"
                        }`}
                      >
                        <AppIcon name={account.icon} size={22} />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-base">{account.bank}</h4>
                        <p className="text-xs text-slate-400 font-semibold">{account.type}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        account.color === "blue"
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : account.color === "emerald"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {account.badge}
                    </span>
                  </div>

                  <div className="space-y-0.5 bg-slate-50/70 rounded-xl p-3.5 border border-slate-100">
                    {account.rows.map((row) => (
                      <AccountRow key={row.label} {...row} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Verification SLA Guarantee Callout */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 flex items-start gap-3.5 shadow-sm">
              <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <AppIcon name="ShieldCheck" size={18} />
              </div>
              <div className="text-xs text-blue-900 leading-relaxed font-medium">
                <strong className="font-extrabold text-blue-950 block mb-0.5">
                  Fast Manual Verification Guarantee
                </strong>
                Once your transfer is completed, submit your transaction ID or screenshot in Step 2.
                Our operations team verifies receipts continuously and unlocks campus access within <strong>2 to 4 hours</strong>.
              </div>
            </div>
          </div>

          {/* Right Column: Step 2 Submit Proof (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-600/30">
                  2
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Submit Proof
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Upload screenshot or enter transaction reference
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Screenshot Upload Dropzone */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AppIcon name="Image" size={14} className="text-blue-600" />
                  <span>Upload Payment Screenshot</span>
                </label>

                <div
                  className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                    dragOver
                      ? "border-blue-500 bg-blue-50/80"
                      : file
                      ? "border-emerald-400 bg-emerald-50/40"
                      : "border-slate-200 bg-slate-50/70 hover:border-blue-400 hover:bg-blue-50/20"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
                  }}
                >
                  <input
                    type="file"
                    id="payment-screenshot"
                    className="hidden"
                    accept="image/*,application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFile(e.target.files[0]);
                    }}
                  />
                  <label htmlFor="payment-screenshot" className="cursor-pointer block p-5">
                    {preview ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={preview}
                          alt="Payment receipt preview"
                          className="max-h-48 rounded-xl object-contain shadow-md border border-slate-200"
                        />
                        <div className="text-center">
                          <p className="text-xs font-bold text-slate-800 truncate max-w-[240px]">
                            {file?.name}
                          </p>
                          <span className="text-[10px] text-slate-400">
                            {((file?.size || 0) / 1024 / 1024).toFixed(2)} MB · Ready to upload
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            setFile(null);
                          }}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold flex items-center gap-1 transition"
                        >
                          <AppIcon name="Trash2" size={12} />
                          <span>Remove & Replace</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center gap-2.5 py-4">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                          <AppIcon name="CloudUpload" size={24} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">
                            Click to upload receipt or drag & drop
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            PNG, JPG or PDF format · Max 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  AND / OR
                </span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Transaction Reference & Notes */}
              <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
                <div>
                  <label
                    htmlFor="transaction-id"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <AppIcon name="Hash" size={14} className="text-blue-600" />
                    <span>Transaction / Reference ID</span>
                  </label>
                  <input
                    id="transaction-id"
                    type="text"
                    placeholder="e.g. 59705002080 or TXN-984214"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300"
                  />
                </div>

                <div>
                  <label
                    htmlFor="sms-text"
                    className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
                  >
                    <AppIcon name="MessageSquare" size={14} className="text-blue-600" />
                    <span>Confirmation SMS or Notes (Optional)</span>
                  </label>
                  <textarea
                    id="sms-text"
                    rows={3}
                    placeholder="Paste the bank confirmation SMS message or sender account title here..."
                    value={smsText}
                    onChange={(e) => setSmsText(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-slate-300 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || (!file && !smsText && !transactionId)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting Payment Proof…</span>
                    </>
                  ) : (
                    <>
                      <AppIcon name="Send" size={18} />
                      <span>Submit Payment Proof</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate(`${rolePrefix}/subscription`)}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-700 font-semibold transition-colors flex items-center justify-center gap-1"
                >
                  <AppIcon name="ArrowLeft" size={12} />
                  <span>Cancel and return to plans</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

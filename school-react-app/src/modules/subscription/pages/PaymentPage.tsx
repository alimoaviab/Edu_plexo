import { showToast } from "@/utils/toast";
import { AppIcon } from "shared/ui/AppIcon";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SchoolShell } from "@/layouts/SchoolShell";
import * as service from "../services/subscription.service";
import type { Plan } from "../services/subscription.service";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
        copied
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-700"
      }`}
    >
      {copied ? (
        <>
          <AppIcon name="Check" size={13} />
          Copied!
        </>
      ) : (
        <>
          <AppIcon name="Copy" size={13} />
          Copy
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
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0 gap-4">
      <span className="text-sm text-gray-500 shrink-0">{label}</span>
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`font-mono font-bold text-sm truncate ${
            highlight ? "text-blue-700" : "text-gray-900"
          }`}
        >
          {value}
        </span>
        <CopyButton value={value} />
      </div>
    </div>
  );
}

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const plan = location.state?.plan as Plan;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [smsText, setSmsText] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!plan) {
      navigate("/admin/subscription");
    }
  }, [plan, navigate]);

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
      showToast("Please provide a screenshot or transaction details.", "info");
      return;
    }

    setIsSubmitting(true);
    try {
      const txId = transactionId || smsText.slice(0, 50) || "FILE_" + (file?.name || Date.now());
      const res = await service.submitPaymentProof({
        plan_id: plan.id,
        transaction_id: txId,
        amount: plan.price,
        notes: smsText,
        screenshot_url: file ? "pending_upload://" + file.name : "",
      });

      if (res.ok) {
        showToast(
          "✅ Payment proof submitted! Our team will verify and activate your plan within 24 hours.",
          "success"
        );
        navigate("/admin/subscription");
      } else {
        showToast(res.error?.message || "Failed to submit. Please try again.", "error");
      }
    } catch {
      showToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const accounts = [
    {
      id: "alfalah",
      bank: "Bank Alfalah",
      type: "Bank Transfer",
      color: "blue",
      icon: "🏦",
      rows: [
        { label: "Account Name", value: "Ali Moavia" },
        { label: "Account Number", value: "59705002080213", highlight: true },
      ],
    },
    {
      id: "easypaisa",
      bank: "Easypaisa",
      type: "Mobile Wallet",
      color: "emerald",
      icon: "📱",
      rows: [
        { label: "Account Name", value: "Ali Moavia" },
        { label: "Mobile Number", value: "0306-4944326", highlight: true },
      ],
    },
    {
      id: "habibmetro",
      bank: "Habib Metro Bank",
      type: "Bank Transfer",
      color: "purple",
      icon: "🏛️",
      rows: [
        { label: "Account Name", value: "Ali Moavia" },
        { label: "Account Number", value: "6984729308714105093", highlight: true },
      ],
    },
  ];

  return (
    <SchoolShell>
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/subscription")}
            className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
          >
            <AppIcon name="ArrowLeft" size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Upgrade to {plan.display_name}
            </h1>
            <p className="text-gray-500 mt-0.5">
              Complete payment to activate your subscription
            </p>
          </div>
        </div>

        {/* Plan Summary Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <AppIcon name="Sparkles" size={28} />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">You are upgrading to</p>
              <h2 className="text-2xl font-bold">{plan.display_name}</h2>
              <p className="text-blue-200 text-sm mt-0.5">Up to {plan.student_limit.toLocaleString()} students</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-sm">Monthly Price</p>
            <p className="text-4xl font-black">PKR {plan.price.toLocaleString()}</p>
            <p className="text-blue-200 text-sm">/month</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Left — Payment Accounts */}
          <div className="space-y-5">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-black">1</span>
              Send Payment
            </h3>

            <p className="text-sm text-gray-500">
              Transfer{" "}
              <span className="font-bold text-gray-900">PKR {plan.price.toLocaleString()}</span>{" "}
              to any of the accounts below, then submit your proof in Step 2.
            </p>

            {accounts.map((account) => (
              <div
                key={account.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{account.icon}</span>
                  <div>
                    <h4 className="font-bold text-gray-900">{account.bank}</h4>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{account.type}</p>
                  </div>
                </div>
                <div className="space-y-0">
                  {account.rows.map((row) => (
                    <AccountRow key={row.label} {...row} />
                  ))}
                </div>
              </div>
            ))}

            {/* Info note */}
            <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4">
              <AppIcon name="Info" size={18} className="text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 leading-relaxed">
                After payment, submit your screenshot or transaction ID below. Our team will verify and activate your plan within{" "}
                <strong>24 hours</strong>.
              </p>
            </div>
          </div>

          {/* Right — Proof Submission */}
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-5">
              <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-black">2</span>
              Submit Proof
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Screenshot Upload */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <AppIcon name="Image" size={16} className="text-gray-400" />
                  Upload Payment Screenshot
                </label>

                <div
                  className={`relative border-2 border-dashed rounded-xl transition-all ${
                    dragOver
                      ? "border-blue-500 bg-blue-50"
                      : file
                      ? "border-blue-400 bg-blue-50/50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30"
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  />
                  <label htmlFor="payment-screenshot" className="cursor-pointer block p-6">
                    {preview ? (
                      <div className="flex flex-col items-center gap-3">
                        <img
                          src={preview}
                          alt="Payment proof preview"
                          className="max-h-48 rounded-lg object-contain shadow-md"
                        />
                        <p className="text-sm text-blue-700 font-semibold truncate max-w-full">{file?.name}</p>
                        <button
                          type="button"
                          onClick={(e) => { e.preventDefault(); setFile(null); }}
                          className="text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"
                        >
                          <AppIcon name="Trash2" size={13} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                          <AppIcon name="CloudUpload" size={28} className="text-gray-400" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Click to upload or drag & drop</p>
                          <p className="text-xs text-gray-400 mt-1">PNG, JPG or PDF — max 10MB</p>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">OR</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Transaction ID */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                <label htmlFor="transaction-id" className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <AppIcon name="Hash" size={16} className="text-gray-400" />
                  Transaction / Reference ID
                </label>
                <input
                  id="transaction-id"
                  type="text"
                  placeholder="e.g. TXN123456789"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300"
                />

                <label htmlFor="sms-text" className="block text-sm font-semibold text-gray-700 flex items-center gap-2 mt-2">
                  <AppIcon name="MessageSquare" size={16} className="text-gray-400" />
                  Paste Transaction SMS (optional)
                </label>
                <textarea
                  id="sms-text"
                  rows={4}
                  placeholder="Paste the confirmation SMS or email you received from your bank/wallet..."
                  value={smsText}
                  onChange={(e) => setSmsText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || (!file && !smsText && !transactionId)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-base hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <AppIcon name="Send" size={20} />
                    Submit Payment Proof
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/admin/subscription")}
                className="w-full py-3 text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors"
              >
                ← Cancel and go back
              </button>
            </form>
          </div>
        </div>
      </div>
    </SchoolShell>
  );
}

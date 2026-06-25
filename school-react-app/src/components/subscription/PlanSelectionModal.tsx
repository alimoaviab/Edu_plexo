import { AppIcon } from "shared/ui/AppIcon";

interface PlanSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (planName: string) => void;
  isProcessing?: boolean;
}

export function PlanSelectionModal({ isOpen, onClose, onSelect, isProcessing }: PlanSelectionModalProps) {
  if (!isOpen) return null;

  const options = [
    { name: "basic", title: "Basic Plan", price: 4000, students: 100, color: "border-slate-200" },
    { name: "standard", title: "Standard Plan", price: 8000, students: 300, color: "border-blue-500 ring-2 ring-blue-100", popular: true },
    { name: "premium", title: "Premium Plan", price: 15000, students: 800, color: "border-slate-200" }
  ];

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-100 shadow-2xl p-6 md:p-8 relative overflow-hidden flex flex-col max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition cursor-pointer"
        >
          <AppIcon name="X" size={16} />
        </button>

        <h3 className="text-lg font-black text-slate-900 tracking-tight mb-1 text-center">
          Select Subscription Plan
        </h3>
        <p className="text-xs font-semibold text-slate-400 text-center mb-6">
          Choose a plan to activate your trial or upgrade.
        </p>

        <div className="space-y-3 flex-1 overflow-y-auto pr-1">
          {options.map((opt) => (
            <div
              key={opt.name}
              className={`p-4 rounded-2xl border-2 flex items-center justify-between transition hover:shadow-md ${opt.color}`}
            >
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs md:text-sm font-black text-slate-800">{opt.title}</h4>
                  {opt.popular && (
                    <span className="bg-blue-600 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-slate-400 font-semibold mt-1">
                  Up to {opt.students} students
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs md:text-sm font-black text-slate-900">PKR {opt.price.toLocaleString()}</span>
                  <span className="text-[9px] font-bold text-slate-400 block">/mo</span>
                </div>
                <button
                  onClick={() => onSelect(opt.name)}
                  disabled={isProcessing}
                  className="h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-md shadow-blue-600/10 active:scale-95 transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? "Starting..." : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

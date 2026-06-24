import { showToast } from "@/utils/toast";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "shared/ui/AppIcon";
import { useAuth } from "@/hooks/useAuth";

const MODULE_NAMES: Record<string, string> = {
  "academic-years": "Academic Years Setup",
  classes: "Classes Setup",
  teachers: "Teachers Directory",
  students: "Students Directory",
  subjects: "Subjects Configuration",
  homework: "Homework & Assignments",
  exams: "Exam Management",
  tests: "Class Tests",
  results: "Results & Marksheets",
  "question-papers": "Question Papers Generator",
  "question-bank": "Question Bank Repository",
  "academic-analytics": "Academic Analytics",
  attendance: "Attendance Tracking",
  leave: "Leave Management",
  timetable: "Timetable Scheduler",
  behavior: "Behavior Tracking & Incident Reports",
  fee: "Fee & Invoicing Collection",
  announcements: "School Announcements & Noticeboards",
  conversations: "Instant Conversations & Chat",
  "live-classes": "Live Classes Integration (Jitsi)",
  certificates: "Student Certificate Generator",
  templates: "Template Designer",
  schedule: "Event Calendar Schedules",
};

export function CustomPlanBuilder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [savingPlan, setSavingPlan] = useState(false);
  const [studentLimit, setStudentLimit] = useState<number>(100);

  useEffect(() => {
    fetch("/api/subscription/current", {
      headers: {
        authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
      },
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload?.ok && payload?.data) {
          const data = payload.data;
          if (data.available_packages) {
            setAvailablePackages(data.available_packages);
          }
          if (data.selected_packages) {
            setSelectedItems(data.selected_packages);
          }
          if (data.students_limit && data.students_limit > 0) {
            setStudentLimit(data.students_limit);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleModule = (pkgId: string, moduleId: string, mandatory: boolean) => {
    if (mandatory) return;
    setSelectedItems((prev) => {
      let next = [...prev];
      if (next.includes(moduleId)) {
        next = next.filter((x) => x !== moduleId);
        next = next.filter((x) => x !== pkgId);
      } else {
        next.push(moduleId);
        const pkg = availablePackages.find((p) => p.id === pkgId);
        if (pkg) {
          const allModulesChecked = pkg.modules.every((m: string) => next.includes(m));
          if (allModulesChecked && !next.includes(pkgId)) {
            next.push(pkgId);
          }
        }
      }
      return next;
    });
  };

  const handleTogglePackage = (pkgId: string, mandatory: boolean) => {
    if (mandatory) return;
    const pkg = availablePackages.find((p) => p.id === pkgId);
    if (!pkg) return;

    setSelectedItems((prev) => {
      let next = [...prev];
      const isSelected = next.includes(pkgId);
      if (isSelected) {
        next = next.filter((x) => x !== pkgId && !pkg.modules.includes(x));
      } else {
        if (!next.includes(pkgId)) next.push(pkgId);
        pkg.modules.forEach((m: string) => {
          if (!next.includes(m)) next.push(m);
        });
      }
      return next;
    });
  };

  const totalRateForDisplay = useMemo(() => {
    if (!availablePackages.length) return 0;
    let totalRate = 0;
    availablePackages.forEach((pkg) => {
      if (pkg.mandatory) {
        totalRate += pkg.rate;
        return;
      }
      let pkgSelectedRate = 0;
      pkg.modules.forEach((m: string) => {
        if (selectedItems.includes(m)) {
          const rate = m === "fee" ? 4 : 1;
          pkgSelectedRate += rate;
        }
      });
      if (pkgSelectedRate > pkg.rate) {
        pkgSelectedRate = pkg.rate;
      }
      totalRate += pkgSelectedRate;
    });
    return totalRate;
  }, [availablePackages, selectedItems]);

  const isAllSelected = useMemo(() => {
    if (!availablePackages.length) return false;
    return availablePackages.every((pkg) =>
      pkg.modules.every((m: string) => selectedItems.includes(m))
    );
  }, [availablePackages, selectedItems]);

  const handleSelectAllToggle = () => {
    if (isAllSelected) {
      const mandatoryIds: string[] = [];
      availablePackages.forEach((pkg) => {
        if (pkg.mandatory) {
          if (!mandatoryIds.includes(pkg.id)) mandatoryIds.push(pkg.id);
          pkg.modules.forEach((m: string) => {
            if (!mandatoryIds.includes(m)) mandatoryIds.push(m);
          });
        }
      });
      setSelectedItems(mandatoryIds);
    } else {
      const allIds: string[] = [];
      availablePackages.forEach((pkg) => {
        if (!allIds.includes(pkg.id)) allIds.push(pkg.id);
        pkg.modules.forEach((m: string) => {
          if (!allIds.includes(m)) allIds.push(m);
        });
      });
      setSelectedItems(allIds);
    }
  };

  const estimatedCost = useMemo(() => {
    const cost = studentLimit * totalRateForDisplay;
    return cost < 500 ? 500 : cost;
  }, [studentLimit, totalRateForDisplay]);

  const handleSavePlan = async () => {
    setSavingPlan(true);
    try {
      const response = await fetch("/api/subscription/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
        },
        body: JSON.stringify({
          selected_packages: selectedItems,
          student_limit: studentLimit,
        }),
      });
      const payload = await response.json();
      if (payload?.ok) {
        navigate("/admin/dashboard");
      } else {
        showToast("Failed to save plan. Please try again.", "info");
      }
    } catch {
      showToast("Failed to save plan. Please check your network.", "info");
    } finally {
      setSavingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-start justify-center p-4 py-12">
      <div className="bg-white rounded-[32px] border border-slate-100 max-w-4xl w-full shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100/80 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <AppIcon name="Settings" size={24} className="text-blue-600" />
              Build Your Own Plan
            </h3>
            <p className="text-xs text-slate-500 font-bold mt-1">
              Customize features and modules to activate for your school. You can change this configuration anytime.
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/subscription")}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <AppIcon name="X" size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-6 flex-1">
          {/* Sticky Controls Panel */}
          <div className="bg-white/95 pb-6 pt-2 border-b border-slate-100 -mx-8 px-8 flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex-1 w-full">
              <label htmlFor="student-limit-input" className="block text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2">
                Expected Students Limit
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative flex-1 min-w-[140px] max-w-[200px]">
                  <AppIcon name="School" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="student-limit-input"
                    type="number"
                    min="1"
                    value={studentLimit}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setStudentLimit(isNaN(val) || val < 1 ? 1 : val);
                    }}
                    className="w-full pl-10 pr-3 py-2 text-xs font-black text-slate-800 bg-slate-50 border border-slate-200/80 rounded-2xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all focus:outline-none"
                    placeholder="100"
                  />
                </div>
                {/* Common limit presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[100, 250, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setStudentLimit(preset)}
                      className={`px-3 py-2 text-[10px] font-black rounded-xl border transition-all ${
                        studentLimit === preset
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                          : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                  <div className="mx-1.5 h-4 w-px bg-slate-200/80" />
                  <button
                    type="button"
                    onClick={handleSelectAllToggle}
                    className={`px-3 py-2 text-[10px] font-black rounded-xl border transition-all flex items-center gap-1.5 ${
                      isAllSelected
                        ? "bg-green-600 border-green-600 text-white shadow-sm"
                        : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                    }`}
                  >
                    <AppIcon name={isAllSelected ? "CheckSquare" : "Square"} size={12} />
                    {isAllSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Display */}
            <div className="w-full md:w-auto min-w-[260px] bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-4 rounded-2xl shadow-lg shadow-blue-600/10 flex flex-col justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-200">Estimated Monthly Cost</p>
                <p className="text-2xl font-black tracking-tight mt-0.5 text-white">
                  PKR {estimatedCost.toLocaleString()}
                  <span className="text-[10px] font-bold text-blue-200/80 ml-1">/ mo</span>
                </p>
              </div>
              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-center text-[9px] font-bold text-blue-100/90">
                <span>Per Student Cost: PKR {totalRateForDisplay}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {availablePackages.map((pkg) => {
              const isPkgChecked = selectedItems.includes(pkg.id);
              return (
                <div key={pkg.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/30 hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={pkg.mandatory}
                        checked={isPkgChecked || pkg.mandatory}
                        onChange={() => handleTogglePackage(pkg.id, pkg.mandatory)}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <span className="text-sm font-black text-slate-800 flex items-center gap-2">
                          {pkg.name}
                          {pkg.mandatory && (
                            <span className="bg-blue-100 text-blue-700 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Required
                            </span>
                          )}
                        </span>
                      </div>
                    </label>
                    {pkg.mandatory && (
                      <span className="text-[10px] font-black text-slate-400 uppercase bg-white border border-slate-100 px-2.5 py-1 rounded-lg">
                        Included
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-8">
                    {pkg.modules.map((m: string) => {
                      const isModChecked = selectedItems.includes(m);
                      return (
                        <label
                          key={m}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all cursor-pointer text-xs font-bold ${
                            pkg.mandatory
                              ? "bg-slate-50 border-slate-100 text-slate-400 cursor-default"
                              : isModChecked
                                ? "bg-blue-50/40 border-blue-200 text-blue-800"
                                : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            disabled={pkg.mandatory}
                            checked={isModChecked || pkg.mandatory}
                            onChange={() => handleToggleModule(pkg.id, m, pkg.mandatory)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 accent-blue-600 cursor-pointer disabled:cursor-default"
                          />
                          {MODULE_NAMES[m] || m}
                        </label>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-slate-50 border-t border-slate-100/80 flex flex-col md:flex-row items-center justify-end gap-4">
          <button
            type="button"
            disabled={savingPlan}
            onClick={handleSavePlan}
            className="w-full md:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-blue-600/15 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {savingPlan ? "Activating Modules..." : "Subscribe & Continue to Dashboard"}
            {!savingPlan && <AppIcon name="ArrowRight" size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

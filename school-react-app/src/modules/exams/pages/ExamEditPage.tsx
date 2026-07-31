import { AppIcon } from "shared/ui/AppIcon";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { Skeleton, DataState } from "@/components/ui";
import { useSafeAsync } from "@/hooks/useSafeAsync";
import { serviceRequest } from "@/services/service-client";
import { ExamForm } from "../components/ExamForm";
import { useExams } from "../hooks/useExams";
import { getExam } from "../services/exam.service";
import { ExamFormInput, ExamRow } from "../types/exam.types";

export function ExamEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const pathname = useLocation().pathname;
  const { updateExam } = useExams();
  
  const { state: classState, run: runClasses } = useSafeAsync<any[]>();
  const { state: examState, run: runExam } = useSafeAsync<ExamRow>();

  const loadData = useCallback(() => {
    void runClasses(async () => {
      const result = await serviceRequest<any>("/api/classes");
      if (!result.ok) throw new Error(result.error?.message || result.message || "Failed to load classes");
      const data = result.data;
      if (Array.isArray(data)) return data;
      return data?.data || data?.items || [];
    });

    if (id) {
      void runExam(async () => {
        const result = await getExam(id);
        if (!result.ok) throw new Error(result.error?.message || result.message || "Failed to load exam");
        return result.data;
      });
    }
  }, [runClasses, runExam, id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const isDependencyLoading =
    classState.status === "idle" || classState.status === "loading" ||
    examState.status === "idle" || examState.status === "loading";

  const isError = classState.status === "error" || examState.status === "error";

  async function handleUpdate(examId: string, input: Partial<ExamFormInput>) {
    const result = await updateExam(examId, input);
    if (result.ok) {
      const basePath = pathname.includes("/teacher") ? "/teacher/exams" : "/admin/exams";
      navigate(basePath);
    }
    return result;
  }

  return (
    <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6">
      <div className="mb-3 flex items-center justify-between">
        <Link
          to="/admin/exams"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-slate-400 normal-case hover:text-slate-900 transition-all group"
        >
          <AppIcon name="ArrowLeft" size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Return to Exams
        </Link>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 normal-case ">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Assessment Management
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT SIDE: Main Form Container (70%) */}
        <div className="w-full lg:w-[68%]">
          <div className="bg-white border border-slate-200 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ring-1 ring-slate-900/5 transition-all">
            {/* Premium Internal Header */}
            <div className="relative px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50/50 to-white">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-600 text-white shadow-lg shadow-amber-600/20">
                  <AppIcon name="Edit" size={18} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight leading-none">Edit Exam</h2>
                  <p className="text-[10px] text-slate-500 mt-1.5 font-medium">
                    Modify exam parameters and assessment settings.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              {isError ? (
                <DataState variant="error" title="Failed to load data" message={classState.error || examState.error} />
              ) : isDependencyLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : (
                <ExamForm 
                  classes={classState.data ?? []} 
                  initialData={examState.data}
                  onUpdate={handleUpdate} 
                />
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Guidance Panel (32%) */}
        <div className="w-full lg:w-[32%] sticky top-24">
          <div className="mb-4 flex items-center gap-2 px-1">
            <AppIcon name="Sparkles" size={16} className="text-amber-500" />
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">
              Setup Intelligence
            </h3>
          </div>
          <div className="space-y-3">
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
              <h4 className="text-[11px] font-bold text-blue-900 mb-1">Architecture</h4>
              <p className="text-[10px] font-medium text-blue-700/80 leading-relaxed">
                You can attach multiple subjects to a single exam. This represents an entire
                exam session (e.g. "Mid Term") for a class, which keeps the list page clean.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

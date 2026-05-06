"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Card, Skeleton, DataState } from "../../../components/ui";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { serviceRequest } from "../../../services/service-client";
import { ExamForm } from "../components/ExamForm";
import { useExams } from "../hooks/useExams";
import { ExamFormInput } from "../types/exam.types";
import { showToast } from "../../../utils/toast";

export function ExamCreatePage() {
  const router = useRouter();
  const pathname = usePathname();
  const { addExam } = useExams();
  const { state: classState, run: runClasses } = useSafeAsync<Array<{ _id: string; name: string }>>();

  const loadClasses = useCallback(() => {
    return runClasses(async () => {
      const result = await serviceRequest<Array<{ _id: string; name: string }>>("/api/classes");
      if (!result.ok) {
        throw new Error(result.error.message || "Failed to load classes");
      }
      return result.data;
    });
  }, [runClasses]);

  useEffect(() => {
    void loadClasses().catch(() => {});
  }, [loadClasses]);

  const isDependencyLoading = classState.status === "idle" || classState.status === "loading";
  const classOptions = (classState.data ?? []).map((item) => ({ id: item._id, label: item.name }));

  async function handleCreate(input: ExamFormInput) {
    const result = await addExam(input);
    if (result.ok) {
      showToast("Exam scheduled successfully", "success");
      const basePath = pathname.includes("/teacher") ? "/teacher/exams" : "/admin/exams";
      router.push(basePath);
      router.refresh();
    }
    return result;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex flex-col gap-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Schedule New Examination</h2>
        <p className="text-sm font-medium text-slate-500">
          Define assessment criteria, target class, and schedule the event.
        </p>
      </div>

      <Card className="p-6 md:p-8">
        {classState.status === "error" ? (
          <DataState variant="error" title="Failed to load classes" message={classState.error} />
        ) : isDependencyLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <ExamForm classOptions={classOptions} onCreate={handleCreate} />
        )}
      </Card>
    </div>
  );
}

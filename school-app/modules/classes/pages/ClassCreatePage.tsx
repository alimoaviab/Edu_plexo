"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, Skeleton, DataState } from "../../../components/ui";
import { useAcademicYears } from "../../academicYear/hooks/useAcademicYears";
import { useTeachers } from "../../teachers/hooks/useTeachers";
import { useSubjects } from "../../subjects/hooks/useSubjects";
import { ClassForm } from "../components/ClassForm";
import { useClasses } from "../hooks/useClasses";
import { ClassFormInput } from "../types/class.types";
import { showToast } from "../../../utils/toast";

export function ClassCreatePage() {
  const router = useRouter();
  const { addClass } = useClasses();
  const { state: academicYearState } = useAcademicYears();
  const { state: teacherState } = useTeachers();
  const {
    data: subjects,
    isLoading: subjectsLoading,
    error: subjectsError,
    createSubject,
    refresh: refreshSubjects
  } = useSubjects();

  const isDependencyLoading =
    academicYearState.status === "idle" ||
    academicYearState.status === "loading" ||
    teacherState.status === "idle" ||
    teacherState.status === "loading" ||
    subjectsLoading;

  const hasAcademicYears = (academicYearState.data?.data ?? []).length > 0;

  const academyCareOptions = (academicYearState.data?.data ?? []).map((item) => ({
    id: item._id,
    label: item.year,
  }));

  const teacherOptions = (teacherState.data ?? []).map((item) => ({
    id: item._id,
    label: `${item.first_name} ${item.last_name}`.trim(),
  }));

  async function handleCreate(input: ClassFormInput) {
    const result = await addClass(input);
    if (result && (result as { ok?: boolean }).ok !== false) {
      showToast("Academic unit initialized successfully", "success");
      router.push("/admin/classes");
      router.refresh();
    }
    return result;
  }

  async function handleQuickAddSubject(name: string) {
    try {
      await createSubject({
        name,
        code: name.substring(0, 3).toUpperCase(),
        status: "active"
      });
      showToast(`Subject "${name}" added to curriculum`, "success");
      await refreshSubjects();
    } catch (error: any) {
      showToast(error.message || "Failed to add subject", "error");
      throw error;
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Create Class</h1>
        <p className="text-slate-500 font-medium">
          Set up a new class with subjects and grading.
        </p>
      </div>


      <div className="premium-card p-0 overflow-hidden border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl">
        <div className="p-6 md:p-10">
          {academicYearState.status === "error" ? (
            <DataState variant="error" title="Infrastructure Sync Failed" message={academicYearState.error} />
          ) : teacherState.status === "error" ? (
            <DataState variant="error" title="Faculty Data Unavailable" message={teacherState.error} />
          ) : subjectsError ? (
            <DataState variant="error" title="Curriculum Error" message={subjectsError} />
          ) : !isDependencyLoading && !hasAcademicYears ? (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 border border-amber-100">
                <span className="material-symbols-outlined text-3xl font-black">priority_high</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Academic Cycle Required</h3>
              <p className="text-sm text-slate-500 mb-6 max-w-xs">Initialization cannot proceed without an active academic year configuration.</p>
              <Link 
                href="/admin/academic-years"
                className="h-11 px-6 rounded-xl bg-slate-900 text-[11px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-lg active:scale-95"
              >
                Create Academic Session
              </Link>
            </div>
          ) : isDependencyLoading ? (
            <div className="space-y-8 py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 rounded" />
                  <Skeleton className="h-12 w-full rounded-xl" />
                </div>
              </div>
              <Skeleton className="h-32 w-full rounded-xl" />
              <div className="flex justify-end pt-4">
                 <Skeleton className="h-12 w-48 rounded-xl" />
              </div>
            </div>
          ) : (
            <ClassForm
              onCreate={handleCreate}
              onAddSubject={handleQuickAddSubject}
              academyCareOptions={academyCareOptions}
              teacherOptions={teacherOptions}
              subjectOptions={(subjects ?? [])
                .filter((item) => item.status === "active")
                .map((item) => ({ id: item._id, label: item.name }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}



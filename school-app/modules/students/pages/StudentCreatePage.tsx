"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, Skeleton, DataState } from "../../../components/ui";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { serviceRequest } from "../../../services/service-client";
import { StudentForm } from "../components/StudentForm";
import { useStudents } from "../hooks/useStudents";
import { StudentFormInput } from "../types/student.types";
import { showToast } from "../../../utils/toast";

export function StudentCreatePage() {
  const router = useRouter();
  const { addStudent } = useStudents();
  const { state: classState, run } = useSafeAsync<Array<{ _id: string; name: string }>>();

  const loadClasses = useCallback(() => {
    return run(async () => {
      const result = await serviceRequest<Array<{ _id: string; name: string }>>("/api/classes");
      if (!result.ok) {
        throw new Error(result.error.message || "Failed to load classes");
      }
      return result.data;
    });
  }, [run]);

  useEffect(() => {
    void loadClasses().catch(() => {});
  }, [loadClasses]);

  const isClassDependencyLoading = classState.status === "idle" || classState.status === "loading";
  const classOptions = (classState.data ?? []).map((item) => ({ id: item._id, label: item.name }));

  async function handleCreate(input: StudentFormInput) {
    const result = await addStudent(input);
    if (result && (result as { ok?: boolean }).ok !== false) {
      showToast("Student enrolled successfully", "success");
      router.push("/admin/students");
      router.refresh();
    }
    return result;
  }

  return (
    <div className="w-full py-2 px-6">
      <Card className="p-4 md:p-6 border-slate-200/60 bg-white shadow-2xl shadow-slate-200/50 rounded-3xl">

        {classState.status === "error" ? (
          <DataState variant="error" title="Failed to load classes" message={classState.error} />
        ) : isClassDependencyLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ) : (
          <StudentForm onCreate={handleCreate} classOptions={classOptions} />
        )}
      </Card>
    </div>
  );
}

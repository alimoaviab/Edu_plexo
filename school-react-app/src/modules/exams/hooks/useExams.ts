import { useCallback, useEffect, useMemo, useState } from "react";
import { useSafeAsync } from "@/hooks/useSafeAsync";
import { showToast } from "@/utils/toast";
import { ExamFormInput, ExamRow } from "../types/exam.types";
import { bindRefresh, publish } from "@/services/data-bus";
import * as service from "../services/exam.service";

export interface UseExamsParams {
    class_id?: string;
    subject?: string;
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export interface ExamListMeta {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

const DEFAULT_META: ExamListMeta = { total: 0, page: 1, limit: 0, pages: 1 };

export function useExams(params: UseExamsParams = {}) {
  const { state, run, setState } = useSafeAsync<ExamRow[]>();
  const [meta, setMeta] = useState<ExamListMeta>(DEFAULT_META);

  const paramsKey = useMemo(
      () => JSON.stringify({
          class_id: params.class_id,
          subject: params.subject,
          page: params.page,
          limit: params.limit,
          status: params.status,
          search: params.search,
      }),
      [params.class_id, params.subject, params.page, params.limit, params.status, params.search]
  );

  const loadExams = useCallback(() => {
    return run(async () => {
      const result = await service.listExams(params);
      if (!result.ok) {
        throw new Error(result.error?.message || result.message || "Failed to load exams");
      }

      const raw = result.data as any;
      if (raw && typeof raw === "object" && "items" in raw) {
          setMeta(raw.meta || DEFAULT_META);
          return raw.items as ExamRow[];
      }
      setMeta(DEFAULT_META);
      return (raw as ExamRow[]) || [];
    });
  }, [run, paramsKey]);

  const addExam = useCallback(
    async (input: ExamFormInput) => {
      const result = await service.createExam(input);
      if (!result.ok) {
        showToast(result.error?.message || result.message || "Could not create exam. Please check the details and try again.", "error");
        return result;
      }

      showToast("Exam scheduled.", "success");
      await loadExams();
      publish("exams");
      return result;
    },
    [loadExams]
  );

  const updateExam = useCallback(
    async (id: string, input: Partial<ExamFormInput>) => {
      const result = await service.updateExam(id, input);
      if (!result.ok) {
        showToast(result.error?.message || result.message || "Could not update exam. Please check your changes and try again.", "error");
        return result;
      }

      showToast("Exam updated.", "success");
      await loadExams();
      publish("exams");
      return result;
    },
    [loadExams]
  );

  const deleteExam = useCallback(
    async (id: string) => {
      const result = await service.deleteExam(id);
      if (!result.ok) {
        showToast(result.error?.message || result.message || "Could not delete exam. It may have results linked to it.", "error");
        return result;
      }

      showToast("Exam deleted.", "success");
      await loadExams();
      publish("exams");
      return result;
    },
    [loadExams]
  );

  useEffect(() => {
    void loadExams().catch(() => {});
    const offClasses = bindRefresh("classes", loadExams);
    const offExams = bindRefresh("exams", loadExams);
    return () => {
      offClasses();
      offExams();
    };
  }, [loadExams]);

  return { state, meta, setState, addExam, updateExam, deleteExam, refresh: loadExams };
}
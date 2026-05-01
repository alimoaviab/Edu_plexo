"use client";

import { useCallback, useEffect } from "react";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { showToast } from "../../../utils/toast";
import { ExamFormInput, ExamRow } from "../types/exam.types";
import * as service from "../services/exam.service";

export function useExams() {
  const { state, run } = useSafeAsync<ExamRow[]>();

  const loadExams = useCallback(() => {
    return run(async () => {
      const result = await service.listExams();
      if (!result.ok) {
        throw new Error(result.error.message || "Failed to load exams");
      }

      return result.data;
    });
  }, [run]);

  const addExam = useCallback(
    async (input: ExamFormInput) => {
      const result = await service.createExam(input);
      if (!result.ok) {
        showToast(result.error.message || "Failed to create exam", "error");
        return result;
      }

      showToast("Exam scheduled.", "success");
      await loadExams();
      return result;
    },
    [loadExams]
  );

  const updateExam = useCallback(
    async (id: string, input: Partial<ExamFormInput>) => {
      const result = await service.updateExam(id, input);
      if (!result.ok) {
        showToast(result.error.message || "Failed to update exam", "error");
        return result;
      }

      showToast("Exam updated.", "success");
      await loadExams();
      return result;
    },
    [loadExams]
  );

  const deleteExam = useCallback(
    async (id: string) => {
      const result = await service.deleteExam(id);
      if (!result.ok) {
        showToast(result.error.message || "Failed to delete exam", "error");
        return result;
      }

      showToast("Exam deleted.", "success");
      await loadExams();
      return result;
    },
    [loadExams]
  );

  useEffect(() => {
    void loadExams().catch(() => {
      // Error state is already managed by useSafeAsync.
    });
  }, [loadExams]);

  return { state, addExam, updateExam, deleteExam };
}
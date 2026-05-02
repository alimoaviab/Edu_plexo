"use client";

import { useCallback, useEffect } from "react";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { showToast } from "../../../utils/toast";
import { TimetableFormInput, TimetableRecord } from "../types/timetable.types";
import * as service from "../services/timetable.service";

export function useTimetable(filters?: { class_id?: string; teacher_id?: string; day?: string }) {
  const { state, run } = useSafeAsync<TimetableRecord[]>();

  const loadTimetable = useCallback(() => {
    return run(async () => {
      const result = await service.listTimetable(filters);
      if (!result.success) {
        throw new Error(result.message || "Failed to load timetable");
      }
      return result.data || [];
    });
  }, [run, filters]);

  const addTimetable = useCallback(
    async (input: TimetableFormInput) => {
      const result = await service.createTimetable(input);
      if (!result.success) {
        showToast(result.message || "Failed to create timetable entry", "error");
        return result;
      }
      showToast("Timetable entry created.", "success");
      await loadTimetable();
      return result;
    },
    [loadTimetable]
  );

  const updateTimetable = useCallback(
    async (id: string, input: Partial<TimetableFormInput>) => {
      const result = await service.updateTimetable(id, input);
      if (!result.success) {
        showToast(result.message || "Failed to update timetable entry", "error");
        return result;
      }
      showToast("Timetable entry updated.", "success");
      await loadTimetable();
      return result;
    },
    [loadTimetable]
  );

  const deleteTimetable = useCallback(
    async (id: string) => {
      const result = await service.deleteTimetable(id);
      if (!result.success) {
        showToast(result.message || "Failed to delete timetable entry", "error");
        return result;
      }
      showToast("Timetable entry deleted.", "success");
      await loadTimetable();
      return result;
    },
    [loadTimetable]
  );

  useEffect(() => {
    void loadTimetable().catch(() => {});
  }, [loadTimetable]);

  return { state, addTimetable, updateTimetable, deleteTimetable, refresh: loadTimetable };
}

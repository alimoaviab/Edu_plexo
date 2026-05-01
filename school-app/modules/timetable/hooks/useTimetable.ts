"use client";

import { useCallback, useEffect } from "react";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { showToast } from "../../../utils/toast";
import { TimetableFormInput, TimetableRecordRow } from "../types/timetable.types";
import * as service from "../services/timetable.service";

export function useTimetable() {
  const { state, run } = useSafeAsync<TimetableRecordRow[]>();

  const loadTimetable = useCallback((classId?: string) => {
    return run(async () => {
      const result = await service.listTimetable(classId);
      if (!result.ok) {
        throw new Error(result.error.message || "Failed to load timetable");
      }
      return result.data;
    });
  }, [run]);

  const addTimetable = useCallback(
    async (input: TimetableFormInput) => {
      const result = await service.createTimetable(input);
      if (!result.ok) {
        showToast(result.error.message || "Failed to create timetable entry", "error");
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
      if (!result.ok) {
        showToast(result.error.message || "Failed to update", "error");
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
      if (!result.ok) {
        showToast(result.error.message || "Failed to delete", "error");
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

  return { state, addTimetable, updateTimetable, deleteTimetable };
}

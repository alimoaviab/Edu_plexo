"use client";

import { useCallback, useEffect } from "react";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { showToast } from "../../../utils/toast";
import { ClassFormInput, ClassRow } from "../types/class.types";
import * as service from "../services/class.service";

export function useClasses() {
    const { state, run } = useSafeAsync<ClassRow[]>();

    const loadClasses = useCallback(() => {
        return run(async () => {
            const result = await service.listClasses();
            if (!result.ok) {
                throw new Error(result.error.message || "Failed to load classes");
            }

            return result.data;
        });
    }, [run]);

    const addClass = useCallback(
        async (input: ClassFormInput) => {
            const result = await service.createClass(input);
            if (!result.ok) {
                showToast(result.error.message, "error");
                return result;
            }

            showToast("Class created.", "success");
            await loadClasses();
            return result;
        },
        [loadClasses]
    );

    const updateClass = useCallback(
        async (id: string, input: Partial<ClassFormInput>) => {
            const result = await service.updateClass(id, input);
            if (!result.ok) {
                showToast(result.error.message || "Failed to update class", "error");
                return result;
            }

            showToast("Class updated.", "success");
            await loadClasses();
            return result;
        },
        [loadClasses]
    );

    const deleteClass = useCallback(
        async (id: string) => {
            const result = await service.deleteClass(id);
            if (!result.ok) {
                showToast(result.error.message || "Failed to delete class", "error");
                return result;
            }

            showToast("Class deleted.", "success");
            await loadClasses();
            return result;
        },
        [loadClasses]
    );

    useEffect(() => {
        void loadClasses().catch(() => {
            // Error state is already managed by useSafeAsync.
        });
    }, [loadClasses]);

    return { state, addClass, updateClass, deleteClass };
}

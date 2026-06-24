import { useCallback, useEffect } from "react";
import { useSafeAsync } from "@/hooks/useSafeAsync";
import { showToast } from "@/utils/toast";
import { bindRefresh, publish } from "@/services/data-bus";
import * as service from "../services/section.service";

export function useSections() {
    const { state, run } = useSafeAsync<service.SectionListResponse>();

    const loadSections = useCallback(() => {
        return run(async () => {
            const result = await service.listSections();
            if (!result.success) {
                throw new Error(result.message || "Failed to load sections");
            }
            return result.data;
        });
    }, [run]);

    const addSection = useCallback(
        async (input: { name: string; academic_year_id?: string }) => {
            const result = await service.createSection(input);
            if (!result.success) {
                showToast(result.message || "Could not create section.", "error");
                return result;
            }

            showToast("Section created.", "success");
            await loadSections();
            publish("sections");
            return result;
        },
        [loadSections]
    );

    const updateSection = useCallback(
        async (id: string, input: { name: string }) => {
            const result = await service.updateSection(id, input);
            if (!result.success) {
                showToast(result.message || "Could not update section.", "error");
                return result;
            }

            showToast("Section updated.", "success");
            await loadSections();
            publish("sections");
            return result;
        },
        [loadSections]
    );

    const deleteSection = useCallback(
        async (id: string) => {
            const result = await service.deleteSection(id);
            if (!result.success) {
                showToast(result.message || "Could not delete section.", "error");
                return result;
            }

            showToast("Section deleted.", "success");
            await loadSections();
            publish("sections");
            return result;
        },
        [loadSections]
    );

    useEffect(() => {
        void loadSections().catch(() => {});
        return bindRefresh("sections", loadSections);
    }, [loadSections]);

    return { state, addSection, updateSection, deleteSection, refresh: loadSections };
}

"use client";

import { useCallback, useEffect } from "react";
import { useSafeAsync } from "../../../hooks/useSafeAsync";
import { showToast } from "../../../utils/toast";
import { BehaviorFormInput, BehaviorRecordRow } from "../types/behavior.types";
import * as service from "../services/behavior.service";

export function useBehavior() {
	const { state, run } = useSafeAsync<BehaviorRecordRow[]>();

	const loadBehavior = useCallback(() => {
		return run(async () => {
			const result = await service.listBehavior();
			if (!result.ok) {
				throw new Error(result.error.message || "Failed to load behavior records");
			}
			return result.data;
		});
	}, [run]);

	const addBehavior = useCallback(
		async (input: BehaviorFormInput) => {
			const result = await service.createBehavior(input);
			if (!result.ok) {
				showToast(result.error.message || "Failed to create behavior record", "error");
				return result;
			}
			showToast("Behavior record created.", "success");
			await loadBehavior();
			return result;
		},
		[loadBehavior]
	);

	const updateBehavior = useCallback(
		async (id: string, input: Partial<BehaviorFormInput>) => {
			const result = await service.updateBehavior(id, input);
			if (!result.ok) {
				showToast(result.error.message || "Failed to update behavior", "error");
				return result;
			}
			showToast("Behavior record updated.", "success");
			await loadBehavior();
			return result;
		},
		[loadBehavior]
	);

	const deleteBehavior = useCallback(
		async (id: string) => {
			const result = await service.deleteBehavior(id);
			if (!result.ok) {
				showToast(result.error.message || "Failed to delete behavior", "error");
				return result;
			}
			showToast("Behavior record deleted.", "success");
			await loadBehavior();
			return result;
		},
		[loadBehavior]
	);

	useEffect(() => {
		void loadBehavior().catch(() => {});
	}, [loadBehavior]);

	return { state, addBehavior, updateBehavior, deleteBehavior };
}

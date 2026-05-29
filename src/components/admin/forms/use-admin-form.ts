"use client";

import { useCallback, useEffect, useState } from "react";

interface UseAdminFormOptions<T> {
	onSave?: (data: T) => Promise<void>;
}

export function useAdminForm<T>(initialState: T, options?: UseAdminFormOptions<T>) {
	const [data, setData] = useState(initialState);
	const [baseline, setBaseline] = useState(initialState);

	useEffect(() => {
		setData(initialState);
		setBaseline(initialState);
	}, [initialState]);
	const [saveMessage, setSaveMessage] = useState<string | null>(null);
	const [isSaving, setIsSaving] = useState(false);

	const isDirty = JSON.stringify(data) !== JSON.stringify(baseline);

	const update = useCallback((partial: Partial<T>) => {
		setData((current) => ({ ...current, ...partial }));
		setSaveMessage(null);
	}, []);

	const setField = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			setData((current) => ({ ...current, [key]: value }));
			setSaveMessage(null);
		},
		[],
	);

	const save = useCallback(async () => {
		setIsSaving(true);
		setSaveMessage(null);
		try {
			if (options?.onSave) {
				await options.onSave(data);
				setBaseline(data);
				setSaveMessage("Changes saved");
			} else {
				await new Promise((resolve) => setTimeout(resolve, 400));
				setBaseline(data);
				setSaveMessage("Changes saved (preview only — not persisted yet)");
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to save changes";
			setSaveMessage(message);
		} finally {
			setIsSaving(false);
		}
	}, [data, options?.onSave]);

	const discard = useCallback(() => {
		setData(baseline);
		setSaveMessage(null);
	}, [baseline]);

	const commit = useCallback((message?: string) => {
		setBaseline(data);
		setSaveMessage(message ?? "Changes saved");
		setIsSaving(false);
	}, [data]);

	return {
		data,
		setData,
		setField,
		update,
		isDirty,
		isSaving,
		saveMessage,
		save,
		discard,
		commit,
	};
}

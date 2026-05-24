"use client";

import { useCallback, useState } from "react";

export function useAdminForm<T>(initialState: T) {
	const [data, setData] = useState(initialState);
	const [baseline, setBaseline] = useState(initialState);
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
		await new Promise((resolve) => setTimeout(resolve, 400));
		setBaseline(data);
		setSaveMessage("Changes saved (preview only — not persisted yet)");
		setIsSaving(false);
	}, [data]);

	const discard = useCallback(() => {
		setData(baseline);
		setSaveMessage(null);
	}, [baseline]);

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
	};
}

"use client";

interface AdminStickySaveBarProps {
	isDirty: boolean;
	isSaving?: boolean;
	saveMessage?: string | null;
	onSave: () => void;
	onDiscard: () => void;
}

export function AdminStickySaveBar({
	isDirty,
	isSaving = false,
	saveMessage,
	onSave,
	onDiscard,
}: AdminStickySaveBarProps) {
	return (
		<div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-luxinc-border/50 bg-[#080808]/95 px-4 py-3 backdrop-blur-sm lg:-mx-5 lg:px-5">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<p className="font-sans text-sm text-luxinc-text-muted">
					{saveMessage ? (
						<span className="text-luxinc-gold">{saveMessage}</span>
					) : isDirty ? (
						"You have unsaved changes"
					) : (
						"All changes saved"
					)}
				</p>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={onDiscard}
						disabled={!isDirty || isSaving}
						className="inline-flex h-10 items-center justify-center rounded-md border border-luxinc-border px-5 font-sans text-sm text-luxinc-text transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold disabled:cursor-not-allowed disabled:opacity-40"
					>
						Discard
					</button>
					<button
						type="button"
						onClick={onSave}
						disabled={!isDirty || isSaving}
						className="inline-flex h-10 items-center justify-center rounded-md border border-luxinc-gold bg-luxinc-gold px-5 font-sans text-sm font-semibold text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted disabled:cursor-not-allowed disabled:opacity-40"
					>
						{isSaving ? "Saving…" : "Save changes"}
					</button>
				</div>
			</div>
		</div>
	);
}

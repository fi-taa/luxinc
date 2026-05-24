"use client";

import { Plus, Trash2 } from "lucide-react";

interface AdminRepeaterProps<T> {
	label: string;
	items: T[];
	onChange: (items: T[]) => void;
	createItem: () => T;
	renderItem: (
		item: T,
		index: number,
		update: (patch: Partial<T>) => void,
	) => React.ReactNode;
	getKey: (item: T, index: number) => string;
	addLabel?: string;
	emptyMessage?: string;
}

export function AdminRepeater<T>({
	label,
	items,
	onChange,
	createItem,
	renderItem,
	getKey,
	addLabel = "Add",
	emptyMessage = "No items yet. Add one to get started.",
}: AdminRepeaterProps<T>) {
	function updateItem(index: number, patch: Partial<T>) {
		onChange(
			items.map((item, itemIndex) =>
				itemIndex === index ? { ...item, ...patch } : item,
			),
		);
	}

	function removeItem(index: number) {
		onChange(items.filter((_, itemIndex) => itemIndex !== index));
	}

	function addItem() {
		onChange([...items, createItem()]);
	}

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between gap-4">
				<h3 className="font-sans text-sm font-semibold text-luxinc-text">
					{label}
				</h3>
				<button
					type="button"
					onClick={addItem}
					className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-luxinc-gold/40 bg-luxinc-gold/10 px-3 font-sans text-xs font-medium text-luxinc-gold transition-colors hover:border-luxinc-gold hover:bg-luxinc-gold/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				>
					<Plus className="size-3.5" aria-hidden />
					{addLabel}
				</button>
			</div>
			{items.length === 0 ? (
				<div className="rounded-sm border border-dashed border-luxinc-border/60 bg-[#0c0c0c] px-4 py-8 text-center">
					<p className="font-sans text-sm text-luxinc-text-muted">
						{emptyMessage}
					</p>
					<button
						type="button"
						onClick={addItem}
						className="mt-3 inline-flex h-8 items-center gap-1.5 rounded-sm bg-luxinc-gold px-3 font-sans text-xs font-semibold text-luxinc-bg transition-colors hover:bg-luxinc-gold-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
					>
						<Plus className="size-3.5" aria-hidden />
						{addLabel}
					</button>
				</div>
			) : (
				<div className="space-y-4">
					{items.map((item, index) => (
						<div
							key={getKey(item, index)}
							className="rounded-sm border border-luxinc-border/50 bg-[#0c0c0c] p-4"
						>
							<div className="mb-4 flex items-center justify-between">
								<span className="font-sans text-xs text-luxinc-text-muted">
									{label} {index + 1}
								</span>
								<button
									type="button"
									onClick={() => removeItem(index)}
									className="inline-flex items-center gap-1 font-sans text-xs text-[#FF7F50] transition-colors hover:text-[#FF7F50]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
									aria-label={`Remove ${label} ${index + 1}`}
								>
									<Trash2 className="size-3.5" aria-hidden />
									Remove
								</button>
							</div>
							{renderItem(item, index, (patch) => updateItem(index, patch))}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

interface AdminToggleProps {
	id: string;
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
	description?: string;
}

export function AdminToggle({
	id,
	label,
	checked,
	onChange,
	description,
}: AdminToggleProps) {
	return (
		<div className="flex items-start justify-between gap-4">
			<div>
				<label
					htmlFor={id}
					className="block font-sans text-sm font-medium text-luxinc-text"
				>
					{label}
				</label>
				{description ? (
					<p className="mt-1 font-sans text-xs text-luxinc-text-muted">
						{description}
					</p>
				) : null}
			</div>
			<button
				id={id}
				type="button"
				role="switch"
				aria-checked={checked}
				onClick={() => onChange(!checked)}
				className={
					checked
						? "relative h-6 w-11 shrink-0 rounded-full bg-luxinc-gold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
						: "relative h-6 w-11 shrink-0 rounded-full bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				}
			>
				<span
					className={
						checked
							? "absolute top-0.5 left-0.5 size-5 translate-x-5 rounded-full bg-luxinc-bg transition-transform"
							: "absolute top-0.5 left-0.5 size-5 rounded-full bg-luxinc-text transition-transform"
					}
				/>
			</button>
		</div>
	);
}

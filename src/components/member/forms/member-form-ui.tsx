"use client";

import { Plus, X } from "lucide-react";
import { useEffect, useId, type FormEvent, type ReactNode } from "react";
import { GoldButton } from "@/components/landing/gold-button";
import { cn } from "@/lib/utils";

export const memberInputClassName =
	"h-11 w-full rounded-md border border-luxinc-border/60 bg-[#2a2a2a] px-4 font-sans text-sm text-luxinc-text placeholder:text-luxinc-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold";

export const memberLabelClassName =
	"font-sans text-xs font-semibold uppercase tracking-wide text-luxinc-gold";

interface MemberFieldProps {
	label: string;
	children: React.ReactNode;
	className?: string;
}

export function MemberField({ label, children, className }: MemberFieldProps) {
	const id = useId();
	return (
		<div className={cn("flex flex-col gap-2", className)}>
			<label htmlFor={id} className={memberLabelClassName}>
				{label}
			</label>
			<div id={id}>{children}</div>
		</div>
	);
}

interface MemberAddButtonProps {
	label: string;
	onClick: () => void;
	className?: string;
}

export function MemberAddButton({ label, onClick, className }: MemberAddButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"inline-flex h-10 items-center gap-2 rounded-md border border-luxinc-gold px-4 font-sans text-sm font-medium text-luxinc-gold transition-colors hover:bg-luxinc-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold",
				className,
			)}
		>
			<Plus className="size-4" aria-hidden />
			{label}
		</button>
	);
}

interface MemberSectionHeaderProps {
	title: string;
	addLabel: string;
	onAdd: () => void;
}

export function MemberSectionHeader({ title, addLabel, onAdd }: MemberSectionHeaderProps) {
	return (
		<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
			<h2 className="font-diphylleia text-xl font-normal text-luxinc-gold md:text-2xl">
				{title}
			</h2>
			<MemberAddButton label={addLabel} onClick={onAdd} />
		</div>
	);
}

interface MemberDialogProps {
	open: boolean;
	title: string;
	onClose: () => void;
	onSubmit: (event: FormEvent<HTMLFormElement>) => void;
	submitLabel: string;
	isSubmitting: boolean;
	error: string | null;
	children: ReactNode;
	panelClassName?: string;
}

export function MemberDialog({
	open,
	title,
	onClose,
	onSubmit,
	submitLabel,
	isSubmitting,
	error,
	children,
	panelClassName,
}: MemberDialogProps) {
	useEffect(() => {
		if (!open) return;
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") onClose();
		}
		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [open, onClose]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			<button
				type="button"
				className="absolute inset-0 bg-black/70"
				aria-label="Close dialog"
				onClick={onClose}
			/>
			<div
				role="dialog"
				aria-modal="true"
				className={cn(
					"relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-luxinc-gold/40 bg-luxinc-panel p-6 shadow-xl",
					panelClassName,
				)}
			>
				<div className="mb-6 flex items-start justify-between gap-4">
					<h3 className="font-diphylleia text-xl text-luxinc-gold">{title}</h3>
					<button
						type="button"
						onClick={onClose}
						className="flex size-10 items-center justify-center text-luxinc-text-muted transition-colors hover:text-luxinc-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
						aria-label="Close"
					>
						<X className="size-5" />
					</button>
				</div>
				<form onSubmit={onSubmit} className="flex flex-col gap-4">
					{children}
					{error ? (
						<p className="font-sans text-sm text-red-400">{error}</p>
					) : null}
					<div className="flex flex-wrap gap-3 pt-2">
						<GoldButton type="submit" variant="solid" className="min-w-[120px]">
							{isSubmitting ? "Saving…" : submitLabel}
						</GoldButton>
						<GoldButton type="button" variant="outline" onClick={onClose}>
							Cancel
						</GoldButton>
					</div>
				</form>
			</div>
		</div>
	);
}

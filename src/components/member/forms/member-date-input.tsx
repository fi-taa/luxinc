"use client";

import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { memberInputClassName } from "./member-form-ui";

export const memberDateInputClassName = cn(
	memberInputClassName,
	"[color-scheme:dark] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
);

interface MemberDateInputProps {
	id?: string;
	name?: string;
	value: string;
	onChange: (isoDate: string) => void;
	required?: boolean;
	min?: string;
	max?: string;
	disabled?: boolean;
	className?: string;
}

export function MemberDateInput({
	id,
	name,
	value,
	onChange,
	required,
	min,
	max,
	disabled,
	className,
}: MemberDateInputProps) {
	return (
		<div className="relative">
			<input
				id={id}
				name={name}
				type="date"
				value={value}
				required={required}
				min={min}
				max={max}
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
				className={cn(memberDateInputClassName, className)}
			/>
			<Calendar
				className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-luxinc-gold"
				aria-hidden
			/>
		</div>
	);
}

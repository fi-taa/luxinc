"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { memberInputClassName } from "./member-form-ui";

export const memberTimeInputClassName = cn(
	memberInputClassName,
	"[color-scheme:dark] pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0",
);

interface MemberTimeInputProps {
	id?: string;
	value: string;
	onChange: (timeValue: string) => void;
	required?: boolean;
	disabled?: boolean;
	className?: string;
}

export function MemberTimeInput({
	id,
	value,
	onChange,
	required,
	disabled,
	className,
}: MemberTimeInputProps) {
	return (
		<div className="relative">
			<input
				id={id}
				type="time"
				value={value}
				required={required}
				disabled={disabled}
				onChange={(event) => onChange(event.target.value)}
				className={cn(memberTimeInputClassName, className)}
			/>
			<Clock
				className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-luxinc-gold"
				aria-hidden
			/>
		</div>
	);
}

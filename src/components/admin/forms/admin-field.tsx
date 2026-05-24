import { cn } from "@/lib/utils";

interface AdminFieldProps {
	label: string;
	htmlFor: string;
	hint?: string;
	error?: string;
	children: React.ReactNode;
	className?: string;
}

export function AdminField({
	label,
	htmlFor,
	hint,
	error,
	children,
	className,
}: AdminFieldProps) {
	return (
		<div className={cn("space-y-2", className)}>
			<label
				htmlFor={htmlFor}
				className="block font-sans text-sm font-medium text-luxinc-text"
			>
				{label}
			</label>
			{children}
			{hint ? (
				<p className="font-sans text-xs text-luxinc-text-muted">{hint}</p>
			) : null}
			{error ? (
				<p className="font-sans text-xs text-[#FF7F50]" role="alert">
					{error}
				</p>
			) : null}
		</div>
	);
}

const inputStyles =
	"w-full border border-luxinc-border bg-luxinc-bg/80 px-3 py-2.5 font-sans text-sm text-luxinc-text placeholder:text-luxinc-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold";

interface AdminInputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
}

export function AdminInput({ className, ...props }: AdminInputProps) {
	return <input className={cn(inputStyles, className)} {...props} />;
}

interface AdminTextareaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	id: string;
}

export function AdminTextarea({ className, ...props }: AdminTextareaProps) {
	return (
		<textarea
			className={cn(inputStyles, "min-h-[100px] resize-y", className)}
			{...props}
		/>
	);
}

interface AdminSelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	id: string;
}

export function AdminSelect({ className, children, ...props }: AdminSelectProps) {
	return (
		<select className={cn(inputStyles, className)} {...props}>
			{children}
		</select>
	);
}

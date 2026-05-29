import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { site } from "@/lib/landing-content";

export default function AdminLoginPage() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#080808] px-4 text-luxinc-text">
			<div className="w-full max-w-sm rounded-sm border border-luxinc-border/50 bg-[#111111] p-6">
				<Link
					href="/"
					className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxinc-gold"
				>
					<Image
						src="/images/logo.svg"
						alt={site.name}
						width={500}
						height={500}
						className="h-9 w-auto"
					/>
				</Link>
				<p className="mt-6 inline-block rounded border border-luxinc-gold/40 bg-luxinc-gold/10 px-1.5 py-0.5 font-sans text-[10px] font-semibold tracking-wider text-luxinc-gold uppercase">
					Admin
				</p>
				<h1 className="mt-3 font-sans text-xl font-semibold text-luxinc-text">
					Sign in
				</h1>
				<p className="mt-2 font-sans text-sm text-luxinc-text-muted">
					Sign in with an admin account from Supabase Auth.
				</p>
				<Suspense fallback={null}>
					<AdminLoginForm />
				</Suspense>
			</div>
		</div>
	);
}

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
	if (!url || !anonKey) {
		return supabaseResponse;
	}

	const supabase = createServerClient(url, anonKey, {
		cookies: {
			getAll() {
				return request.cookies.getAll();
			},
			setAll(cookiesToSet) {
				for (const { name, value } of cookiesToSet) {
					request.cookies.set(name, value);
				}
				supabaseResponse = NextResponse.next({ request });
				for (const { name, value, options } of cookiesToSet) {
					supabaseResponse.cookies.set(name, value, options);
				}
			},
		},
	});

	const {
		data: { user },
	} = await supabase.auth.getUser();

	const pathname = request.nextUrl.pathname;
	if (!pathname.startsWith("/member")) {
		return supabaseResponse;
	}

	if (!user) {
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/";
		redirectUrl.searchParams.set("auth", "sign-in");
		redirectUrl.searchParams.set("next", pathname);
		return NextResponse.redirect(redirectUrl);
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role,status")
		.eq("id", user.id)
		.maybeSingle();

	if (!profile || profile.status === "disabled") {
		await supabase.auth.signOut();
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/";
		redirectUrl.searchParams.set("auth", "sign-in");
		redirectUrl.searchParams.set("error", "account-disabled");
		return NextResponse.redirect(redirectUrl);
	}

	if (profile.role !== "member") {
		await supabase.auth.signOut();
		const redirectUrl = request.nextUrl.clone();
		redirectUrl.pathname = "/";
		redirectUrl.searchParams.set("auth", "sign-in");
		redirectUrl.searchParams.set("error", "operators-use-admin-login");
		return NextResponse.redirect(redirectUrl);
	}

	return supabaseResponse;
}

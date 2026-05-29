export const MEMBER_AUTH_QUERY_ERRORS: Record<string, string> = {
	"account-disabled": "This account has been disabled. Contact Luxinc support.",
	"operators-use-admin-login":
		"This account is for operators. Use the admin login instead of member sign-in.",
};

export function messageForAuthQueryError(code: string | null): string | null {
	if (!code) return null;
	return MEMBER_AUTH_QUERY_ERRORS[code] ?? null;
}

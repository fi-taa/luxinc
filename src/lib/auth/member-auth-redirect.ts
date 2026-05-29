export const MEMBER_DEFAULT_PATH = "/member/upcoming";

export function resolveMemberAuthRedirect(
	next: string | null | undefined,
): string {
	if (next?.startsWith("/member")) {
		return next;
	}
	return MEMBER_DEFAULT_PATH;
}

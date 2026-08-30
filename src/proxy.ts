import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isValidSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

const ADMIN_WRITE_PREFIXES = ["/api/blogs", "/api/projects", "/api/services", "/api/testimonials", "/api/faqs"];
const WRITE_METHODS = ["POST", "PUT", "DELETE"];

function isAdminOnlyApiRequest(pathname: string, method: string): boolean {
	if (pathname === "/api/admin/login") return false;
	if (pathname.startsWith("/api/admin/")) return true;
	if (pathname === "/api/upload") return true;
	if (pathname === "/api/analytics" && method === "GET") return true;

	if (!WRITE_METHODS.includes(method)) return false;
	return ADMIN_WRITE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasValidSession = await isValidSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);

	if (pathname === "/admin" || pathname.startsWith("/admin/")) {
		if (!hasValidSession) {
			const loginUrl = new URL("/admin-login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}
		return NextResponse.next();
	}

	if (pathname.startsWith("/api/") && isAdminOnlyApiRequest(pathname, request.method) && !hasValidSession) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/admin/:path*", "/api/:path*"],
};

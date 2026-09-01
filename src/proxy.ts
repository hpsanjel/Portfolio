import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { isValidSessionToken, ADMIN_SESSION_COOKIE } from "@/lib/auth";

const ADMIN_WRITE_PREFIXES = ["/api/blogs", "/api/projects", "/api/services", "/api/testimonials", "/api/faqs"];
const WRITE_METHODS = ["POST", "PUT", "DELETE"];

const intlMiddleware = createIntlMiddleware(routing);

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

	// Admin UI and admin-login stay outside locale routing entirely.
	if (pathname === "/admin-login") {
		return NextResponse.next();
	}

	if (pathname === "/admin" || pathname.startsWith("/admin/")) {
		const hasValidSession = await isValidSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
		if (!hasValidSession) {
			const loginUrl = new URL("/admin-login", request.url);
			loginUrl.searchParams.set("redirect", pathname);
			return NextResponse.redirect(loginUrl);
		}
		return NextResponse.next();
	}

	// API routes stay outside locale routing entirely.
	if (pathname.startsWith("/api/")) {
		if (isAdminOnlyApiRequest(pathname, request.method)) {
			const hasValidSession = await isValidSessionToken(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
			if (!hasValidSession) {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
		}
		return NextResponse.next();
	}

	// Everything else is a public page route — hand off to next-intl for locale
	// detection/redirect.
	return intlMiddleware(request);
}

export const config = {
	matcher: ["/admin/:path*", "/admin-login", "/api/:path*", "/((?!_next|.*\\..*).*)"],
};

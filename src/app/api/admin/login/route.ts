import { NextResponse } from "next/server";
import { createSessionToken, ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE_SECONDS } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
	const ip = getClientIp(request);
	if (!checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000)) {
		return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
	}

	const body = await request.json().catch(() => null);
	const password = typeof body?.password === "string" ? body.password : "";
	const adminPassword = process.env.ADMIN_PASSWORD;

	if (!adminPassword || password !== adminPassword) {
		return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
	}

	const response = NextResponse.json({ ok: true });
	response.cookies.set(ADMIN_SESSION_COOKIE, await createSessionToken(), {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
	});
	return response;
}

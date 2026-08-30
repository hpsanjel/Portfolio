import type { NextRequest } from "next/server";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
	const now = Date.now();
	const bucket = buckets.get(key);

	if (!bucket || now > bucket.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}

	if (bucket.count >= limit) return false;

	bucket.count += 1;
	return true;
}

export function getClientIp(request: NextRequest | Request): string {
	const forwarded = request.headers.get("x-forwarded-for");
	return (forwarded ? forwarded.split(",")[0].trim() : null) || request.headers.get("x-real-ip") || "unknown";
}

const SESSION_COOKIE = "admin-session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getSecret(): string {
	const secret = process.env.ADMIN_SESSION_SECRET;
	if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
	return secret;
}

async function getKey(): Promise<CryptoKey> {
	return crypto.subtle.importKey("raw", new TextEncoder().encode(getSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function toHex(buffer: ArrayBuffer): string {
	return Array.from(new Uint8Array(buffer))
		.map((b) => b.toString(16).padStart(2, "0"))
		.join("");
}

function fromHex(hex: string): Uint8Array | null {
	const bytes = hex.match(/.{2}/g);
	if (!bytes) return null;
	return Uint8Array.from(bytes.map((b) => parseInt(b, 16)));
}

export async function createSessionToken(): Promise<string> {
	const expiresAt = Date.now() + SESSION_TTL_MS;
	const payload = `${expiresAt}`;
	const key = await getKey();
	const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
	return `${payload}.${toHex(signature)}`;
}

export async function isValidSessionToken(token: string | undefined | null): Promise<boolean> {
	if (!token) return false;
	const [payload, signatureHex] = token.split(".");
	if (!payload || !signatureHex) return false;
	if (Number(payload) <= Date.now()) return false;

	const signatureBytes = fromHex(signatureHex);
	if (!signatureBytes) return false;

	const key = await getKey();
	return crypto.subtle.verify("HMAC", key, signatureBytes as BufferSource, new TextEncoder().encode(payload));
}

export const ADMIN_SESSION_COOKIE = SESSION_COOKIE;
export const ADMIN_SESSION_MAX_AGE_SECONDS = SESSION_TTL_MS / 1000;

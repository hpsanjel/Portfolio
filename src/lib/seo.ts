export const SITE_NAME = "SanjelTech";
export const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_AUTH_BASE_URL || "https://www.sanjeltech.com";

/**
 * Open Graph consumers (Facebook, LinkedIn) are strict about image content-type
 * matching the file extension. Cloudinary URLs may end in a format-negotiated
 * extension that doesn't match the actual bytes, so force a .jpg extension for
 * Cloudinary-hosted images used as OG/Twitter images.
 */
export function getJpgOpenGraphImageUrl(imageUrl: string): string {
	if (!imageUrl || !imageUrl.includes("res.cloudinary.com")) {
		return imageUrl;
	}
	return imageUrl.replace(/\.[a-zA-Z0-9]+(?:\?.*)?$/, ".jpg");
}

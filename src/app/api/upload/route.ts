import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/cloudinary";

// POST /api/upload
export async function POST(request: Request) {
	try {
		const formData = await request.formData();
		const file = formData.get("file");
		const folder = formData.get("folder") as string || "portfolio";
		
		if (!file || !(file instanceof File)) {
			return NextResponse.json({ message: "File is required" }, { status: 400 });
		}
		if (!file.type.startsWith("image/")) {
			return NextResponse.json({ message: "Only image uploads are supported" }, { status: 400 });
		}

		const result = await uploadImage(file, folder);
		return NextResponse.json({ 
			url: result.secure_url,
			public_id: result.public_id,
			width: result.width,
			height: result.height,
			bytes: result.bytes
		}, { status: 201 });
	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ message: "Upload failed" }, { status: 500 });
	}
}

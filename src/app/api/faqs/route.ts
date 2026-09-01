import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { FAQ } from "../../../models";
import { ActivityLog } from "../../../models";
import { localizeDocs, parseLocale } from "../../../lib/localize";

// GET /api/faqs
export async function GET(request: Request) {
	try {
		await connectDB();
		const { searchParams } = new URL(request.url);
		const locale = parseLocale(searchParams.get('locale'));
		const faqs = await FAQ.find({}).sort({ order: 1, createdAt: 1 }).lean();
		return NextResponse.json(localizeDocs(faqs, locale, ["question", "answer"]));
	} catch (error) {
		console.error('Error fetching faqs:', error);
		return NextResponse.json({ message: "Error fetching faqs" }, { status: 500 });
	}
}

// POST /api/faqs
export async function POST(request: Request) {
	try {
		await connectDB();
		const body = await request.json();
		const { question, answer, order, translations } = body ?? {};
		if (!question || !answer) {
			return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
		}

		let resolvedOrder = order;
		if (resolvedOrder === undefined || resolvedOrder === null) {
			const count = await FAQ.countDocuments({});
			resolvedOrder = count;
		}

		const faq = new FAQ({
			question,
			answer,
			order: resolvedOrder,
			translations,
		});

		await faq.save();

		await ActivityLog.create({
			action: "created faq",
			entityType: "faq",
			entityId: faq._id.toString(),
			entityTitle: question,
			details: `FAQ "${question}" was created.`,
		});

		return NextResponse.json(faq, { status: 201 });
	} catch (error) {
		console.error('Error creating faq:', error);
		return NextResponse.json({ message: "Error creating faq" }, { status: 500 });
	}
}

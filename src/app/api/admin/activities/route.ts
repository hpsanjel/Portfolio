import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../../lib/mongoose";
import { ActivityLog } from "../../../../models";

export const runtime = "nodejs";

// POST /api/admin/activities — log a new admin activity
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { action, entityType, entityId, entityTitle, details } = body ?? {};

    if (!action || !entityType || !entityId) {
      return NextResponse.json(
        { message: "action, entityType, and entityId are required" },
        { status: 400 }
      );
    }

    await ActivityLog.create({
      action,
      entityType,
      entityId,
      entityTitle: entityTitle || "",
      details: details || "",
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { message: "Error logging activity" },
      { status: 500 }
    );
  }
}

// GET /api/admin/activities — return recent activities
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "20"), 1), 100);

    const activities = await ActivityLog.find({})
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { message: "Error fetching activities" },
      { status: 500 }
    );
  }
}

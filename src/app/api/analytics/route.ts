import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { PageView } from "../../../models";

export const runtime = "nodejs";

// POST /api/analytics — track a page view
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { path, sessionId } = await request.json();

    if (!path || !sessionId) {
      return NextResponse.json({ message: "path and sessionId are required" }, { status: 400 });
    }

    await PageView.create({ path, sessionId, timestamp: new Date() });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    return NextResponse.json({ message: "Error tracking page view" }, { status: 500 });
  }
}

// GET /api/analytics — return aggregated analytics data
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "30"), 1), 365);

    const now = new Date();
    const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const [totalViews, totalSessions, topPages, dailyViews, recentViews] = await Promise.all([
      PageView.countDocuments({}),
      PageView.distinct("sessionId").then((sessions) => sessions.length),
      PageView.aggregate([
        { $match: { timestamp: { $gte: since } } },
        { $group: { _id: "$path", views: { $sum: 1 } } },
        { $sort: { views: -1 } },
        { $limit: 10 },
        { $project: { path: "$_id", views: 1, _id: 0 } },
      ]),
      PageView.aggregate([
        { $match: { timestamp: { $gte: since } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
            },
            views: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { date: "$_id", views: 1, _id: 0 } },
      ]),
      PageView.find({})
        .sort({ timestamp: -1 })
        .limit(20)
        .lean(),
    ]);

    const totalPages = topPages.length;
    const bounceRate = totalViews > 0
      ? ((totalViews - totalSessions) / totalViews * 100).toFixed(1)
      : "0";

    return NextResponse.json({
      totalViews,
      totalSessions,
      totalPages,
      topPages,
      dailyViews,
      recentViews,
      bounceRate: `${bounceRate}%`,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
  }
}

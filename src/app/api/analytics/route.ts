import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/mongoose";
import { PageView } from "../../../models";

export const runtime = "nodejs";

// Get the visitor's real IP from proxy headers (nginx/Vercel/Cloudflare/etc.)
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return (
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "127.0.0.1"
  );
}

function isPrivateIP(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip)
  );
}

// Best-effort city/country lookup via a free, keyless geo-IP API. Fails silently to the
// caller, but logs the reason server-side so failures are diagnosable from server logs.
async function lookupGeo(ip: string): Promise<{ city?: string; country?: string }> {
  if (isPrivateIP(ip)) {
    console.warn(`[analytics] Skipping geo lookup — IP "${ip}" looks private/local. This usually means the reverse proxy in front of this app isn't forwarding the real client IP (check X-Forwarded-For / X-Real-IP in your nginx or proxy config).`);
    return {};
  }
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://ipwho.is/${ip}`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) {
      console.warn(`[analytics] Geo lookup for ${ip} failed: HTTP ${res.status}`);
      return {};
    }
    const data = await res.json();
    if (!data.success) {
      console.warn(`[analytics] Geo lookup for ${ip} returned success:false — ${data.message || "no message"}`);
      return {};
    }
    return { city: data.city || undefined, country: data.country || undefined };
  } catch (error) {
    console.warn(`[analytics] Geo lookup for ${ip} threw:`, error instanceof Error ? error.message : error);
    return {};
  }
}

// POST /api/analytics — track a page view
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { path, sessionId } = await request.json();

    if (!path || !sessionId) {
      return NextResponse.json({ message: "path and sessionId are required" }, { status: 400 });
    }

    const ip = getClientIP(request);
    const { city, country } = await lookupGeo(ip);

    await PageView.create({ path, sessionId, timestamp: new Date(), city, country });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error tracking page view:", error);
    return NextResponse.json({ message: "Error tracking page view" }, { status: 500 });
  }
}

// GET /api/analytics — return aggregated analytics data
// Optional ?path=/some-path — also returns view count + city/country breakdown for that page
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const days = Math.min(Math.max(parseInt(searchParams.get("days") || "30"), 1), 365);
    const path = searchParams.get("path");

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

    const response: Record<string, unknown> = {
      totalViews,
      totalSessions,
      totalPages,
      topPages,
      dailyViews,
      recentViews,
      bounceRate: `${bounceRate}%`,
    };

    if (path) {
      const [pathViews, pathLocations] = await Promise.all([
        PageView.countDocuments({ path }),
        PageView.aggregate([
          { $match: { path } },
          {
            $group: {
              _id: { city: { $ifNull: ["$city", "Unknown"] }, country: { $ifNull: ["$country", "Unknown"] } },
              views: { $sum: 1 },
            },
          },
          { $sort: { views: -1 } },
          { $limit: 25 },
          { $project: { city: "$_id.city", country: "$_id.country", views: 1, _id: 0 } },
        ]),
      ]);

      response.pathViews = pathViews;
      response.pathLocations = pathLocations;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json({ message: "Error fetching analytics" }, { status: 500 });
  }
}

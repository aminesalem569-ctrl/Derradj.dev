import { NextResponse, type NextRequest } from "next/server";

const FIRESTORE_URL = `https://firestore.googleapis.com/v1/projects/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents`;

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json();

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const country =
      request.headers.get("x-vercel-ip-country") ||
      request.headers.get("cf-ipcountry") ||
      "DZ";

    const ua = request.headers.get("user-agent") || "";
    const isMobile = /mobile|android|iphone|ipad/i.test(ua);

    // Write visit to Firestore REST API (public write for visits collection)
    await fetch(`${FIRESTORE_URL}/visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fields: {
          page: { stringValue: page || "/" },
          country: { stringValue: country },
          device: { stringValue: isMobile ? "mobile" : "desktop" },
          timestamp: { timestampValue: new Date().toISOString() },
        },
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

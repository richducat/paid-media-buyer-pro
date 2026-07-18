import { NextResponse } from "next/server";
import QRCode from "qrcode";

// Renders a QR code for the Salt guest request page. Restricted to our own
// guest URL so this doesn't become an open QR generator.

export const dynamic = "force-dynamic";

// Full-match on our guest page URL (the server may sit behind a proxy, so
// the public origin can differ from the request origin — allowlist instead).
const ALLOWED =
  /^https?:\/\/(paidmediapro\.eb28\.co|localhost(:\d+)?|127\.0\.0\.1(:\d+)?)\/demo\/request\.html(\?room=[A-Z0-9]{1,12})?$/;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const text = (url.searchParams.get("text") || "").slice(0, 300);
  if (!ALLOWED.test(text)) {
    return new NextResponse("Only Salt guest links can be encoded", { status: 403 });
  }
  const svg = await QRCode.toString(text, {
    type: "svg",
    margin: 1,
    width: 192,
    color: { dark: "#14101F", light: "#FFFFFF" },
  });
  return new NextResponse(svg, {
    headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" },
  });
}

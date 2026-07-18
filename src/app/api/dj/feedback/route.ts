import { NextResponse } from "next/server";
import { appendFile, readFile, stat } from "fs/promises";
import { join } from "path";
import { clientIp, rateLimited, tooMany } from "@/lib/ratelimit";

// Salt beta feedback line. Appends JSONL to a file beside the server so
// entries survive restarts and deploys (the deploy sync never touches
// files it didn't upload). Read entries with GET ?key=<FEEDBACK_KEY>.

export const dynamic = "force-dynamic";

const FILE = join(process.cwd(), "salt-feedback.jsonl");
const KEY = process.env.SALT_FEEDBACK_KEY || "saltbeta";
const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const noStore = { "Cache-Control": "no-store" };

const MAX_FILE = 2_000_000; // ~2 MB cap so feedback can't fill the disk

export async function POST(req: Request) {
  // feedback is low-frequency; 5/min per IP stops disk-fill spam
  if (rateLimited("fb:" + clientIp(req), 5, 60_000)) return tooMany(60_000);
  const len = Number(req.headers.get("content-length") || 0);
  if (len > 20_000) return NextResponse.json({ error: "Payload too large" }, { status: 413, headers: noStore });
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: noStore });
  }
  const msg = clip(body.msg, 2000);
  if (!msg) return NextResponse.json({ error: "Say something first" }, { status: 400, headers: noStore });
  try {
    const size = await stat(FILE).then((s) => s.size).catch(() => 0);
    if (size > MAX_FILE) {
      return NextResponse.json({ error: "Feedback inbox is full — thanks!" }, { status: 507, headers: noStore });
    }
  } catch {}
  const entry = {
    ts: new Date().toISOString(),
    name: clip(body.name, 60) || "Anonymous tester",
    msg,
    where: clip(body.where, 200),
  };
  try {
    await appendFile(FILE, JSON.stringify(entry) + "\n", "utf8");
  } catch {
    return NextResponse.json({ error: "Could not save" }, { status: 500, headers: noStore });
  }
  return NextResponse.json({ ok: true }, { status: 201, headers: noStore });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== KEY) {
    return new NextResponse("Feedback inbox is private — add ?key=", { status: 403 });
  }
  let lines: string[] = [];
  try {
    lines = (await readFile(FILE, "utf8")).trim().split("\n").slice(-200);
  } catch {}
  const feedback = lines.map((l) => { try { return JSON.parse(l); } catch { return null; } }).filter(Boolean);
  return NextResponse.json({ count: feedback.length, feedback }, { headers: noStore });
}

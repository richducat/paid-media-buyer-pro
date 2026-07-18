import { NextResponse } from "next/server";

// CrateCheck demo request line. In-memory store: fine for the prototype
// (resets on server restart), swap for a real DB when productizing.

export const dynamic = "force-dynamic";

type DjRequest = {
  id: number;
  name: string;
  songId: string;
  songText: string;
  note: string;
  tip: number;
  status: "pending" | "accepted" | "declined";
  ts: number;
};

type Store = { seq: number; requests: DjRequest[] };

const g = globalThis as typeof globalThis & { __djStore?: Store };
if (!g.__djStore) {
  const now = Date.now();
  g.__djStore = {
    seq: 4,
    requests: [
      { id: 3, name: "Maya R.", songId: "getlow", songText: "", note: "Bridal party demands this 🙏", tip: 20, status: "pending", ts: now - 2 * 60_000 },
      { id: 2, name: "Uncle Tony", songId: "dontstop", songText: "", note: "You know why.", tip: 0, status: "pending", ts: now - 6 * 60_000 },
      { id: 1, name: "Grandma Lois", songId: "september", songText: "", note: "Our song from 1978 ❤️", tip: 0, status: "pending", ts: now - 11 * 60_000 },
    ],
  };
}
const store = g.__djStore;

const clip = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const noStore = { "Cache-Control": "no-store" };

export async function GET() {
  const requests = [...store.requests].sort((a, b) => b.id - a.id).slice(0, 100);
  return NextResponse.json({ requests }, { headers: noStore });
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: noStore });
  }
  const songId = clip(body.songId, 40);
  const songText = clip(body.songText, 80);
  if (!songId && !songText) {
    return NextResponse.json({ error: "Pick a song or type one in" }, { status: 400, headers: noStore });
  }
  const tip = Number(body.tip);
  const request: DjRequest = {
    id: store.seq++,
    name: clip(body.name, 40) || "Guest",
    songId,
    songText,
    note: clip(body.note, 140),
    tip: [5, 10, 20].includes(tip) ? tip : 0,
    status: "pending",
    ts: Date.now(),
  };
  store.requests.push(request);
  if (store.requests.length > 300) store.requests = store.requests.slice(-300);
  return NextResponse.json({ request }, { status: 201, headers: noStore });
}

export async function PATCH(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: noStore });
  }
  const id = Number(body.id);
  const status = body.status;
  if (status !== "accepted" && status !== "declined") {
    return NextResponse.json({ error: "status must be accepted or declined" }, { status: 400, headers: noStore });
  }
  const found = store.requests.find((r) => r.id === id);
  if (!found) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: noStore });
  }
  found.status = status;
  return NextResponse.json({ request: found }, { headers: noStore });
}

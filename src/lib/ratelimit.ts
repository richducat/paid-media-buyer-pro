// Tiny in-memory sliding-window rate limiter, keyed by client IP. Good enough
// for a single-process shared-hosting deploy; swap for Redis when Salt scales
// to multiple instances.

type Hit = { count: number; reset: number };
const g = globalThis as typeof globalThis & { __rl?: Map<string, Hit> };
if (!g.__rl) g.__rl = new Map();
const store = g.__rl;

export function clientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) {
    // Use the LAST hop — the value the trusted proxy appended is the real
    // client IP; a client-supplied X-Forwarded-For gets prepended, so the
    // first entry is attacker-controlled and the last is not.
    const parts = fwd.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return h.get("x-real-ip") || "unknown";
}

/**
 * Returns true if the caller is over the limit (should be rejected).
 * `limit` requests per `windowMs`, per bucket key.
 */
export function rateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  // opportunistic sweep so the map can't grow without bound
  if (store.size > 5000) {
    for (const [k, v] of store) if (v.reset < now) store.delete(k);
    // if still oversized (many live windows), evict oldest-inserted entries
    while (store.size > 5000) {
      const oldest = store.keys().next().value;
      if (oldest === undefined) break;
      store.delete(oldest);
    }
  }
  const hit = store.get(key);
  if (!hit || hit.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return false;
  }
  hit.count++;
  return hit.count > limit;
}

import { NextResponse } from "next/server";
export function tooMany(retryMs: number) {
  return NextResponse.json(
    { error: "Slow down — too many requests. Try again in a moment." },
    { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": String(Math.ceil(retryMs / 1000)) } },
  );
}

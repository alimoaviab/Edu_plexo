/**
 * In-Flight Request Deduplication Unit Tests
 *
 * Verifies:
 * - Simultaneous identical GET requests trigger only 1 network fetch.
 * - All callers receive the exact same resolved response.
 * - Non-GET requests (POST/PUT/DELETE) are never coalesced.
 * - Requests with different URLs or parameters trigger separate fetches.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { serviceRequest } from "@/services/service-client";

describe("In-Flight Request Deduplication", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    // Reset fetch mock
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("coalesces 3 concurrent GET requests to the same endpoint into 1 network fetch", async () => {
    let fetchCount = 0;

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      // Simulate 50ms network delay
      await new Promise((resolve) => setTimeout(resolve, 50));
      return new Response(JSON.stringify({ ok: true, data: { items: [1, 2, 3] } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    // Fire 3 simultaneous GET requests
    const [res1, res2, res3] = await Promise.all([
      serviceRequest<{ items: number[] }>("/api/classes"),
      serviceRequest<{ items: number[] }>("/api/classes"),
      serviceRequest<{ items: number[] }>("/api/classes"),
    ]);

    expect(fetchCount).toBe(1);
    expect(res1.ok).toBe(true);
    expect(res2.ok).toBe(true);
    expect(res3.ok).toBe(true);
    expect(res1.data?.items).toEqual([1, 2, 3]);
    expect(res2.data?.items).toEqual([1, 2, 3]);
    expect(res3.data?.items).toEqual([1, 2, 3]);
  });

  it("does NOT coalesce non-GET mutation requests (e.g. POST)", async () => {
    let fetchCount = 0;

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return new Response(JSON.stringify({ ok: true, data: { saved: true } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    const [res1, res2] = await Promise.all([
      serviceRequest("/api/attendance/mark", { method: "POST", body: JSON.stringify({ id: 1 }) }),
      serviceRequest("/api/attendance/mark", { method: "POST", body: JSON.stringify({ id: 1 }) }),
    ]);

    expect(fetchCount).toBe(2);
    expect(res1.ok).toBe(true);
    expect(res2.ok).toBe(true);
  });

  it("does NOT coalesce requests with different URLs or parameters", async () => {
    let fetchCount = 0;

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 20));
      return new Response(JSON.stringify({ ok: true, data: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    });

    await Promise.all([
      serviceRequest("/api/students?page=1"),
      serviceRequest("/api/students?page=2"),
    ]);

    expect(fetchCount).toBe(2);
  });
});

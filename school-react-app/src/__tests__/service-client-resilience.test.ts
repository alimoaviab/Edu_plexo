/**
 * Service client resilience tests.
 *
 * Regression coverage for the intermittent "Couldn't load timetable /
 * Unable to reach the server" first-load failure:
 *   - Reads must auto-recover from transient failures (network blips,
 *     502/503/504) with a small bounded number of retries + backoff.
 *   - Retries must be bounded (no infinite loops) and never apply to
 *     mutations on HTTP error statuses.
 *   - Read timeouts must be classified as TIMEOUT (not NETWORK_ERROR)
 *     and must not be retried.
 *   - Offline browser state must short-circuit without pointless fetches.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { serviceRequest } from "@/services/service-client";

describe("serviceRequest resilience", () => {
  const originalFetch = globalThis.fetch;
  const originalOnLine = navigator.onLine;

  let urlCounter = 0;
  const uniqueUrl = () => `/api/resilience-test-${++urlCounter}`;

  const okResponse = (data: unknown) =>
    new Response(JSON.stringify({ ok: true, data }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });

  const statusResponse = (status: number, body = "") =>
    new Response(body, { status });

  beforeEach(() => {
    vi.restoreAllMocks();
    if (navigator.onLine !== true) {
      Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
    }
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    Object.defineProperty(navigator, "onLine", { value: originalOnLine, configurable: true });
  });

  it("always sends credentials and auth/tenant headers on every attempt", async () => {
    localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload");
    localStorage.setItem("academic_year_id", "ay_2026");
    localStorage.setItem("active_school_id", "sch_1");
    localStorage.setItem("active_branch_id", "br_1");

    let capturedInit: RequestInit | undefined;
    globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init: RequestInit) => {
      capturedInit = init;
      throw new TypeError("Failed to fetch");
    });

    const result = await serviceRequest(uniqueUrl());

    // Failure path exercised so we can inspect the attempt; the assertions
    // below pin the request contract so a future refactor can't silently
    // drop the auth headers again.
    expect(result.ok).toBe(false);
    expect(capturedInit?.credentials).toBe("include");
    const headers = capturedInit?.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.payload");
    expect(headers["x-academic-year-id"]).toBe("ay_2026");
    expect(headers["x-school-id"]).toBe("sch_1");
    expect(headers["x-branch-id"]).toBe("br_1");
  });

  it("recovers from a transient transport failure on a GET (retry with backoff)", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      if (fetchCount < 3) throw new TypeError("Failed to fetch");
      return okResponse({ items: [1, 2, 3] });
    });

    const result = await serviceRequest<{ items: number[] }>(uniqueUrl());

    expect(result.ok).toBe(true);
    expect(result.data?.items).toEqual([1, 2, 3]);
    expect(fetchCount).toBe(3);
  });

  it("returns NETWORK_ERROR after a bounded number of attempts (no infinite loop)", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      throw new TypeError("Failed to fetch");
    });

    const result = await serviceRequest(uniqueUrl());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NETWORK_ERROR");
      expect(result.error.message).toContain("Unable to reach the server");
    }
    // 3 attempts total for reads — never more.
    expect(fetchCount).toBe(3);
  });

  it("retries a transient 503 on a GET and recovers", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      if (fetchCount === 1) return statusResponse(503);
      return okResponse({ saved: true });
    });

    const result = await serviceRequest(uniqueUrl());

    expect(result.ok).toBe(true);
    expect(fetchCount).toBe(2);
  });

  it("reports 'server temporarily unavailable' (not a network error) after persistent 502/503/504", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      return statusResponse(503);
    });

    const result = await serviceRequest(uniqueUrl());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("HTTP_503");
      expect(result.error.message).toContain("temporarily unavailable");
      expect(result.error.message).not.toContain("internet connection");
    }
    expect(fetchCount).toBe(3);
  });

  it("classifies a read timeout as TIMEOUT and does not retry it", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation((_url: string, init: RequestInit) => {
      fetchCount += 1;
      return new Promise((_resolve, reject) => {
        init.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const result = await serviceRequest(uniqueUrl(), { timeoutMs: 30 });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("TIMEOUT");
      expect(result.error.message).toContain("took too long");
    }
    expect(fetchCount).toBe(1);
  });

  it("does not retry mutations on 5xx responses (avoids duplicate side effects)", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      return statusResponse(503);
    });

    const result = await serviceRequest(uniqueUrl(), {
      method: "POST",
      body: JSON.stringify({ x: 1 }),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("HTTP_503");
    expect(fetchCount).toBe(1);
  });

  it("short-circuits with NETWORK_ERROR when the browser is offline", async () => {
    let fetchCount = 0;
    Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      return okResponse({});
    });

    const result = await serviceRequest(uniqueUrl());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NETWORK_ERROR");
    }
    expect(fetchCount).toBe(0);
  });

  it("honours an explicit retries=0 as a single attempt on reads", async () => {
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      throw new TypeError("Failed to fetch");
    });

    const result = await serviceRequest(uniqueUrl(), {}, 0);

    expect(result.ok).toBe(false);
    expect(fetchCount).toBe(1);
  });

  it("allows disabling the read timeout via timeoutMs: 0", async () => {
    // A request that never settles would otherwise be aborted after the
    // timeout window; timeoutMs:0 must skip installing the timer.
    let fetchCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(async (_url: string, init: RequestInit) => {
      fetchCount += 1;
      return new Promise((_resolve, reject) => {
        init.signal?.addEventListener("abort", () => {
          reject(new DOMException("Aborted", "AbortError"));
        });
      });
    });

    const resultPromise = serviceRequest(uniqueUrl(), { timeoutMs: 0 });
    await new Promise((resolve) => setTimeout(resolve, 60));

    let settled = false;
    resultPromise.then(() => { settled = true; });
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(settled).toBe(false); // still pending → no internal abort fired
    expect(fetchCount).toBe(1);
  });

  it("does not retry 401 responses and keeps the UNAUTHORIZED classification", async () => {
    let fetchCount = 0;
    const replaceSpy = vi.fn();
    Object.defineProperty(window, "location", {
      value: { ...window.location, replace: replaceSpy },
      writable: true,
    });

    globalThis.fetch = vi.fn().mockImplementation(async () => {
      fetchCount += 1;
      return new Response(JSON.stringify({ message: "Session expired" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    });

    const result = await serviceRequest(uniqueUrl());

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("UNAUTHORIZED");
    }
    expect(fetchCount).toBe(1);
  });
});
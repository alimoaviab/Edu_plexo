/**
 * Safe Namespaced Storage Unit Tests
 *
 * Verifies:
 * - Versioned storage envelopes.
 * - TTL expiration.
 * - Corrupted JSON resilience (safe fallback and cleanup).
 * - Cache namespace isolation and clearance.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  getStoredValue,
  setStoredValue,
  setStoredValueWithTTL,
  getStoredValueWithTTL,
  removeStoredValue,
  clearCacheNamespace,
  formatStorageKey,
} from "@/utils/storage";

describe("Safe Namespaced Storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves basic values safely", () => {
    const key = formatStorageKey("pref", "theme");
    const success = setStoredValue(key, "dark");
    expect(success).toBe(true);

    const value = getStoredValue<string>(key);
    expect(value).toBe("dark");
  });

  it("handles TTL expiration properly", () => {
    vi.useFakeTimers();

    const key = formatStorageKey("cache", "branding");
    setStoredValueWithTTL(key, { logo: "logo.png" }, 1000); // 1s TTL

    // Immediately available
    expect(getStoredValueWithTTL(key)).toEqual({ logo: "logo.png" });

    // Advance 500ms -> still available
    vi.advanceTimersByTime(500);
    expect(getStoredValueWithTTL(key)).toEqual({ logo: "logo.png" });

    // Advance 600ms (total 1100ms) -> expired
    vi.advanceTimersByTime(600);
    expect(getStoredValueWithTTL(key)).toBeNull();

    vi.useRealTimers();
  });

  it("gracefully recovers from corrupted JSON without throwing", () => {
    const key = formatStorageKey("cache", "corrupted");
    localStorage.setItem(key, "{ invalid json ... ");

    // Should not throw, returns default value
    const result = getStoredValue(key, { fallback: true });
    expect(result).toEqual({ fallback: true });

    // Corrupted item was safely removed
    expect(localStorage.getItem(key)).toBeNull();
  });

  it("clears cache namespace without affecting user preferences", () => {
    const cacheKey1 = formatStorageKey("cache", "stats");
    const cacheKey2 = formatStorageKey("cache", "timetable");
    const prefKey = formatStorageKey("pref", "language");

    setStoredValue(cacheKey1, { count: 10 });
    setStoredValue(cacheKey2, { day: "Monday" });
    setStoredValue(prefKey, "en");

    clearCacheNamespace();

    expect(getStoredValue(cacheKey1)).toBeNull();
    expect(getStoredValue(cacheKey2)).toBeNull();
    expect(getStoredValue(prefKey)).toBe("en");
  });
});

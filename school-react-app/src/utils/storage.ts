/**
 * Safe, namespaced, versioned storage utility for EduPlexo Web.
 *
 * Rules:
 *   - Only small, non-sensitive, stable UI/UX data is stored in localStorage.
 *   - Sensitive tokens, large API datasets, and private student/finance records
 *     must NEVER be stored in localStorage.
 *   - All keys are namespaced with `edup:cache:` or `edup:pref:`.
 *   - Supports optional TTL expiration for transient cache values.
 *   - Handles corrupted JSON, private browsing quota errors, and missing localStorage gracefully.
 */

const STORAGE_PREFIX = "edup:";
const STORAGE_VERSION = 1;

interface StorageEnvelope<T> {
  version: number;
  data: T;
  timestamp: number;
  expiresAt: number | null; // null means no expiration
}

/**
 * Check if localStorage is available and functional.
 */
function isStorageAvailable(): boolean {
  if (typeof window === "undefined" || !window.localStorage) {
    return false;
  }
  try {
    const testKey = "__edup_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

/**
 * Format a full namespaced storage key.
 */
export function formatStorageKey(namespace: "cache" | "pref", key: string): string {
  return `${STORAGE_PREFIX}${namespace}:${key}`;
}

/**
 * Get a stored value safely with type inference and version validation.
 */
export function getStoredValue<T>(key: string, defaultValue: T | null = null): T | null {
  if (!isStorageAvailable()) return defaultValue;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;

    const parsed: StorageEnvelope<T> = JSON.parse(raw);

    // If enveloped with version & expiry metadata
    if (parsed && typeof parsed === "object" && "version" in parsed && "data" in parsed) {
      if (parsed.version !== STORAGE_VERSION) {
        window.localStorage.removeItem(key);
        return defaultValue;
      }

      if (parsed.expiresAt !== null && Date.now() > parsed.expiresAt) {
        window.localStorage.removeItem(key);
        return defaultValue;
      }

      return parsed.data;
    }

    // Fallback for legacy plain JSON items
    return parsed as unknown as T;
  } catch {
    // Corrupted item — clean it up safely
    try {
      window.localStorage.removeItem(key);
    } catch {
      /* noop */
    }
    return defaultValue;
  }
}

/**
 * Set a stored value safely.
 */
export function setStoredValue<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const envelope: StorageEnvelope<T> = {
      version: STORAGE_VERSION,
      data: value,
      timestamp: Date.now(),
      expiresAt: null,
    };
    window.localStorage.setItem(key, JSON.stringify(envelope));
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to set key "${key}":`, error);
    return false;
  }
}

/**
 * Set a stored value with a Time-To-Live (TTL) in milliseconds.
 */
export function setStoredValueWithTTL<T>(key: string, value: T, ttlMs: number): boolean {
  if (!isStorageAvailable()) return false;

  try {
    const envelope: StorageEnvelope<T> = {
      version: STORAGE_VERSION,
      data: value,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttlMs,
    };
    window.localStorage.setItem(key, JSON.stringify(envelope));
    return true;
  } catch (error) {
    console.warn(`[Storage] Failed to set key "${key}" with TTL:`, error);
    return false;
  }
}

/**
 * Get a stored value with TTL check (returns null if expired or missing).
 */
export function getStoredValueWithTTL<T>(key: string): T | null {
  return getStoredValue<T>(key, null);
}

/**
 * Remove a single stored key safely.
 */
export function removeStoredValue(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* noop */
  }
}

/**
 * Clear all `edup:cache:*` keys while preserving user preferences and tokens.
 */
export function clearCacheNamespace(): void {
  if (!isStorageAvailable()) return;
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key && key.startsWith(`${STORAGE_PREFIX}cache:`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* noop */
  }
}

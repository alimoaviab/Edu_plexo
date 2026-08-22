/**
 * Secure storage wrapper — JWTs and other secrets live in the Android Keystore
 * via expo-secure-store. Non-sensitive prefs (academic year, last role) live
 * in AsyncStorage so they survive a key-rotated keystore.
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const StorageKeys = {
  // Sensitive
  token: 'token',
  // Non-sensitive
  academicYearId: 'academic_year_id',
  activeSchoolId: 'active_school_id',
  activeBranchId: 'active_branch_id',
  profileId: 'profile_id',
  classId: 'class_id',
  studentId: 'student_id',
  lastSchoolId: 'last_school_id',
  lastLoginRole: 'last_login_role',
  lastEmail: 'last_email',
} as const;

export const secureStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      // SecureStore can fail on some devices when the keystore is locked.
      // Fall back to AsyncStorage so the user isn't stranded — token will be
      // re-issued on next login if AsyncStorage is later cleared.
      await AsyncStorage.setItem(key, value);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // ignore
    }
    await AsyncStorage.removeItem(key);
  },
};

export const prefStorage = {
  async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // ignore — AsyncStorage failures are extremely rare
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {
      // ignore
    }
  },
  /** Get a JSON value with TTL expiration check */
  async getWithTTL<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && 'expiresAt' in parsed && 'data' in parsed) {
        if (parsed.expiresAt !== null && Date.now() > parsed.expiresAt) {
          await AsyncStorage.removeItem(key);
          return null;
        }
        return parsed.data as T;
      }
      return parsed as T;
    } catch {
      return null;
    }
  },
  /** Set a JSON value with TTL expiration */
  async setWithTTL<T>(key: string, data: T, ttlMs: number): Promise<void> {
    try {
      const envelope = {
        data,
        timestamp: Date.now(),
        expiresAt: Date.now() + ttlMs,
      };
      await AsyncStorage.setItem(key, JSON.stringify(envelope));
    } catch {
      // ignore
    }
  },
};


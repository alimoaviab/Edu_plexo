/**
 * Active child store — only used in the parent portal. Persists the
 * currently-selected child so the rest of the app (homework, attendance,
 * results, fees, announcements) can scope queries without prop drilling.
 */

import { create } from 'zustand';

import { prefStorage } from '@/utils/secure-storage';

const KEY = 'active_child_id';

interface ActiveChildState {
  studentId: string | null;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  set: (studentId: string | null) => Promise<void>;
}

export const useActiveChildStore = create<ActiveChildState>((set) => ({
  studentId: null,
  hydrated: false,
  hydrate: async () => {
    const id = await prefStorage.get(KEY);
    set({ studentId: id ?? null, hydrated: true });
  },
  set: async (studentId) => {
    if (studentId) await prefStorage.set(KEY, studentId);
    else await prefStorage.remove(KEY);
    set({ studentId });
  },
}));

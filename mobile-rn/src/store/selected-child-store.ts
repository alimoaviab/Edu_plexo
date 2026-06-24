/**
 * Selected-child store for the parent portal.
 *
 * A parent account can be linked to multiple students. Every parent screen is
 * scoped to one active child; this store holds that selection (mirrors the
 * web's SelectedChildContext). It seeds from the JWT-persisted student id and
 * lets the dashboard's child switcher update it. The chosen id is persisted so
 * it survives app restarts.
 */

import { create } from 'zustand';

import type { ParentChild } from '@/modules/dashboard/types';
import { prefStorage, StorageKeys } from '@/utils/secure-storage';

interface SelectedChildState {
  studentId?: string;
  child?: ParentChild;
  children: ParentChild[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setChildren: (children: ParentChild[]) => void;
  select: (studentId: string) => Promise<void>;
}

export const useSelectedChild = create<SelectedChildState>((set, get) => ({
  studentId: undefined,
  child: undefined,
  children: [],
  hydrated: false,

  hydrate: async () => {
    const stored = await prefStorage.get(StorageKeys.studentId);
    set({ studentId: stored ?? undefined, hydrated: true });
  },

  setChildren: (children) => {
    const current = get().studentId;
    // Keep the current selection if it's still valid; otherwise pick the first.
    const stillValid = current && children.some((c) => c.student_id === current);
    const nextId = stillValid ? current : children[0]?.student_id;
    const child = children.find((c) => c.student_id === nextId);
    set({ children, studentId: nextId, child });
    if (nextId) void prefStorage.set(StorageKeys.studentId, nextId);
  },

  select: async (studentId) => {
    const child = get().children.find((c) => c.student_id === studentId);
    set({ studentId, child });
    await prefStorage.set(StorageKeys.studentId, studentId);
  },
}));

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Circular, Progress, University } from "@/data/types";
import { todayISO } from "@/lib/dates";

export interface PersonalData {
  version: 1;
  bookmarks: string[];
  shortlist: string[];
  readIds: string[];
  pinnedIds: string[];
  verifiedOn: Record<string, string>;
  progress: Record<string, Progress>;
  notes: Record<string, string>;
  universityPatches: Record<string, Partial<University>>;
  circularPatches: Record<string, Partial<Circular>>;
  customUniversities: University[];
  customCirculars: Circular[];
  hiddenUniversityIds: string[];
  hiddenCircularIds: string[];
}

export const emptyPersonal: PersonalData = {
  version: 1,
  bookmarks: [],
  shortlist: [],
  readIds: [],
  pinnedIds: [],
  verifiedOn: {},
  progress: {},
  notes: {},
  universityPatches: {},
  circularPatches: {},
  customUniversities: [],
  customCirculars: [],
  hiddenUniversityIds: [],
  hiddenCircularIds: [],
};

function toggle(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

type Store = PersonalData & {
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  toggleBookmark: (id: string) => void;
  toggleShortlist: (id: string) => void;
  toggleRead: (id: string) => void;
  markRead: (id: string) => void;
  togglePin: (id: string) => void;
  toggleVerified: (id: string) => void;
  setProgress: (id: string, progress: Progress | null) => void;
  setNote: (id: string, note: string) => void;
  saveUniversity: (id: string, patch: Partial<University>, custom: boolean) => void;
  saveCircular: (id: string, patch: Partial<Circular>, custom: boolean) => void;
  addUniversity: (university: University) => void;
  addCircular: (circular: Circular) => void;
  hideUniversity: (id: string) => void;
  hideCircular: (id: string) => void;
  replacePersonal: (data: PersonalData) => void;
  resetPersonal: () => void;
};

const memoryStore = new Map<string, string>();

const browserStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return memoryStore.get(name) ?? null;
    return localStorage.getItem(name);
  },
  setItem: (name: string, value: string) => {
    if (typeof window === "undefined") memoryStore.set(name, value);
    else localStorage.setItem(name, value);
  },
  removeItem: (name: string) => {
    if (typeof window === "undefined") memoryStore.delete(name);
    else localStorage.removeItem(name);
  },
};

export const usePersonal = create<Store>()(
  persist(
    (set, get) => ({
      ...emptyPersonal,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      toggleBookmark: (id) => set({ bookmarks: toggle(get().bookmarks, id) }),
      toggleShortlist: (id) => set({ shortlist: toggle(get().shortlist, id) }),
      toggleRead: (id) => set({ readIds: toggle(get().readIds, id) }),
      markRead: (id) => set({ readIds: get().readIds.includes(id) ? get().readIds : [...get().readIds, id] }),
      togglePin: (id) => set({ pinnedIds: toggle(get().pinnedIds, id) }),
      toggleVerified: (id) => {
        const next = { ...get().verifiedOn };
        if (next[id]) delete next[id];
        else next[id] = todayISO();
        set({ verifiedOn: next });
      },
      setProgress: (id, progress) => {
        const next = { ...get().progress };
        if (!progress) delete next[id];
        else next[id] = progress;
        set({ progress: next });
      },
      setNote: (id, note) => {
        const next = { ...get().notes };
        if (!note.trim()) delete next[id];
        else next[id] = note;
        set({ notes: next });
      },
      saveUniversity: (id, patch, custom) => {
        if (custom) {
          set({
            customUniversities: get().customUniversities.map((item) =>
              item.id === id ? { ...item, ...patch, id } : item,
            ),
          });
          return;
        }
        set({
          universityPatches: {
            ...get().universityPatches,
            [id]: { ...get().universityPatches[id], ...patch, id },
          },
        });
      },
      saveCircular: (id, patch, custom) => {
        if (custom) {
          set({
            customCirculars: get().customCirculars.map((item) =>
              item.id === id ? { ...item, ...patch, id } : item,
            ),
          });
          return;
        }
        set({
          circularPatches: {
            ...get().circularPatches,
            [id]: { ...get().circularPatches[id], ...patch, id },
          },
        });
      },
      addUniversity: (university) => set({ customUniversities: [...get().customUniversities, university] }),
      addCircular: (circular) => set({ customCirculars: [...get().customCirculars, circular] }),
      hideUniversity: (id) => {
        if (get().customUniversities.some((item) => item.id === id)) {
          set({ customUniversities: get().customUniversities.filter((item) => item.id !== id) });
          return;
        }
        set({ hiddenUniversityIds: [...new Set([...get().hiddenUniversityIds, id])] });
      },
      hideCircular: (id) => {
        if (get().customCirculars.some((item) => item.id === id)) {
          set({ customCirculars: get().customCirculars.filter((item) => item.id !== id) });
          return;
        }
        set({ hiddenCircularIds: [...new Set([...get().hiddenCircularIds, id])] });
      },
      replacePersonal: (data) => set({ ...emptyPersonal, ...data, version: 1 }),
      resetPersonal: () => set({ ...emptyPersonal }),
    }),
    {
      name: "admission26.v1",
      storage: createJSONStorage(() => browserStorage),
      skipHydration: true,
      partialize: (state) => ({
        version: state.version,
        bookmarks: state.bookmarks,
        shortlist: state.shortlist,
        readIds: state.readIds,
        pinnedIds: state.pinnedIds,
        verifiedOn: state.verifiedOn,
        progress: state.progress,
        notes: state.notes,
        universityPatches: state.universityPatches,
        circularPatches: state.circularPatches,
        customUniversities: state.customUniversities,
        customCirculars: state.customCirculars,
        hiddenUniversityIds: state.hiddenUniversityIds,
        hiddenCircularIds: state.hiddenCircularIds,
      }),
    },
  ),
);

export function personalSnapshot(state: Store): PersonalData {
  return {
    version: 1,
    bookmarks: state.bookmarks,
    shortlist: state.shortlist,
    readIds: state.readIds,
    pinnedIds: state.pinnedIds,
    verifiedOn: state.verifiedOn,
    progress: state.progress,
    notes: state.notes,
    universityPatches: state.universityPatches,
    circularPatches: state.circularPatches,
    customUniversities: state.customUniversities,
    customCirculars: state.customCirculars,
    hiddenUniversityIds: state.hiddenUniversityIds,
    hiddenCircularIds: state.hiddenCircularIds,
  };
}

export function parseBackup(raw: unknown): PersonalData | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as { archive?: unknown; version?: unknown; personal?: unknown };
  if (record.archive !== "ADMISSION//26" || record.version !== 1) return null;
  const personal = record.personal;
  if (!personal || typeof personal !== "object") return null;
  const data = personal as Partial<PersonalData>;
  if (!Array.isArray(data.bookmarks) || !Array.isArray(data.customUniversities) || !Array.isArray(data.customCirculars)) {
    return null;
  }
  return { ...emptyPersonal, ...data, version: 1 };
}

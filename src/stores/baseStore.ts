import { create } from "zustand";

interface BaseStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  segmentCounter: number;
  setSegmentCounter: (num: number) => void;
}

export const useBaseStore = create<BaseStore>((set) => ({
  isDarkMode: true,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  segmentCounter: parseInt(localStorage.getItem("segmentCounter") || "1"),
  setSegmentCounter: (num: number) => set(() => ({ segmentCounter: num })),
}));

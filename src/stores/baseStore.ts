import { create } from "zustand";

interface BaseStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  segmentCounter: number;
  setSegmentCounter: (num: number) => void;
}

export const useBaseStore = create<BaseStore>((set) => ({
  isDarkMode: localStorage.getItem("isDarkMode") === "light" ? false : true,
  toggleDarkMode: () =>
    set((state) => {
      localStorage.setItem("isDarkMode", !state.isDarkMode ? "dark" : "light");
      return { isDarkMode: !state.isDarkMode };
    }),
  segmentCounter: parseInt(localStorage.getItem("segmentCounter") || "1"),
  setSegmentCounter: (num: number) => set(() => ({ segmentCounter: num })),
}));

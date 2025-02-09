import { create } from "zustand";
import { breakpoints } from "../styles/theme";

interface BaseStore {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  segmentCounter: number;
  setSegmentCounter: (num: number) => void;
  isAdaptive: boolean;
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
  isAdaptive: window.innerWidth < breakpoints.mobile,
}));

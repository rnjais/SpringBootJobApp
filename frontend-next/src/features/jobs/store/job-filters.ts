import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { JobFilters, JobType } from "@/types/domain";

type FilterState = JobFilters & {
  view: "grid" | "list"; setFilter: <K extends keyof JobFilters>(key: K, value: JobFilters[K]) => void;
  setJobType: (value: JobType | "") => void; setView: (view: "grid" | "list") => void; reset: () => void;
};
const defaults: JobFilters = { keyword: "", location: "", jobType: "", minSalary: null, maxSalary: null, experience: "", technologies: [], page: 0, size: 12 };
export const useJobFilters = create<FilterState>()(persist((set) => ({
  ...defaults, view: "grid",
  setFilter: (key, value) => set({ [key]: value, ...(key !== "page" ? { page: 0 } : {}) } as Partial<FilterState>),
  setJobType: (jobType) => set({ jobType, page: 0 }), setView: (view) => set({ view }), reset: () => set({ ...defaults }),
}), { name: "northstar-job-filters", partialize: (state) => ({ view: state.view }) as FilterState, skipHydration: true }));

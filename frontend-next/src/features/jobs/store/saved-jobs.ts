import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Job } from "@/types/domain";
type SavedJobsState = { jobs: Job[]; toggle: (job: Job) => void; remove: (id: number) => void };
export const useSavedJobs = create<SavedJobsState>()(persist((set) => ({
  jobs: [],
  toggle: (job) => set((state) => ({ jobs: state.jobs.some((saved) => saved.id === job.id) ? state.jobs.filter((saved) => saved.id !== job.id) : [job, ...state.jobs] })),
  remove: (id) => set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) })),
}), { name: "northstar-saved-jobs", skipHydration: true }));

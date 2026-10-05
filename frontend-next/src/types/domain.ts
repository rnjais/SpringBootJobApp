export type JobType = "FULL_TIME" | "PART_TIME" | "REMOTE";
export type Job = {
  id: number; title: string; description: string; companyName: string; location: string;
  jobType: JobType; salaryRange: string | null; createdAt: string;
};
export type Page<T> = { content: T[]; totalElements: number; totalPages: number; number: number; size: number };
export type JobFilters = {
  keyword: string; location: string; jobType: JobType | ""; minSalary: number | null;
  maxSalary: number | null; experience: string; technologies: string[]; page: number; size: number;
};
export type ApiError = { message: string; status?: number };

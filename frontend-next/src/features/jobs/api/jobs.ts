import type { Job, JobFilters, Page } from "@/types/domain";

export async function getJobs(filters: JobFilters, signal?: AbortSignal): Promise<Page<Job>> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value === null || value === "" || key === "technologies" || key === "experience") continue;
    if (key === "minSalary" || key === "maxSalary") continue;
    params.set(key, String(value));
  }
  if (filters.keyword) params.set("keyword", filters.keyword);
  if (filters.location) params.set("location", filters.location);
  if (filters.jobType) params.set("jobType", filters.jobType);
  const response = await fetch(`/api/v1/jobs?${params}`, { signal, headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(response.status === 503 ? "Job search is temporarily unavailable." : "We couldn't load jobs. Please try again.");
  return response.json() as Promise<Page<Job>>;
}
export async function uploadResume(file: File, signal?: AbortSignal): Promise<{ resumeUrl: string }> {
  const body = new FormData(); body.append("file", file);
  const token = typeof window === "undefined" ? null : localStorage.getItem("token");
  const response = await fetch("/api/v1/uploads/resume", { method: "POST", body, signal, headers: token ? { Authorization: `Bearer ${token}` } : {} });
  if (!response.ok) throw new Error("Resume upload failed. Please try again.");
  return response.json() as Promise<{ resumeUrl: string }>;
}
export async function submitApplication(payload: { jobId: number; resumeUrl: string; coverLetter: string; answers: Record<string, string> }, signal?: AbortSignal) {
  const token = typeof window === "undefined" ? null : localStorage.getItem("token");
  const response = await fetch(`/api/v1/applications?jobId=${payload.jobId}`, { method: "POST", signal, headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify({ resumeUrl: payload.resumeUrl, coverLetter: payload.coverLetter, answers: payload.answers }) });
  if (!response.ok) throw new Error(response.status === 409 ? "You’ve already applied to this role." : "We couldn't submit your application. Please try again.");
  return response.json() as Promise<{ id: number }>;
}

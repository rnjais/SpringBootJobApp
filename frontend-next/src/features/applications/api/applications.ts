import type { CandidateApplication } from "@/features/applications/types";

export async function getMyApplications(signal?: AbortSignal): Promise<CandidateApplication[]> {
  const token = typeof window === "undefined" ? null : localStorage.getItem("token");
  const response = await fetch("/api/v1/applications/me", { signal, headers: { Accept: "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
  if (!response.ok) throw new Error(response.status === 401 ? "Sign in to follow your applications." : "We couldn't load your applications.");
  return response.json() as Promise<CandidateApplication[]>;
}

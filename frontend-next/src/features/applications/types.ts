export type ApplicationStatus = "APPLIED" | "REVIEWING" | "SHORTLISTED" | "HIRED" | "REJECTED";
export type CandidateApplication = { id: number; jobId: number; jobTitle: string; companyName: string; status: ApplicationStatus; appliedAt: string; resumeUrl: string };

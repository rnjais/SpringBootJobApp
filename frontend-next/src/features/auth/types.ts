export type UserRole = "JOB_SEEKER" | "RECRUITER" | "ADMIN";
export type UserSession = { id: number; email: string; firstName: string; lastName: string; role: UserRole };
export type AuthResponse = { token: string; tokenType: "Bearer"; expiresIn: number; user: UserSession };

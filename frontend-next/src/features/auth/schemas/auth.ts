import { z } from "zod";
export const loginSchema = z.object({ email: z.email("Enter a valid email address"), password: z.string().min(1, "Enter your password").max(72) });
export const registerSchema = z.object({ firstName: z.string().trim().min(1, "First name is required").max(80), lastName: z.string().trim().min(1, "Last name is required").max(80), email: z.email("Enter a valid email address"), password: z.string().min(10, "Use at least 10 characters").max(72), role: z.enum(["JOB_SEEKER", "RECRUITER"]) });
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;

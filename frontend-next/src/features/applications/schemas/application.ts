import { z } from "zod";

export const applicationSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(80),
  lastName: z.string().trim().min(1, "Last name is required").max(80),
  email: z.email("Enter a valid email address"),
  phone: z.string().trim().min(7, "Enter a phone number").max(32),
  resumeFileName: z.string().min(1, "Attach a resume to continue"),
  coverLetter: z.string().max(10_000, "Keep your note under 10,000 characters"),
  workAuthorization: z.union([z.literal(""), z.enum(["yes", "no"])]).pipe(z.enum(["yes", "no"], { error: "Choose an answer" })),
  startDate: z.string().min(1, "Select your earliest start date"),
  experience: z.string().min(1, "Choose your years of experience"),
});
export type ApplicationFormValues = z.input<typeof applicationSchema>;
export type ApplicationSubmissionValues = z.output<typeof applicationSchema>;
export const applicationSteps = [
  { title: "Your details", fields: ["firstName", "lastName", "email", "phone"] as const },
  { title: "Resume & note", fields: ["resumeFileName", "coverLetter"] as const },
  { title: "A few questions", fields: ["workAuthorization", "startDate", "experience"] as const },
  { title: "Review", fields: [] as const },
] as const;
export function isValidResume(file: File) { return file.size <= 5 * 1024 * 1024 && ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) && /\.(pdf|docx)$/i.test(file.name); }

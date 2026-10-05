import { z } from 'zod';
const password = z.string().min(10, 'Use at least 10 characters').max(72, 'Password is too long');
export const loginSchema = z.object({ email: z.string().email('Enter a valid email'), password });
export const registrationSchema = z.object({ firstName: z.string().trim().min(1, 'First name is required').max(80), lastName: z.string().trim().min(1, 'Last name is required').max(80), email: z.string().email('Enter a valid email'), password, role: z.enum(['JOB_SEEKER', 'RECRUITER']) });
export const jobSchema = z.object({ title: z.string().trim().min(3, 'Add a descriptive title').max(160), companyName: z.string().trim().min(2).max(160), location: z.string().trim().min(2).max(160), salaryRange: z.string().max(100).optional(), jobType: z.enum(['FULL_TIME', 'PART_TIME', 'REMOTE']), description: z.string().trim().min(30, 'Add at least 30 characters').max(12000) });
export const applicationSchema = z.object({ coverLetter: z.string().max(10000).optional() });
export const profileSchema = z.object({ firstName: z.string().trim().min(1, 'First name is required').max(80), lastName: z.string().trim().min(1, 'Last name is required').max(80) });
export const resumeIsValid = (file) => file && file.size <= 5 * 1024 * 1024 && ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) && /\.(pdf|docx)$/i.test(file.name);

import { z } from 'zod';

export const TrackInterestSchema = z.enum([
  'ROBOTICS_HARDWARE',
  'EMBEDDED_IOT',
  'AI_MACHINE_LEARNING',
  'FULL_STACK_DEV',
  'DESIGN_3D',
]);
export type TrackInterest = z.infer<typeof TrackInterestSchema>;

export const JoinApplicationSchema = z.object({
  id: z.string().uuid().optional(),
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  studentId: z.string().min(3, 'Student ID / Roll number is required'),
  yearOfStudy: z.number().int().min(1).max(5),
  branch: z.string().min(2, 'Academic branch/major is required'),
  interest: TrackInterestSchema,
  githubOrPortfolio: z.string().url().optional().or(z.literal('')),
  statementOfPurpose: z.string().min(20, 'Please write at least 20 characters about why you want to join'),
  turnstileToken: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});
export type JoinApplication = z.infer<typeof JoinApplicationSchema>;

export const ContactMessageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  turnstileToken: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});
export type ContactMessage = z.infer<typeof ContactMessageSchema>;

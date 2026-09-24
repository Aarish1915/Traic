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
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().min(7, 'Valid phone number is required (at least 7 digits)'),
  studentId: z.string().min(1, 'Student ID / Roll number is required'),
  yearOfStudy: z.number().int().min(1).max(5),
  branch: z.string().min(1, 'Academic branch/major is required'),
  interest: TrackInterestSchema,
  githubOrPortfolio: z.string().max(500).optional().nullable().or(z.literal('')),
  statementOfPurpose: z.string().min(5, 'Please share at least a few words about what you want to build or learn'),
  turnstileToken: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});
export type JoinApplication = z.infer<typeof JoinApplicationSchema>;

export const ContactMessageSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(2, 'Subject is required'),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  turnstileToken: z.string().optional(),
  createdAt: z.string().datetime().optional(),
});
export type ContactMessage = z.infer<typeof ContactMessageSchema>;

import { z } from 'zod';
import { ContentStatusSchema } from './common';

export const MemberRoleSchema = z.enum([
  'COORDINATOR',
  'CO_COORDINATOR',
  'LEAD',
  'MEMBER',
]).or(z.string());
export type MemberRole = z.infer<typeof MemberRoleSchema>;

export const MemberSocialsSchema = z.object({
  github: z.string().optional().nullable().or(z.literal('')),
  linkedin: z.string().optional().nullable().or(z.literal('')),
  twitter: z.string().optional().nullable().or(z.literal('')),
  portfolio: z.string().optional().nullable().or(z.literal('')),
});
export type MemberSocials = z.infer<typeof MemberSocialsSchema>;

export const MemberSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  photoUrl: z.string().optional().nullable().or(z.literal('')),
  avatar: z.string().optional().nullable().or(z.literal('')),
  bio: z.string().max(1000).optional().nullable(),
  socials: MemberSocialsSchema.optional(),
  github: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  position: MemberRoleSchema.optional(),
  role: z.string().optional(),
  domain: z.string().optional(),
  academicYear: z.string().min(4).optional(),
  skills: z.array(z.string()).default([]).optional(),
  isCurrent: z.boolean().default(true).optional(),
  isLead: z.boolean().default(false).optional(),
  order: z.number().int().default(0).optional(),
  status: ContentStatusSchema.default('PUBLISHED').optional(),
  published: z.boolean().default(true).optional(),
});
export type Member = z.infer<typeof MemberSchema>;

export const AlumniSchema = z.object({
  id: z.string().uuid().optional(),
  memberId: z.string().uuid().optional(),
  name: z.string().min(2),
  photoUrl: z.string().optional().nullable().or(z.literal('')),
  avatar: z.string().optional().nullable().or(z.literal('')),
  batch: z.string().min(2),
  currentRole: z.string().min(2).optional(),
  role: z.string().optional(),
  company: z.string().min(2),
  quote: z.string().max(1000).optional().nullable(),
  socials: MemberSocialsSchema.optional(),
  consentAt: z.string().optional().default(() => new Date().toISOString()),
  status: ContentStatusSchema.default('PUBLISHED').optional(),
  published: z.boolean().default(true).optional(),
});
export type Alumni = z.infer<typeof AlumniSchema>;

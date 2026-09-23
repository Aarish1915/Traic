import { z } from 'zod';
import { ContentStatusSchema } from './common';

export const ProjectCategorySchema = z.enum(['HARDWARE', 'SOFTWARE', 'HYBRID']);
export type ProjectCategory = z.infer<typeof ProjectCategorySchema>;

export const ProjectMemberRoleSchema = z.object({
  memberId: z.string().uuid().optional(),
  name: z.string(),
  roleInProject: z.string(),
});
export type ProjectMemberRole = z.infer<typeof ProjectMemberRoleSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3),
  tagline: z.string().min(5).max(160),
  descriptionMd: z.string(),
  category: ProjectCategorySchema,
  year: z.number().int().min(2018).max(2100),
  techStack: z.array(z.string()).min(1),
  repoUrl: z.string().url().optional().or(z.literal('')),
  demoUrl: z.string().url().optional().or(z.literal('')),
  featured: z.boolean().default(false),
  posterAssetUrl: z.string().url().optional().or(z.literal('')),
  model3dAssetUrl: z.string().url().optional().or(z.literal('')),
  team: z.array(ProjectMemberRoleSchema).default([]),
  status: ContentStatusSchema.default('DRAFT'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;

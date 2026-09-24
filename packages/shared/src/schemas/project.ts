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

export const ProjectBOMItemSchema = z.object({
  component: z.string().min(1, 'Component required'),
  partNumber: z.string().min(1, 'Part number required'),
  function: z.string().min(1, 'Function required'),
});
export type ProjectBOMItem = z.infer<typeof ProjectBOMItemSchema>;

export const ProjectSpecItemSchema = z.object({
  label: z.string().min(1, 'Spec label required'),
  value: z.string().min(1, 'Spec value required'),
});
export type ProjectSpecItem = z.infer<typeof ProjectSpecItemSchema>;

export const ProjectSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(3),
  tagline: z.string().min(5).max(160),
  descriptionMd: z.string(),
  category: ProjectCategorySchema,
  year: z.number().int().min(2018).max(2100),
  techStack: z.array(z.string()).min(1),
  repoUrl: z.string().optional().nullable().or(z.literal('')),
  demoUrl: z.string().optional().nullable().or(z.literal('')),
  featured: z.boolean().default(false),
  posterAssetUrl: z.string().optional().nullable().or(z.literal('')),
  model3dAssetUrl: z.string().optional().nullable().or(z.literal('')),
  specs: z.array(ProjectSpecItemSchema).optional(),
  bom: z.array(ProjectBOMItemSchema).optional(),
  team: z.array(ProjectMemberRoleSchema).default([]),
  status: ContentStatusSchema.default('DRAFT'),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});
export type Project = z.infer<typeof ProjectSchema>;


import { z } from 'zod';
import { ContentStatusSchema } from './common';

export const AchievementLevelSchema = z.enum(['INTERNAL', 'EXTERNAL', 'NATIONAL', 'INTERNATIONAL']).or(z.string());
export type AchievementLevel = z.infer<typeof AchievementLevelSchema>;

export const AchievementSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1).optional(),
  award: z.string().min(1).optional(),
  eventName: z.string().min(1).optional(),
  event: z.string().min(1).optional(),
  level: AchievementLevelSchema.optional(),
  category: z.string().optional(),
  rank: z.string().optional(),
  date: z.string().optional(),
  year: z.string().optional(),
  description: z.string().optional().nullable(),
  descriptionMd: z.string().optional().nullable(),
  projectId: z.string().uuid().optional(),
  certificateAssetUrl: z.string().optional().nullable().or(z.literal('')),
  photos: z.array(z.string()).default([]).optional(),
  status: ContentStatusSchema.default('PUBLISHED').optional(),
  published: z.boolean().default(true).optional(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

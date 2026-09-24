import { z } from 'zod';
import { ContentStatusSchema } from './common';

export const AchievementLevelSchema = z.enum(['INTERNAL', 'EXTERNAL', 'NATIONAL', 'INTERNATIONAL']);
export type AchievementLevel = z.infer<typeof AchievementLevelSchema>;

export const AchievementSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  eventName: z.string().min(3),
  level: AchievementLevelSchema,
  rank: z.string().min(1), // e.g. "1st Place", "Winner", "Finalist"
  date: z.string().min(4),
  projectId: z.string().uuid().optional(),
  certificateAssetUrl: z.string().optional().nullable().or(z.literal('')),
  photos: z.array(z.string()).default([]),
  status: ContentStatusSchema.default('PUBLISHED'),
});
export type Achievement = z.infer<typeof AchievementSchema>;

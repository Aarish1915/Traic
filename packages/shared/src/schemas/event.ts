import { z } from 'zod';
import { ContentStatusSchema } from './common';

export const EventModeSchema = z.enum(['ONLINE', 'OFFLINE', 'HYBRID']);
export type EventMode = z.infer<typeof EventModeSchema>;

export const EventSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  title: z.string().min(3),
  tagline: z.string().max(160).optional(),
  descriptionMd: z.string(),
  type: z.string().min(2), // Workshop, Hackathon, Boot Camp, Tech Talk
  mode: EventModeSchema.default('OFFLINE'),
  venue: z.string().min(2),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional(),
  registerUrl: z.string().url().optional().or(z.literal('')),
  bannerAssetUrl: z.string().url().optional(),
  photos: z.array(z.string().url()).default([]),
  status: ContentStatusSchema.default('PUBLISHED'),
});
export type Event = z.infer<typeof EventSchema>;

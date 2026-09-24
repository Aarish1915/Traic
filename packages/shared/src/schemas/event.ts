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
  startsAt: z.string().min(1),
  endsAt: z.string().optional().nullable().or(z.literal('')),
  registerUrl: z.string().optional().nullable().or(z.literal('')),
  bannerAssetUrl: z.string().optional().nullable().or(z.literal('')),
  photos: z.array(z.string()).default([]),
  status: ContentStatusSchema.default('PUBLISHED'),
});
export type Event = z.infer<typeof EventSchema>;

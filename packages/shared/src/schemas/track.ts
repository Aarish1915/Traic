import { z } from 'zod';

export const TrackLevelSchema = z.enum(['FOUNDATION', 'INTERMEDIATE', 'ADVANCED']);
export type TrackLevel = z.infer<typeof TrackLevelSchema>;

export const TrackModuleSchema = z.object({
  title: z.string(),
  description: z.string(),
  topics: z.array(z.string()),
});
export type TrackModule = z.infer<typeof TrackModuleSchema>;

export const TrackSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(3),
  title: z.string().min(2),
  summary: z.string(),
  level: TrackLevelSchema,
  tools: z.array(z.string()),
  outcomes: z.array(z.string()),
  modules: z.array(TrackModuleSchema).default([]),
  order: z.number().int().default(0),
});
export type Track = z.infer<typeof TrackSchema>;

export const ProcessStepSchema = z.object({
  stepNumber: z.number().int().min(1),
  title: z.string(), // Learn -> Build -> Test -> Showcase -> Compete
  shortTag: z.string(),
  description: z.string(),
  highlights: z.array(z.string()),
  stationKey: z.enum(['learn', 'build', 'test', 'showcase', 'compete']),
});
export type ProcessStep = z.infer<typeof ProcessStepSchema>;

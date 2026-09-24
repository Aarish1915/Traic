import { z } from 'zod';

export const SiteSocialsSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  instagram: z.string().url().optional(),
  youtube: z.string().url().optional(),
  discord: z.string().url().optional(),
});
export type SiteSocials = z.infer<typeof SiteSocialsSchema>;

export const AnnouncementBannerSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string(),
  linkUrl: z.string().optional(),
  linkText: z.string().optional(),
});
export type AnnouncementBanner = z.infer<typeof AnnouncementBannerSchema>;

export const SiteStatsSchema = z.object({
  yearsActive: z.number().default(5),
  projectsBuilt: z.number().default(40),
  awardsWon: z.number().default(25),
  activeMembers: z.number().default(80),
});
export type SiteStats = z.infer<typeof SiteStatsSchema>;

export const BannerTypeSchema = z.enum(['ANNOUNCEMENT', 'EVENT', 'URGENT', 'ACHIEVEMENT']);
export type BannerType = z.infer<typeof BannerTypeSchema>;

export const BannerSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2),
  message: z.string().min(3),
  linkUrl: z.string().optional().or(z.literal('')),
  linkText: z.string().optional().or(z.literal('')),
  type: BannerTypeSchema.default('ANNOUNCEMENT'),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(1),
  createdAt: z.string().optional(),
});
export type Banner = z.infer<typeof BannerSchema>;

export const SiteSettingSchema = z.object({
  clubName: z.string().default('TRAIC'),
  tagline: z.string().default('Engineering Community Building Hardware + Software'),
  heroHeadline: z.string().default('Where Hardware Meets Intelligent Code'),
  heroSubheadline: z.string().default('Building autonomous robots, embedded devices, and deep-tech software that compete and win at the national stage.'),
  announcement: AnnouncementBannerSchema.optional(),
  stats: SiteStatsSchema.default({
    yearsActive: 5,
    projectsBuilt: 40,
    awardsWon: 25,
    activeMembers: 80,
  }),
  socials: SiteSocialsSchema.optional(),
});
export type SiteSetting = z.infer<typeof SiteSettingSchema>;

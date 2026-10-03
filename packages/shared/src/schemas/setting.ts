import { z } from 'zod';

export const SiteSocialsSchema = z.object({
  github: z.string().url().optional().or(z.literal('')),
  linkedin: z.string().url().optional().or(z.literal('')),
  instagram: z.string().url().optional().or(z.literal('')),
  youtube: z.string().url().optional().or(z.literal('')),
  discord: z.string().url().optional().or(z.literal('')),
});
export type SiteSocials = z.infer<typeof SiteSocialsSchema>;

export const AnnouncementBannerSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string(),
  linkUrl: z.string().optional().or(z.literal('')),
  linkText: z.string().optional().or(z.literal('')),
});
export type AnnouncementBanner = z.infer<typeof AnnouncementBannerSchema>;

export const SiteStatsSchema = z.object({
  yearsActive: z.number().default(5),
  yearsActiveLabel: z.string().default('Years of Engineering'),
  projectsBuilt: z.number().default(42),
  projectsBuiltLabel: z.string().default('Hardware & AI Projects'),
  awardsWon: z.number().default(28),
  awardsWonLabel: z.string().default('National Awards Won'),
  activeMembers: z.number().default(95),
  activeMembersLabel: z.string().default('Active Student Builders'),
});
export type SiteStats = z.infer<typeof SiteStatsSchema>;

export const SectionTogglesSchema = z.object({
  showStats: z.boolean().default(true),
  showProjects: z.boolean().default(true),
  showGear: z.boolean().default(true),
  showAchievements: z.boolean().default(true),
  showGallery: z.boolean().default(true),
});
export type SectionToggles = z.infer<typeof SectionTogglesSchema>;

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
  mottoText: z.string().default('HONOR • HONESTY • SACRIFICE'),
  showMotto: z.boolean().default(true),
  heroHeadline: z.string().default('Where Hardware Meets Intelligent Code'),
  heroSubheadline: z.string().default('Building autonomous robots, embedded devices, and deep-tech software that compete and win at the national stage.'),
  heroPrimaryCtaText: z.string().default('Explore Projects'),
  heroPrimaryCtaUrl: z.string().default('/projects'),
  heroSecondaryCtaText: z.string().default('Join the 2025 Cohort'),
  heroSecondaryCtaUrl: z.string().default('/join'),
  announcement: AnnouncementBannerSchema.optional(),
  stats: SiteStatsSchema.default({
    yearsActive: 5,
    yearsActiveLabel: 'Years of Engineering',
    projectsBuilt: 42,
    projectsBuiltLabel: 'Hardware & AI Projects',
    awardsWon: 28,
    awardsWonLabel: 'National Awards Won',
    activeMembers: 95,
    activeMembersLabel: 'Active Student Builders',
  }),
  sectionToggles: SectionTogglesSchema.default({
    showStats: true,
    showProjects: true,
    showGear: true,
    showAchievements: true,
    showGallery: true,
  }),
  contactEmail: z.string().email().default('traic@coer.ac.in'),
  labLocation: z.string().default('Advanced Robotics Lab, Block C-302, COER University'),
  socials: SiteSocialsSchema.optional(),
});
export type SiteSetting = z.infer<typeof SiteSettingSchema>;

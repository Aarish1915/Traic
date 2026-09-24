import { z } from 'zod';

export const GalleryCategorySchema = z.enum([
  'ROBOTICS',
  'FABRICATION',
  'COMPETITION',
  'WORKSHOP',
  'LAB_LIFE',
]);
export type GalleryCategory = z.infer<typeof GalleryCategorySchema>;

export const GalleryItemSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(3),
  caption: z.string().min(5),
  imageUrl: z.string(),
  category: GalleryCategorySchema,
  date: z.string(),
  location: z.string().optional(),
  featured: z.boolean().default(false),
  projectSlug: z.string().optional(),
});
export type GalleryItem = z.infer<typeof GalleryItemSchema>;

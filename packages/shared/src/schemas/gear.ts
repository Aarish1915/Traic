import { z } from 'zod';

export const LabGearCategorySchema = z.enum([
  'TESTING',
  'SOLDERING',
  'FABRICATION',
  'COMPUTE',
  'ROBOTICS',
]);
export type LabGearCategory = z.infer<typeof LabGearCategorySchema>;

export const LabGearStatusSchema = z.enum([
  'OPERATIONAL',
  'IN_USE',
  'MAINTENANCE',
]);
export type LabGearStatus = z.infer<typeof LabGearStatusSchema>;

export const LabGearSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2),
  model: z.string().min(2),
  category: LabGearCategorySchema.default('TESTING'),
  specifications: z.string().min(3),
  status: LabGearStatusSchema.default('OPERATIONAL'),
  imageUrl: z.string().optional().or(z.literal('')),
  priority: z.number().int().default(1),
  isPublished: z.boolean().default(true),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});
export type LabGear = z.infer<typeof LabGearSchema>;

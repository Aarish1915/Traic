import { z } from 'zod';

export const ContentStatusSchema = z.enum(['DRAFT', 'PUBLISHED']);
export type ContentStatus = z.infer<typeof ContentStatusSchema>;

export const ApiErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
    requestId: z.string().optional(),
  }),
});
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

export const ApiResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    data: schema,
    requestId: z.string().optional(),
  });

export const PaginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;

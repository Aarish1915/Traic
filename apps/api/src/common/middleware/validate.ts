import type { Request, Response, NextFunction } from 'express';
import { type AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '../errors';

export function validateBody(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Invalid request payload', error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
}

export function validateQuery(schema: AnyZodObject) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      req.query = (await schema.parseAsync(req.query)) as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        next(new ValidationError('Invalid query parameters', error.flatten().fieldErrors));
      } else {
        next(error);
      }
    }
  };
}

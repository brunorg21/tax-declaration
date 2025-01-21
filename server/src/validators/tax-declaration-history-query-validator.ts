import { z } from 'zod';

export const taxDeclarationHistoryQueryValidator = z
  .string()
  .optional()
  .default(new Date().getFullYear().toString())
  .transform(Number);

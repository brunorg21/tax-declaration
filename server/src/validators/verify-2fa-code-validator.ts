import { z } from 'zod';

export const verify2faCodeValidator = z.object({
  secret: z.string(),
  token: z.string(),
});

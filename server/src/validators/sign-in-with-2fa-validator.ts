import { z } from 'zod';

export const signInWith2faValidator = z.object({
  userId: z.string(),
  token: z.string(),
});

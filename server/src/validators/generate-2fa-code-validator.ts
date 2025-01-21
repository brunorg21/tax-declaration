import { z } from 'zod';

export const generate2faCodeValidator = z.string().email();

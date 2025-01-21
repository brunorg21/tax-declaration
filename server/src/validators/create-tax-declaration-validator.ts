import { TaxDeclarationTypes } from '@prisma/client';
import { z } from 'zod';

export const createTaxDeclarationValidator = z.object({
  medicalExpenses: z.number(),
  educationExpenses: z.number(),
  earnings: z.number(),
  alimony: z.number(),
  socialSecurityContribution: z.number(),
  complementarySocialSecurityContribution: z.number(),
  status: z
    .enum([
      TaxDeclarationTypes.SUBMITTED,
      TaxDeclarationTypes.UNSUBMITTED,
      TaxDeclarationTypes.RECTIFIED,
    ])
    .default(TaxDeclarationTypes.UNSUBMITTED),
  dependents: z
    .array(
      z.object({
        name: z.string({
          required_error: 'Dependent name is required',
        }),
        birthDate: z.coerce.date(),
        cpf: z
          .string()
          .regex(
            /^(?!000\.000\.000\-00)(?!111\.111\.111\-11)(?!222\.222\.222\-22)(?!333\.333\.333\-33)(?!444\.444\.444\-44)(?!555\.555\.555\-55)(?!666\.666\.666\-66)(?!777\.777\.777\-77)(?!888\.888\.888\-88)(?!999\.999\.999\-99)\d{3}\.\d{3}\.\d{3}\-\d{2}$/,
            {
              message: 'Invalid CPF format',
            },
          ),
        email: z
          .string()
          .refine(
            (val) => val === '' || z.string().email().safeParse(val).success,
            {
              message: 'E-mail inválido',
            },
          )
          .nullable()
          .default(null),
      }),
    )
    .optional()
    .default([]),
});

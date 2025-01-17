import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TaxDeclarationService } from './tax-declaration.service';
import { ApiBearerAuth, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateTaxDeclarationDTO } from '@/dtos/create-tax-declaration-dto';
import { TaxDeclarationTypes } from '@prisma/client';
import { CurrentUser, UserPayload } from '@/auth/current-user-decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { UpdateTaxDeclarationDTO } from '@/dtos/update-tax-declaration-dto';

const yearQuerySchema = z
  .string()
  .optional()
  .default(new Date().getFullYear().toString())
  .transform(Number);

const queryYearValdationPipe = new ZodValidationPipe(yearQuerySchema);

const taxDeclarationIdParamSchema = z.string();

const taxDeclarationIdValidationPipe = new ZodValidationPipe(
  taxDeclarationIdParamSchema,
);

const createTaxDeclarationSchema = z.object({
  medicalExpenses: z.number(),
  educationExpenses: z.number(),
  earnings: z.number(),
  alimony: z.number(),
  socialSecurityContribution: z.number(),
  complementarySocialSecurityContribution: z.number(),
  status: z
    .enum([TaxDeclarationTypes.UNSUBMMITED, TaxDeclarationTypes.SUBMMITED])
    .default(TaxDeclarationTypes.UNSUBMMITED),
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
        email: z.string().email(),
      }),
    )
    .optional()
    .default([]),
});

const updateTaxDeclarationSchema = z.object({
  medicalExpenses: z.number(),
  educationExpenses: z.number(),
  earnings: z.number(),
  alimony: z.number(),
  socialSecurityContribution: z.number(),
  complementarySocialSecurityContribution: z.number(),
  status: z
    .enum([TaxDeclarationTypes.UNSUBMMITED, TaxDeclarationTypes.SUBMMITED])
    .default(TaxDeclarationTypes.UNSUBMMITED),
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
        email: z.string().email(),
      }),
    )
    .optional()
    .default([]),
});

type UpdateTaxDeclarationType = z.infer<typeof updateTaxDeclarationSchema>;
type CreateTaxDeclarationType = z.infer<typeof createTaxDeclarationSchema>;

const createTaxDeclarationValidationPipe = new ZodValidationPipe(
  createTaxDeclarationSchema,
);

const updateTaxDeclarationValidationPipe = new ZodValidationPipe(
  updateTaxDeclarationSchema,
);

@ApiBearerAuth()
@Controller('tax-declarations')
export class TaxDeclarationController {
  constructor(private taxDeclarationService: TaxDeclarationService) {}

  @Post()
  @ApiBody({ type: CreateTaxDeclarationDTO })
  async create(
    @CurrentUser() user: UserPayload,
    @Body(createTaxDeclarationValidationPipe)
    {
      complementarySocialSecurityContribution,
      earnings,
      educationExpenses,
      medicalExpenses,
      socialSecurityContribution,
      status,
      alimony,
      dependents,
    }: CreateTaxDeclarationType,
  ) {
    await this.taxDeclarationService.create({
      complementarySocialSecurityContribution,
      earnings,
      educationExpenses,
      medicalExpenses,
      socialSecurityContribution,
      status,
      userId: user.sub,
      alimony,
      dependents: dependents.map((e) => ({
        birthDate: e.birthDate,
        cpf: e.cpf,
        email: e.email,
        name: e.name,
      })),
    });
  }

  @Get('/history')
  @ApiQuery({ name: 'year', type: Number, default: new Date().getFullYear() })
  async findManyByYear(
    @CurrentUser() user: UserPayload,
    @Query('year', queryYearValdationPipe) year: number,
  ) {
    return await this.taxDeclarationService.findManyByYear(user.sub, year);
  }

  @Put(':taxDeclarationId')
  @HttpCode(204)
  @ApiBody({ type: UpdateTaxDeclarationDTO })
  @ApiParam({ name: 'taxDeclarationId', type: 'string' })
  async update(
    @Body(updateTaxDeclarationValidationPipe)
    data: UpdateTaxDeclarationType,
    @Param('taxDeclarationId', taxDeclarationIdValidationPipe)
    taxDeclarationId: string,
  ) {
    await this.taxDeclarationService.update(taxDeclarationId, {
      alimony: data.alimony,
      complementarySocialSecurityContribution:
        data.complementarySocialSecurityContribution,
      dependents:
        data.dependents?.map((e) => ({
          birthDate: e.birthDate,
          cpf: e.cpf,
          email: e.email,
          name: e.name,
        })) ?? [],
      earnings: data.earnings,
      educationExpenses: data.educationExpenses,
      medicalExpenses: data.medicalExpenses,
      socialSecurityContribution: data.socialSecurityContribution,
      status: data.status,
    });
  }

  @Get(':taxDeclarationId')
  @ApiParam({ name: 'taxDeclarationId', type: 'string' })
  async findUnique(
    @Param('taxDeclarationId', taxDeclarationIdValidationPipe)
    taxDeclarationId: string,
  ) {
    return await this.taxDeclarationService.findUnique(taxDeclarationId);
  }
}

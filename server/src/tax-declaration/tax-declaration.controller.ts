import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { TaxDeclarationService } from './tax-declaration.service';
import { ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { CreateTaxDeclarationDTO } from '@/dtos/create-tax-declaration-dto';
import { Prisma, TaxDeclarationTypes } from '@prisma/client';
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
  medicalExpenses: z.string(),
  educationExpenses: z.string(),
  earnings: z.string(),
  alimony: z.string(),
  socialSecurityContribution: z.string(),
  complementarySocialSecurityContribution: z.string(),
  status: z
    .enum([TaxDeclarationTypes.UNSUBMMITED, TaxDeclarationTypes.SUBMMITED])
    .default(TaxDeclarationTypes.UNSUBMMITED),
  userId: z.string(),
});

const updateTaxDeclarationSchema = z.object({
  medicalExpenses: z.string(),
  educationExpenses: z.string(),
  earnings: z.string(),
  alimony: z.string(),
  socialSecurityContribution: z.string(),
  complementarySocialSecurityContribution: z.string(),
  status: z
    .enum([TaxDeclarationTypes.UNSUBMMITED, TaxDeclarationTypes.SUBMMITED])
    .default(TaxDeclarationTypes.UNSUBMMITED),
});

type UpdateTaxDeclarationType = z.infer<typeof updateTaxDeclarationSchema>;

const createTaxDeclarationValidationPipe = new ZodValidationPipe(
  createTaxDeclarationSchema,
);

@Controller('tax-declaration')
export class TaxDeclarationController {
  constructor(private taxDeclarationService: TaxDeclarationService) {}

  @Post()
  @ApiBody({ type: CreateTaxDeclarationDTO })
  async create(
    @Body(createTaxDeclarationValidationPipe)
    taxDeclaration: Prisma.TaxDeclarationCreateInput,
  ) {
    await this.taxDeclarationService.create(taxDeclaration);
  }

  @Get(':year')
  @ApiQuery({ name: 'year', type: Number, default: new Date().getFullYear() })
  async findManyByYear(
    @CurrentUser() user: UserPayload,
    @Query('year', queryYearValdationPipe) year: number,
  ) {
    return await this.taxDeclarationService.findManyByYear(user.sub, year);
  }

  @Put(':taxDeclarationId')
  @ApiBody({ type: UpdateTaxDeclarationDTO })
  @ApiParam({ name: 'taxDeclarationId', type: 'string' })
  async update(
    @Query('taxDeclarationId', taxDeclarationIdValidationPipe)
    taxDeclarationId: string,
    @Body(updateTaxDeclarationSchema)
    data: UpdateTaxDeclarationType,
  ) {
    await this.taxDeclarationService.update(taxDeclarationId, data);
  }
}

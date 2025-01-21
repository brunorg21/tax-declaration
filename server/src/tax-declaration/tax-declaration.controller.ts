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
import { CurrentUser, UserPayload } from '@/auth/current-user-decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { UpdateTaxDeclarationDTO } from '@/dtos/update-tax-declaration-dto';
import { createTaxDeclarationValidator } from '@/validators/create-tax-declaration-validator';
import { updateTaxDeclarationValidator } from '@/validators/update-tax-declaration-validator';
import { taxDeclarationHistoryQueryValidator } from '@/validators/tax-declaration-history-query-validator';

const queryYearValdationPipe = new ZodValidationPipe(
  taxDeclarationHistoryQueryValidator,
);

const taxDeclarationIdParamSchema = z.string();

const taxDeclarationIdValidationPipe = new ZodValidationPipe(
  taxDeclarationIdParamSchema,
);

const createTaxDeclarationValidationPipe = new ZodValidationPipe(
  createTaxDeclarationValidator,
);

const updateTaxDeclarationValidationPipe = new ZodValidationPipe(
  updateTaxDeclarationValidator,
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
    }: CreateTaxDeclarationDTO,
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
    data: UpdateTaxDeclarationDTO,
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

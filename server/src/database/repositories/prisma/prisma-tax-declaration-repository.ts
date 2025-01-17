import { TaxDeclaration } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma-service';
import { TaxDeclarationRepository } from '../tax-declaration-repository';
import {
  CreateTaxDeclarationRequest,
  UpdateTaxDeclarationRequest,
} from '@/tax-declaration/tax-declaration.service';

@Injectable()
export class PrismaTaxDeclarationRepository
  implements TaxDeclarationRepository
{
  constructor(private prismaService: PrismaService) {}
  async findById(taxDeclarationId: string): Promise<TaxDeclaration | null> {
    const taxDeclaration = await this.prismaService.taxDeclaration.findUnique({
      where: {
        id: taxDeclarationId,
      },
    });

    if (!taxDeclaration) {
      return null;
    }

    return taxDeclaration;
  }
  async save({
    alimony,
    complementarySocialSecurityContribution,
    dependents,
    earnings,
    educationExpenses,
    medicalExpenses,
    socialSecurityContribution,
    status,
    userId,
  }: CreateTaxDeclarationRequest): Promise<void> {
    await this.prismaService.taxDeclaration.create({
      data: {
        complementarySocialSecurityContribution,
        alimony,
        earnings,
        educationExpenses,
        medicalExpenses,
        socialSecurityContribution,
        status,
        dependents: {
          createMany: {
            data: dependents.map((e) => ({
              birthDate: e.birthDate,
              cpf: e.cpf,
              email: e.email,
              name: e.name,
            })),
          },
        },
        userId,
      },
    });
  }
  async findManyByYear(
    userId: string,
    year: number,
  ): Promise<TaxDeclaration[]> {
    const startOfYear = new Date(year, 0, 1);
    const startOfNextYear = new Date(year + 1, 0, 1);

    const taxeDeclarations = await this.prismaService.taxDeclaration.findMany({
      where: {
        userId,
        createdAt: {
          gte: startOfYear,
          lt: startOfNextYear,
        },
      },
      include: {
        dependents: true,
      },
    });

    return taxeDeclarations;
  }

  async findUnique(taxDeclarationId: string): Promise<TaxDeclaration | null> {
    const taxDeclaration = await this.prismaService.taxDeclaration.findUnique({
      where: {
        id: taxDeclarationId,
      },
      include: {
        dependents: true,
      },
    });

    if (!taxDeclaration) {
      return null;
    }

    return taxDeclaration;
  }
  async update(
    data: UpdateTaxDeclarationRequest,
    taxDeclarationId: string,
  ): Promise<void> {
    const updateData: any = {
      ...data,
      dependents: undefined,
    };

    if (data.dependents && data.dependents.length > 0) {
      updateData.dependents = {
        updateMany: {
          data: data.dependents.map((e) => ({
            birthDate: e.birthDate,
            cpf: e.cpf,
            email: e.email,
            name: e.name,
          })),
          where: {
            taxDeclarationId,
          },
        },
      };
    }

    await this.prismaService.taxDeclaration.update({
      where: {
        id: taxDeclarationId,
      },
      data: updateData,
    });
  }
}

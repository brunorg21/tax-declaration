import { Prisma, TaxDeclaration } from '@prisma/client';

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma-service';
import { TaxDeclarationRepository } from '../tax-declaration-repository';

@Injectable()
export class PrismaTaxDeclarationRepository
  implements TaxDeclarationRepository
{
  constructor(private prismaService: PrismaService) {}
  async save(taxDeclaration: Prisma.TaxDeclarationCreateInput): Promise<void> {
    await this.prismaService.taxDeclaration.create({ data: taxDeclaration });
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
    });

    return taxeDeclarations;
  }

  async findUnique(taxDeclarationId: string): Promise<TaxDeclaration | null> {
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
  async update(
    data: Prisma.TaxDeclarationUpdateInput,
    taxDeclarationId: string,
  ): Promise<void> {
    await this.prismaService.taxDeclaration.update({
      where: {
        id: taxDeclarationId,
      },
      data,
    });
  }
}

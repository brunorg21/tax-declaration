import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma-service';
import { TaxDeclarationHistoryRepository } from '../tax-declaration-history-repository';
import { Prisma, TaxDeclarationHistory } from '@prisma/client';

@Injectable()
export class PrismaTaxDeclarationHistoryRepository
  implements TaxDeclarationHistoryRepository
{
  constructor(private prismaService: PrismaService) {}
  async update(data: TaxDeclarationHistory): Promise<void> {
    await this.prismaService.taxDeclarationHistory.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
  async findUniqueByTaxDeclarationId(
    taxDeclarationId: string,
  ): Promise<TaxDeclarationHistory | null> {
    const taxDeclarationHistory =
      await this.prismaService.taxDeclarationHistory.findFirst({
        where: {
          taxDeclarationId,
        },
      });

    if (!taxDeclarationHistory) {
      return null;
    }

    return taxDeclarationHistory;
  }
  async save(
    taxDeclarationHistory: Prisma.TaxDeclarationHistoryUncheckedCreateInput,
  ): Promise<void> {
    await this.prismaService.taxDeclarationHistory.create({
      data: taxDeclarationHistory,
    });
  }
  async findManyByOriginalTaxDeclaration(
    taxDeclarationId: string,
  ): Promise<TaxDeclarationHistory[]> {
    const taxDeclarationHistories =
      await this.prismaService.taxDeclarationHistory.findMany({
        where: {
          taxDeclarationId,
        },
        include: {
          taxDeclaration: true,
        },
      });

    return taxDeclarationHistories;
  }
}

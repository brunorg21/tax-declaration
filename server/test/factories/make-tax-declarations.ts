import { Injectable } from '@nestjs/common';
import { Prisma, TaxDeclaration } from '@prisma/client';
import { PrismaService } from '../../src/database/prisma-service';

@Injectable()
export class TaxDeclarationFactory {
  constructor(private prisma: PrismaService) {}

  async makeTaxDeclaration(
    data: Prisma.TaxDeclarationUncheckedCreateInput,
  ): Promise<TaxDeclaration> {
    const taxDeclaration = await this.prisma.taxDeclaration.create({
      data,
    });

    return taxDeclaration;
  }
}

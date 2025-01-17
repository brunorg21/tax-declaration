import { PrismaService } from '@/database/prisma-service';
import { Injectable } from '@nestjs/common';
import { DependentsRepository } from '../dependents-repository';
import { Prisma, Dependents } from '@prisma/client';

@Injectable()
export class PrismaDependentsRepository implements DependentsRepository {
  constructor(private prismaService: PrismaService) {}
  async save(dependents: Prisma.DependentsUncheckedCreateInput): Promise<void> {
    await this.prismaService.dependents.create({ data: dependents });
  }
  async findManyByTaxDeclarationId(
    taxDeclarationId: string,
  ): Promise<Dependents[]> {
    const dependents = await this.prismaService.dependents.findMany({
      where: {
        taxDeclarationId,
      },
    });

    return dependents;
  }
}

import { PrismaService } from '@/database/prisma-service';
import { Injectable } from '@nestjs/common';
import { DependentsRepository } from '../dependents-repository';
import { Prisma, Dependents } from '@prisma/client';

@Injectable()
export class PrismaDependentsRepository implements DependentsRepository {
  constructor(private prismaService: PrismaService) {}
  async update(dependent: Dependents): Promise<void> {
    await this.prismaService.dependents.update({
      where: {
        id: dependent.id,
      },
      data: dependent,
    });
  }
  async delete(dependentId: string): Promise<void> {
    await this.prismaService.dependents.delete({
      where: {
        id: dependentId,
      },
    });
  }
  async findByCpfAndEmail(cpf: string): Promise<Dependents | null> {
    const dependent = await this.prismaService.dependents.findFirst({
      where: {
        OR: [
          {
            cpf,
          },
        ],
      },
    });

    if (!dependent) {
      return null;
    }

    return dependent;
  }
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

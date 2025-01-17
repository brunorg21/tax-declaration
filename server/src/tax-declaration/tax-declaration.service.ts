import { TaxDeclarationRepository } from '@/database/repositories/tax-declaration-repository';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class TaxDeclarationService {
  constructor(private taxDeclarationRepository: TaxDeclarationRepository) {}

  async create(taxDeclaration: Prisma.TaxDeclarationCreateInput) {
    await this.taxDeclarationRepository.save(taxDeclaration);
  }

  async findManyByYear(userId: string, year: number) {
    return await this.taxDeclarationRepository.findManyByYear(userId, year);
  }

  async update(
    taxDeclarationId: string,
    data: Prisma.TaxDeclarationUpdateInput,
  ) {
    await this.taxDeclarationRepository.update(data, taxDeclarationId);
  }
}

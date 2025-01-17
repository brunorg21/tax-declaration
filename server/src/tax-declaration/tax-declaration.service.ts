import { TaxDeclarationRepository } from '@/database/repositories/tax-declaration-repository';
import { Injectable } from '@nestjs/common';

export interface CreateTaxDeclarationRequest {
  medicalExpenses: number;
  educationExpenses: number;
  earnings: number;
  alimony: number;
  socialSecurityContribution: number;
  complementarySocialSecurityContribution: number;
  status: 'UNSUBMMITED' | 'SUBMMITED';
  dependents: {
    name: string;
    birthDate: Date;
    cpf: string;
    email: string;
  }[];
  userId: string;
}

export interface UpdateTaxDeclarationRequest {
  medicalExpenses: number;
  educationExpenses: number;
  earnings: number;
  alimony: number;
  socialSecurityContribution: number;
  complementarySocialSecurityContribution: number;
  status: 'UNSUBMMITED' | 'SUBMMITED';
  dependents: {
    name: string;
    birthDate: Date;
    cpf: string;
    email: string;
  }[];
}

@Injectable()
export class TaxDeclarationService {
  constructor(private taxDeclarationRepository: TaxDeclarationRepository) {}

  async create(taxDeclaration: CreateTaxDeclarationRequest) {
    await this.taxDeclarationRepository.save(taxDeclaration);
  }

  async findManyByYear(userId: string, year: number) {
    return await this.taxDeclarationRepository.findManyByYear(userId, year);
  }

  async update(taxDeclarationId: string, data: UpdateTaxDeclarationRequest) {
    await this.taxDeclarationRepository.update(data, taxDeclarationId);
  }

  async findUnique(taxDeclarationId: string) {
    return await this.taxDeclarationRepository.findUnique(taxDeclarationId);
  }
}

import { DependentsRepository } from '@/database/repositories/dependents-repository';
import { TaxDeclarationHistoryRepository } from '@/database/repositories/tax-declaration-history-repository';
import { TaxDeclarationRepository } from '@/database/repositories/tax-declaration-repository';
import { DependentAlreadyExistsError } from '@/errors/dependent-already-exists-error';
import { BadRequestException, Injectable } from '@nestjs/common';

export interface CreateTaxDeclarationRequest {
  medicalExpenses: number;
  educationExpenses: number;
  earnings: number;
  alimony: number;
  socialSecurityContribution: number;
  complementarySocialSecurityContribution: number;
  status: 'UNSUBMITTED' | 'SUBMITTED' | 'RECTIFIED';
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
  status: 'UNSUBMITTED' | 'SUBMITTED' | 'RECTIFIED';
  dependents: {
    name: string;
    birthDate: Date;
    cpf: string;
    email: string;
  }[];
}

@Injectable()
export class TaxDeclarationService {
  constructor(
    private taxDeclarationRepository: TaxDeclarationRepository,
    private dependentsRepository: DependentsRepository,
    private taxDeclarationHistoryRepository: TaxDeclarationHistoryRepository,
  ) {}

  async create(taxDeclaration: CreateTaxDeclarationRequest) {
    for (const dependent of taxDeclaration.dependents) {
      const hasDependentWithSameEmailOrCpf =
        await this.dependentsRepository.findByCpfAndEmail(dependent.cpf);

      if (hasDependentWithSameEmailOrCpf) {
        throw new DependentAlreadyExistsError(dependent.cpf);
      }
    }

    await this.taxDeclarationRepository.save(taxDeclaration);
  }

  async findManyByYear(userId: string, year: number) {
    return await this.taxDeclarationRepository.findManyByYear(userId, year);
  }

  async update(taxDeclarationId: string, data: UpdateTaxDeclarationRequest) {
    const existingTaxDeclaration =
      await this.taxDeclarationRepository.findUnique(taxDeclarationId);

    if (!existingTaxDeclaration) {
      throw new BadRequestException('Declaração não encontrada.');
    }

    const existingDependents = existingTaxDeclaration.dependents;

    if (data.dependents && data.dependents.length > 0) {
      const dependentsToDelete = existingDependents.filter(
        (existing) =>
          !data.dependents.some((newDep) => newDep.cpf === existing.cpf),
      );

      for (const dep of dependentsToDelete) {
        await this.dependentsRepository.delete(dep.id);
      }

      data.dependents.map(async (newDep) => {
        const existingDep = existingDependents.find(
          (dep) => dep.cpf === newDep.cpf,
        );
        if (existingDep) {
          await this.dependentsRepository.update({
            birthDate: newDep.birthDate,
            cpf: newDep.cpf,
            email: newDep.email,
            name: newDep.name,
            id: existingDep.id,
            taxDeclarationId,
          });
        } else {
          await this.dependentsRepository.save({
            birthDate: newDep.birthDate,
            cpf: newDep.cpf,
            email: newDep.email,
            name: newDep.name,
            taxDeclarationId,
          });
        }
      });
    }

    const taxDeclarationHisory =
      await this.taxDeclarationHistoryRepository.findUniqueByTaxDeclarationId(
        taxDeclarationId,
      );

    if (!taxDeclarationHisory) {
      await this.taxDeclarationHistoryRepository.save({
        complementarySocialSecurityContribution:
          existingTaxDeclaration.complementarySocialSecurityContribution,
        alimony: existingTaxDeclaration.alimony,
        earnings: existingTaxDeclaration.earnings,
        educationExpenses: existingTaxDeclaration.educationExpenses,
        medicalExpenses: existingTaxDeclaration.medicalExpenses,
        socialSecurityContribution:
          existingTaxDeclaration.socialSecurityContribution,
        status: existingTaxDeclaration.status,
        taxDeclarationId,
        userId: existingTaxDeclaration.userId,
        dependentsHistory: JSON.stringify(existingDependents),
      });
    } else {
      await this.taxDeclarationHistoryRepository.update({
        complementarySocialSecurityContribution:
          existingTaxDeclaration.complementarySocialSecurityContribution,
        alimony: existingTaxDeclaration.alimony,
        earnings: existingTaxDeclaration.earnings,
        educationExpenses: existingTaxDeclaration.educationExpenses,
        medicalExpenses: existingTaxDeclaration.medicalExpenses,
        socialSecurityContribution:
          existingTaxDeclaration.socialSecurityContribution,
        status: existingTaxDeclaration.status,
        dependentsHistory: JSON.stringify(existingDependents),
        id: taxDeclarationHisory.id,
        modifiedAt: taxDeclarationHisory.modifiedAt,
        taxDeclarationId: taxDeclarationHisory.taxDeclarationId,
        userId: taxDeclarationHisory.userId,
      });
    }

    await this.taxDeclarationRepository.update(data, taxDeclarationId);
  }

  async findUnique(taxDeclarationId: string) {
    return await this.taxDeclarationRepository.findUnique(taxDeclarationId);
  }
}

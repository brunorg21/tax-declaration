import { Module } from '@nestjs/common';
import { PrismaService } from './prisma-service';
import { UserRepository } from '../database/repositories/user-repository';
import { PrismaUserRepository } from '../database/repositories/prisma/prisma-user-repository';
import { TaxDeclarationRepository } from './repositories/tax-declaration-repository';
import { PrismaTaxDeclarationRepository } from './repositories/prisma/prisma-tax-declaration-repository';
import { DependentsRepository } from './repositories/dependents-repository';
import { PrismaDependentsRepository } from './repositories/prisma/prisma-dependents-repository';
import { TaxDeclarationHistoryRepository } from './repositories/tax-declaration-history-repository';
import { PrismaTaxDeclarationHistoryRepository } from './repositories/prisma/prisma-tax-declaration-history-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
    {
      provide: TaxDeclarationRepository,
      useClass: PrismaTaxDeclarationRepository,
    },
    {
      provide: DependentsRepository,
      useClass: PrismaDependentsRepository,
    },
    {
      provide: TaxDeclarationHistoryRepository,
      useClass: PrismaTaxDeclarationHistoryRepository,
    },
  ],
  exports: [
    PrismaService,
    UserRepository,
    TaxDeclarationRepository,
    DependentsRepository,
    TaxDeclarationHistoryRepository,
  ],
})
export class DatabaseModule {}

import { Module } from '@nestjs/common';
import { PrismaService } from './prisma-service';
import { UserRepository } from '../database/repositories/user-repository';
import { PrismaUserRepository } from '../database/repositories/prisma/prisma-user-repository';
import { TaxDeclarationRepository } from './repositories/tax-declaration-repository';
import { PrismaTaxDeclarationRepository } from './repositories/prisma/prisma-tax-declaration-repository';

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
  ],
  exports: [PrismaService, UserRepository, TaxDeclarationRepository],
})
export class DatabaseModule {}

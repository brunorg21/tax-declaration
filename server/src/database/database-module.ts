import { Module } from '@nestjs/common';
import { PrismaService } from './prisma-service';
import { UserRepository } from '../database/repositories/user-repository';
import { PrismaUserRepository } from '../database/repositories/prisma/prisma-user-repository';

@Module({
  imports: [],
  providers: [
    PrismaService,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [PrismaService, UserRepository],
})
export class DatabaseModule {}

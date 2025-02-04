import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../src/database/prisma-service';

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makeUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }
}

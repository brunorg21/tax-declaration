import { User, Prisma } from '@prisma/client';
import { UserRepository } from '../user-repository';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma-service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prismaService: PrismaService) {}
  async findById(userId: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
  async update(user: User): Promise<void> {
    await this.prismaService.user.update({
      where: {
        id: user.id,
      },
      data: user,
    });
  }
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return user;
  }
  async save(user: Prisma.UserUncheckedCreateInput): Promise<void> {
    await this.prismaService.user.create({ data: user });
  }
}

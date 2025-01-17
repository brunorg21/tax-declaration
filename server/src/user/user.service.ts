import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/database/prisma-service';
import { UserAlreadyExistsError } from 'src/errors/user-already-exists-error';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  async save({ email, password, name }: Prisma.UserCreateInput) {
    const userAlreadyExists = await this.findByEmail(email);

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    await this.prismaService.user.create({
      data: {
        email,
        password: await hash(password, 10),
        name,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }
    return user;
  }
}

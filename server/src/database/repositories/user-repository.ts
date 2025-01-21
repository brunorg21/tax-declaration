import { Prisma, User } from '@prisma/client';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findById(userId: string): Promise<User | null>;
  abstract save(user: Prisma.UserUncheckedCreateInput): Promise<void>;
  abstract update(user: User): Promise<void>;
}

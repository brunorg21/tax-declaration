import { Body, Controller, Get, Post } from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { z } from 'zod';
import { UserService } from './user.service';
import { SkipAuth } from 'src/utils/skip-auth';
import { ApiBody } from '@nestjs/swagger';
import { CreateUserDTO } from '@/dtos/create-user-dto';
import { CurrentUser, UserPayload } from '@/auth/current-user-decorator';

const createUserSchema = z.object({
  name: z.string(),
  password: z.string(),
  email: z.string(),
});

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}

  @SkipAuth()
  @Post()
  @ApiBody({
    type: CreateUserDTO,
  })
  async create(@Body(new ZodValidationPipe(createUserSchema)) user) {
    return await this.usersService.save(user);
  }

  @Get('/me')
  async findById(@CurrentUser() user: UserPayload) {
    const userFound = await this.usersService.findById(user.sub);

    return {
      ...userFound,
      password: undefined,
    };
  }
}

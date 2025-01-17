import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SkipAuth } from '../utils/skip-auth';
import { AuthService } from './auth.service';
import { ApiBody } from '@nestjs/swagger';
import { SignInDTO } from '@/dtos/sign-in-dto';

interface SignInRequest {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiBody({
    type: SignInDTO,
  })
  signIn(@Body() { email, password }: SignInRequest) {
    return this.authService.signIn(email, password);
  }
}

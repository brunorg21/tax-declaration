import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Query,
  Get,
} from '@nestjs/common';
import { SkipAuth } from '../utils/skip-auth';
import { AuthService } from './auth.service';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { SignInDTO } from '@/dtos/sign-in-dto';
import { CurrentUser, UserPayload } from './current-user-decorator';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { verify2faCodeValidator } from '@/validators/verify-2fa-code-validator';
import { Verify2faCodeDTO } from '@/dtos/verify-2fa-code-dto';
import { generate2faCodeValidator } from '@/validators/generate-2fa-code-validator';
import { SignInWith2faDTO } from '@/dtos/sign-in-with-2fa-dto';
import { signInWith2faValidator } from '@/validators/sign-in-with-2fa-validator';

const verify2faCodeValidationPipe = new ZodValidationPipe(
  verify2faCodeValidator,
);
const generate2faCodeValidationPipe = new ZodValidationPipe(
  generate2faCodeValidator,
);
const signInWith2faValidationPipe = new ZodValidationPipe(
  signInWith2faValidator,
);

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  @ApiBody({
    type: SignInDTO,
  })
  signIn(@Body() { email, password }: SignInDTO) {
    return this.authService.signIn(email, password);
  }

  @Get('generate-2fa-code')
  @ApiQuery({
    name: 'email',
    type: String,
  })
  async generateTwoFactorAuth(
    @Query('email', generate2faCodeValidationPipe) email: string,
  ) {
    const { otpauthUrl, base32 } =
      await this.authService.generateTwoFactorSecret(email);
    const qrCode = await this.authService.generateQrCode(otpauthUrl);

    return { qrCode, secret: base32 };
  }

  @Post('verify-2fa-code')
  async verifyTwoFactorAuth(
    @Body(verify2faCodeValidationPipe) body: Verify2faCodeDTO,
    @CurrentUser() user: UserPayload,
  ) {
    const { secret, token } = body;
    await this.authService.verifyTwoFactorCode(secret, token, user.sub);
  }
  @Post('sign-in-with-2fa')
  @SkipAuth()
  @ApiBody({
    type: SignInWith2faDTO,
  })
  async singInWith2fa(
    @Body(signInWith2faValidationPipe) body: SignInWith2faDTO,
  ) {
    const { token, userId } = body;
    const { access_token } = await this.authService.loginWith2fa(token, userId);
    return { access_token };
  }
}

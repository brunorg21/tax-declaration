import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';
import { InvalidCredentialsError } from 'src/errors/invalid-credentials-error';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';

import * as QRCode from 'qrcode';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {
    authenticator.options = {
      window: 1,
    };
  }

  async generateTwoFactorSecret(email: string) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      email,
      'tax-declaration-app',
      secret,
    );
    return {
      otpauthUrl,
      base32: secret,
    };
  }

  async generateQrCode(otpauthUrl: string) {
    return await QRCode.toDataURL(otpauthUrl);
  }

  async verifyTwoFactorCode(secret: string, token: string, userId: string) {
    const isValid = authenticator.check(token, secret);

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }
    const user = await this.userService.findById(userId);

    user.twoFactorEnableSecret = secret;
    user.twoFactorEnabled = true;

    await this.userService.update(user);

    return true;
  }

  async loginWith2fa(token: string, userId: string) {
    const user = await this.userService.findById(userId);

    const isValid = authenticator.check(token, user.twoFactorEnableSecret);

    if (!isValid) {
      throw new BadRequestException('Invalid code');
    }

    const access_token = await this.jwtService.signAsync({
      sub: userId,
    });

    return {
      access_token,
    };
  }

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await compare(pass, user.password);

    if (!isMatch) {
      throw new InvalidCredentialsError();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;

    const access_token = user.twoFactorEnabled
      ? null
      : await this.jwtService.signAsync({
          sub: user.id,
        });

    return {
      ...result,
      access_token,
    };
  }
}

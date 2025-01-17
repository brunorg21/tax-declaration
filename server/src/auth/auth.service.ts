import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare } from 'bcrypt';
import { InvalidCredentialsError } from 'src/errors/invalid-credentials-error';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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

    return {
      ...result,
      access_token: await this.jwtService.signAsync({
        sub: user.id,
      }),
    };
  }
}

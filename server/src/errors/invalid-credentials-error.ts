import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentialsError extends HttpException {
  constructor() {
    super('Invalid Credentials.', HttpStatus.BAD_REQUEST);
  }
}

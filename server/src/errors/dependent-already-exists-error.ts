import { HttpException, HttpStatus } from '@nestjs/common';

export class DependentAlreadyExistsError extends HttpException {
  constructor(cpf: string) {
    super(`Dependente com CPF ${cpf} já existe.`, HttpStatus.BAD_REQUEST);
  }
}

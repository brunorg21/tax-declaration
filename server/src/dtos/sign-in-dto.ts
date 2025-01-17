import { ApiProperty } from '@nestjs/swagger';

export class SignInDTO {
  @ApiProperty({ description: 'The email of the user', format: 'email' })
  email: string;
  @ApiProperty({ description: 'The password of the user' })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class SignInWith2faDTO {
  @ApiProperty({ description: 'The authenticator code of the user' })
  token: string;
  @ApiProperty({ description: 'The user id' })
  userId: string;
}

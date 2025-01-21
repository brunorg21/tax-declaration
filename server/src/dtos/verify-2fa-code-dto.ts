import { ApiProperty } from '@nestjs/swagger';

export class Verify2faCodeDTO {
  @ApiProperty({ description: 'The secret of the user' })
  secret: string;
  @ApiProperty({ description: 'The authenticator code of the user' })
  token: string;
}

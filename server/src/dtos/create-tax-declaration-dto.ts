import { ApiProperty } from '@nestjs/swagger';
import { Dependents, TaxDeclarationTypes } from '@prisma/client';

export class CreateTaxDeclarationDTO {
  @ApiProperty({
    description: 'Medical expenses of the user',
    example: 2000.5,
  })
  medicalExpenses: number;

  @ApiProperty({
    description: 'Education expenses of the user',
    example: 1500.75,
  })
  educationExpenses: number;

  @ApiProperty({ description: 'Earnings of the user', example: '50000.00' })
  earnings: number;

  @ApiProperty({
    description: 'Alimony paid by the user (optional)',
    example: 1000.0,
    required: false,
  })
  alimony?: number;

  @ApiProperty({
    description: 'Social security contributions',
    example: 3000.0,
  })
  socialSecurityContribution: number;

  @ApiProperty({
    description: 'Complementary social security contributions',
    example: 500.0,
  })
  complementarySocialSecurityContribution: number;

  @ApiProperty({
    description: 'Status of the tax declaration',
    enum: TaxDeclarationTypes,
    example: 'UNSUBMITTED',
    default: 'UNSUBMITTED',
  })
  status: TaxDeclarationTypes;

  @ApiProperty({
    description: 'Dependents associated with the tax declaration',
    type: 'array',
    example: [
      {
        name: 'John Doe',
        email: 'jhon@doe.com',
        birthDate: new Date(),
        cpf: '123.456.789-00',
      },
    ],
  })
  dependents: Dependents[];
}

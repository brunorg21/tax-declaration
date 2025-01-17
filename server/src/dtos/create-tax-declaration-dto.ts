import { ApiProperty } from '@nestjs/swagger';
import { TaxDeclarationTypes } from '@prisma/client';

export class CreateTaxDeclarationDTO {
  @ApiProperty({
    description: 'Medical expenses of the user',
    example: '2000.50',
  })
  medicalExpenses: string;

  @ApiProperty({
    description: 'Education expenses of the user',
    example: '1500.75',
  })
  educationExpenses: string;

  @ApiProperty({ description: 'Earnings of the user', example: '50000.00' })
  earnings: string;

  @ApiProperty({
    description: 'Alimony paid by the user (optional)',
    example: '1000.00',
    required: false,
  })
  alimony?: string;

  @ApiProperty({
    description: 'Social security contributions',
    example: '3000.00',
  })
  socialSecurityContribution: string;

  @ApiProperty({
    description: 'Complementary social security contributions',
    example: '500.00',
  })
  complementarySocialSecurityContribution: string;

  @ApiProperty({
    description: 'Status of the tax declaration',
    enum: TaxDeclarationTypes,
    example: 'UNSUBMITTED',
    default: 'UNSUBMITTED',
  })
  status: TaxDeclarationTypes;

  @ApiProperty({
    description: 'User ID associated with the tax declaration',
    example: 'uuid-generated-string',
  })
  userId: string;
}

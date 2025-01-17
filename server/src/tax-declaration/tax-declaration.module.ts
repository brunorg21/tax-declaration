import { Module } from '@nestjs/common';
import { TaxDeclarationService } from './tax-declaration.service';
import { TaxDeclarationController } from './tax-declaration.controller';
import { DatabaseModule } from '@/database/database-module';

@Module({
  controllers: [TaxDeclarationController],
  providers: [TaxDeclarationService],
  exports: [],
  imports: [DatabaseModule],
})
export class TaxDeclarationModule {}

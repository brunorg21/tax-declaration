import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TaxDeclarationModule } from './tax-declaration/tax-declaration.module';

@Module({
  imports: [AuthModule, UserModule, TaxDeclarationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

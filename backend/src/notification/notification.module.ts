import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email.module';

@Module({
  imports: [ConfigModule, forwardRef(() => EmailModule)],
  exports: [EmailModule],
})
export class NotificationModule {}

import { Module } from '@nestjs/common';
import { StallController } from './stall.controller';
import { StallService } from './stall.service';
import { AdminGuard } from './guards/admin.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [StallController],
  providers: [StallService, AdminGuard],
  exports: [StallService],
})
export class StallModule {}

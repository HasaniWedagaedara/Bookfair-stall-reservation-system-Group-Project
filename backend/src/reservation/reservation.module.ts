import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AdminGuard } from './guards/admin.guard';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../notification/email.module';

@Module({
  imports: [AuthModule, EmailModule],
  controllers: [ReservationController],
  providers: [ReservationService, AdminGuard],
  exports: [ReservationService],
})
export class ReservationModule {}
import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AdminGuard } from './guards/admin.guard';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ReservationController],
  providers: [ReservationService, AdminGuard],
  exports: [ReservationService],
})
export class ReservationModule {}
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StallModule } from './stall/stall.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
    }),
    PrismaModule,
    AuthModule,
    StallModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}

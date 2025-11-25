import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';
import type { AuthRequest } from './types/request.type';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}


//Create reservation (book stall)

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(201)
  async createReservation(
    @Req() req: AuthRequest,
    @Body()
    body: {
      stallId: string;
      totalAmount: number;
    },
  ) {
    return await this.reservationService.createReservation(
      req.user.id,
      body.stallId,
      body.totalAmount,
    );
  }

 
   // Get user's own reservations
   
  @UseGuards(JwtAuthGuard)
  @Get('my-reservations')
  async getUserReservations(@Req() req: AuthRequest) {
    return await this.reservationService.getUserReservations(req.user.id);
  }

   //Get all reservations (Admin only)

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  async getAllReservations() {
    return await this.reservationService.getAllReservations();
  }

   //Get reservation statistics (Admin only)

  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('statistics')
  async getReservationStatistics() {
    return await this.reservationService.getReservationStatistics();
  }


   //Get single reservation by ID

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getReservationById(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return await this.reservationService.getReservationById(id, req.user.id);
  }

 
// Cancel reservation
 
  @UseGuards(JwtAuthGuard)
  @Put(':id/cancel')
  async cancelReservation(
    @Param('id') id: string,
    @Req() req: AuthRequest,
  ) {
    return await this.reservationService.cancelReservation(id, req.user.id);
  }

  // Send QR code to email

  @UseGuards(JwtAuthGuard)  //temp
  @Post(':id/send-qr-email')
  async sendQRCodeToEmail(
    @Param('id') id: string,
    @Req() req: AuthRequest,
    @Body()
    body?: {
      userEmail?: string;
      userName?: string;
      stallName?: string;
    },
  ) {
    console.log('REQ USER:', req.user); 
    return await this.reservationService.sendQRCodeToEmail(
      id,
      req.user.id,
      body?.userEmail || req.user.email,
      body?.userName || req.user.name,
      body?.stallName,
    );
  }
}
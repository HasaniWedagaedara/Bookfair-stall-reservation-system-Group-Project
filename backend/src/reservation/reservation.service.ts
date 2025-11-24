import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../notification/email.service';
import { randomUUID } from 'crypto';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);

  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  // Create a reservation (book a stall)

  async createReservation(
    userId: string,
    stallId: string,
    totalAmount: number,
  ) {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId },
    });

    if (!stall) {
      throw new NotFoundException('Stall not found');
    }

    if (stall.status !== 'AVAILABLE') {
      throw new BadRequestException(
        `Stall is not available. Current status: ${stall.status}`,
      );
    }

    //Check user's active reservations (max 3 rule)
    const userActiveReservations = await this.prisma.reservation.count({
      where: {
        userId: userId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (userActiveReservations >= 3) {
      throw new BadRequestException(
        'You have reached the maximum limit of 3 active reservations',
      );
    }

    // Check if user already booked this stall
    const existingReservation = await this.prisma.reservation.findFirst({
      where: {
        userId: userId,
        stallId: stallId,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (existingReservation) {
      throw new ConflictException('You have already booked this stall');
    }

    // Create reservation
    const reservationId = randomUUID();
    const reservation = await this.prisma.reservation.create({
      data: {
        id: reservationId,
        userId: userId,
        stallId: stallId,
        totalAmount: totalAmount,
        status: 'CONFIRMED',
        qrCode: reservationId, // Store reservation ID as QR code content
      },
      include: {
        stall: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            businessName: true,
          },
        },
      },
    });

    //Update stall status to RESERVED
    await this.prisma.stall.update({
      where: { id: stallId },
      data: { status: 'RESERVED' },
    });

    // Send confirmation email with QR code (non-blocking)
    this.sendConfirmationEmail(reservation).catch((error) => {
      this.logger.error(
        `Failed to send confirmation email for reservation ${reservationId}`,
        error,
      );
    });

    return reservation;
  }

  /**
   * Send confirmation email with QR code to user
   */
  private async sendConfirmationEmail(reservation: any): Promise<void> {
    try {
      await this.emailService.sendReservationConfirmation(
        reservation.user.email,
        reservation.user.name,
        reservation.stall.name,
        reservation.id,
        reservation.totalAmount,
        reservation.createdAt,
      );
      this.logger.log(
        `Confirmation email sent to ${reservation.user.email} for reservation ${reservation.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send confirmation email to ${reservation.user.email}`,
        error,
      );
    }
  }

  // Get user's own reservations

  async getUserReservations(userId: string) {
    const reservations = await this.prisma.reservation.findMany({
      where: { userId: userId },
      include: {
        stall: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      count: reservations.length,
      reservations,
    };
  }

  // Get single reservation by ID

  async getReservationById(reservationId: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        stall: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            businessName: true,
            mobileNumber: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Check if user owns this reservation
    if (reservation.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to view this reservation',
      );
    }

    return reservation;
  }

  /**
   * Cancel reservation
   */
  async cancelReservation(reservationId: string, userId: string) {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: { stall: true },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Check if user owns this reservation
    if (reservation.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to cancel this reservation',
      );
    }

    // Check if already cancelled
    if (reservation.status === 'CANCELLED') {
      throw new BadRequestException('Reservation is already cancelled');
    }

    const updatedReservation = await this.prisma.reservation.update({
      where: { id: reservationId },
      data: { status: 'CANCELLED' },
      include: {
        stall: true,
      },
    });

    await this.prisma.stall.update({
      where: { id: reservation.stallId },
      data: { status: 'AVAILABLE' },
    });

    return {
      message: 'Reservation cancelled successfully',
      reservation: updatedReservation,
    };
  }

  //Get all reservations (Admin only)

  async getAllReservations() {
    const reservations = await this.prisma.reservation.findMany({
      include: {
        stall: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            businessName: true,
            mobileNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      count: reservations.length,
      reservations,
    };
  }

  /**
   * Send QR code to email
   */
  async sendQRCodeToEmail(
    reservationId: string,
    userId: string,
    userEmail: string,
    userName: string,
    stallName?: string,
  ): Promise<{ message: string }> {
    const reservation = await this.prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        stall: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    // Verify user owns this reservation
    if (reservation.userId !== userId) {
      throw new BadRequestException(
        'You are not authorized to access this reservation',
      );
    }

    // Send QR code email (use the EmailService)
    try {
      await this.emailService.sendReservationConfirmation(
        userEmail || reservation.user.email,
        userName || reservation.user.name,
        stallName || reservation.stall.name,
        reservation.id,
        reservation.totalAmount,
        reservation.createdAt,
      );

      this.logger.log(
        `QR code sent to ${userEmail || reservation.user.email} for reservation ${reservationId}`,
      );

      return {
        message: `QR code sent to ${userEmail || reservation.user.email}`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send QR code for reservation ${reservationId}`,
        error,
      );
      throw new BadRequestException('Failed to send QR code to email');
    }
  }

  async getReservationStatistics() {
    const totalReservations = await this.prisma.reservation.count();

    const pendingReservations = await this.prisma.reservation.count({
      where: { status: 'PENDING' },
    });

    const confirmedReservations = await this.prisma.reservation.count({
      where: { status: 'CONFIRMED' },
    });

    const cancelledReservations = await this.prisma.reservation.count({
      where: { status: 'CANCELLED' },
    });

    // Total revenue from confirmed reservations
    const revenueData = await this.prisma.reservation.aggregate({
      where: { status: 'CONFIRMED' },
      _sum: {
        totalAmount: true,
      },
    });

    const totalRevenue = revenueData._sum.totalAmount || 0;

    return {
      total: totalReservations,
      byStatus: {
        pending: pendingReservations,
        confirmed: confirmedReservations,
        cancelled: cancelledReservations,
      },
      totalRevenue: totalRevenue,
    };
  }
}

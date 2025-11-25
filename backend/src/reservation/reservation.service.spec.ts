import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReservationService } from './reservation.service';

describe('ReservationService - sendQRCodeToEmail', () => {
  let service: ReservationService;

  const mockPrisma: any = {
    reservation: {
      findUnique: jest.fn(),
    },
  };

  const mockEmailService: any = {
    sendReservationConfirmation: jest.fn(),
  };

  beforeEach(() => {
    // reset mocks before each test
    mockPrisma.reservation.findUnique.mockReset();
    mockEmailService.sendReservationConfirmation.mockReset();

    service = new ReservationService(mockPrisma as any, mockEmailService as any);
  });

  it('sends QR email when reservation is owned by the user', async () => {
    const createdAt = new Date();
    const reservation = {
      id: 'res1',
      userId: 'user1',
      stall: { name: 'Stall A' },
      user: { id: 'user1', email: 'a@b.com', name: 'Alice' },
      totalAmount: 100,
      createdAt,
    };

    mockPrisma.reservation.findUnique.mockResolvedValue(reservation);
    mockEmailService.sendReservationConfirmation.mockResolvedValue(true);

    const result = await service.sendQRCodeToEmail('res1', 'user1', '', '', '');

    expect(mockPrisma.reservation.findUnique).toHaveBeenCalled();
    expect(mockEmailService.sendReservationConfirmation).toHaveBeenCalledWith(
      'a@b.com',
      'Alice',
      'Stall A',
      'res1',
      100,
      createdAt,
    );
    expect(result).toEqual({ message: 'QR code sent to a@b.com' });
  });

  it('throws BadRequestException when user does not own reservation', async () => {
    const reservation = {
      id: 'res1',
      userId: 'other',
      stall: { name: 'Stall A' },
      user: { id: 'other', email: 'b@b.com', name: 'Bob' },
      totalAmount: 50,
      createdAt: new Date(),
    };

    mockPrisma.reservation.findUnique.mockResolvedValue(reservation);

    await expect(
      service.sendQRCodeToEmail('res1', 'user1', 'x@x.com', 'X', ''),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws NotFoundException when reservation is not found', async () => {
    mockPrisma.reservation.findUnique.mockResolvedValue(null);

    await expect(
      service.sendQRCodeToEmail('does-not-exist', 'user1', '', '', ''),
    ).rejects.toThrow(NotFoundException);
  });
});

import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStallDto } from './dto/create_stall.dto';
import { UpdateStallDto } from './dto/update_stall.dto';

@Injectable()
export class StallService {
  constructor(private prisma: PrismaService) {}

  async createStall(createStallDto: CreateStallDto) {
    const existingStall = await this.prisma.stall.findUnique({
      where: { name: createStallDto.name },
    });

    if (existingStall) {
      throw new ConflictException(`Stall with name '${createStallDto.name}' already exists`);
    }

    const stall = await this.prisma.stall.create({
      data: {
        name: createStallDto.name,
        size: createStallDto.size,
        location: createStallDto.location,
        dimensions: createStallDto.dimensions,
        pricePerDay: createStallDto.pricePerDay,
        status: 'AVAILABLE', 
      },
    });

    return {
      message: 'Stall created successfully',
      stall,
    };
  }

 
  async getAllStalls() {
    const stalls = await this.prisma.stall.findMany({
      orderBy: { name: 'asc' }, // Sort by name A-Z
    });

    return {
      count: stalls.length,
      stalls,
    };
  }


  async getAvailableStalls() {
    const stalls = await this.prisma.stall.findMany({
      where: { status: 'AVAILABLE' }, 
      orderBy: { name: 'asc' },
    });

    return {
      count: stalls.length,
      stalls,
    };
  }

 
  async getStallsBySize(size: string) {
    
    if (!['SMALL', 'MEDIUM', 'LARGE'].includes(size.toUpperCase())) {
      throw new BadRequestException('Size must be SMALL, MEDIUM, or LARGE');
    }

    const stalls = await this.prisma.stall.findMany({
      where: { size: size.toUpperCase() as any },
      orderBy: { name: 'asc' },
    });

    return {
      size: size.toUpperCase(),
      count: stalls.length,
      stalls,
    };
  }

  async getStallById(id: string) {
    const stall = await this.prisma.stall.findUnique({
      where: { id },
      include: {
        reservations: { // Include reservation info
          select: {
            id: true,
            reservationDate: true,
            status: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!stall) {
      throw new NotFoundException(`Stall with ID '${id}' not found`);
    }

    return stall;
  }


  async updateStall(id: string, updateStallDto: UpdateStallDto) {
    const stall = await this.prisma.stall.findUnique({
      where: { id },
    });

    if (!stall) {
      throw new NotFoundException(`Stall with ID '${id}' not found`);
    }

    if (updateStallDto.name && updateStallDto.name !== stall.name) {
      const existingStall = await this.prisma.stall.findUnique({
        where: { name: updateStallDto.name },
      });

      if (existingStall) {
        throw new ConflictException(`Stall with name '${updateStallDto.name}' already exists`);
      }
    }

    const updatedStall = await this.prisma.stall.update({
      where: { id },
      data: updateStallDto,
    });

    return {
      message: 'Stall updated successfully',
      stall: updatedStall,
    };
  }

  
  async deleteStall(id: string) {
    
    const stall = await this.prisma.stall.findUnique({
      where: { id },
      include: {
        reservations: {
          where: {
            status: { in: ['PENDING', 'CONFIRMED'] }, // Active reservations
          },
        },
      },
    });

    if (!stall) {
      throw new NotFoundException(`Stall with ID '${id}' not found`);
    }

    // Check if there are active reservations
    if (stall.reservations.length > 0) {
      throw new BadRequestException(
        'Cannot delete stall with active reservations. Cancel reservations first.'
      );
    }

    await this.prisma.stall.delete({
      where: { id },
    });

    return {
      message: 'Stall deleted successfully',
    };
  }

  /**
   * For organizer dashboard
   */
  async getStallStatistics() {
    const totalStalls = await this.prisma.stall.count();
    
    const availableStalls = await this.prisma.stall.count({
      where: { status: 'AVAILABLE' },
    });

    const reservedStalls = await this.prisma.stall.count({
      where: { status: 'RESERVED' },
    });

    const maintenanceStalls = await this.prisma.stall.count({
      where: { status: 'MAINTENANCE' },
    });

    // Count by size
    const smallStalls = await this.prisma.stall.count({
      where: { size: 'SMALL' },
    });

    const mediumStalls = await this.prisma.stall.count({
      where: { size: 'MEDIUM' },
    });

    const largeStalls = await this.prisma.stall.count({
      where: { size: 'LARGE' },
    });

    return {
      total: totalStalls,
      byStatus: {
        available: availableStalls,
        reserved: reservedStalls,
        maintenance: maintenanceStalls,
      },
      bySize: {
        small: smallStalls,
        medium: mediumStalls,
        large: largeStalls,
      },
    };
  }
}
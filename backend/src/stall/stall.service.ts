import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class StallService {
  constructor(private prisma: PrismaService) {}

 //admin only
  async createStall(
    name: string,
    size: string,
    location: string,
    dimensions: string,
    pricePerDay: number,
  ) {
    const validSizes = ['SMALL', 'MEDIUM', 'LARGE'];
    if (!validSizes.includes(size.toUpperCase())) {
      throw new BadRequestException('Size must be SMALL, MEDIUM, or LARGE');
    }

    const existingStall = await this.prisma.stall.findUnique({
      where: { name },
    });

    if (existingStall) {
      throw new ConflictException(`Stall with name '${name}' already exists`);
    }

    const stall = await this.prisma.stall.create({
      data: {
        id: randomUUID(),
        name,
        size: size.toUpperCase(),
        location,
        dimensions,
        pricePerDay,
        status: 'AVAILABLE',
      },
    });

    return stall;
  }

//anyone can view
  async getAllStalls() {
    const stalls = await this.prisma.stall.findMany({
      orderBy: { name: 'asc' },
    });

    return {
      count: stalls.length,
      stalls,
    };
  }

 //anyone can view
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

 //anyone can view
  async getStallsBySize(size: string) {
    const validSizes = ['SMALL', 'MEDIUM', 'LARGE'];
    if (!validSizes.includes(size.toUpperCase())) {
      throw new BadRequestException('Size must be SMALL, MEDIUM, or LARGE');
    }

    const stalls = await this.prisma.stall.findMany({
      where: { size: size.toUpperCase() },
      orderBy: { name: 'asc' },
    });

    return {
      size: size.toUpperCase(),
      count: stalls.length,
      stalls,
    };
  }

 //public
  async getStallById(id: string) {
    const stall = await this.prisma.stall.findUnique({
      where: { id },
    });

    if (!stall) {
      throw new NotFoundException(`Stall with ID '${id}' not found`);
    }

    return stall;
  }

 //admin only
  async updateStall(
    id: string,
    name?: string,
    size?: string,
    location?: string,
    dimensions?: string,
    pricePerDay?: number,
    status?: string,
  ) {
    const stall = await this.prisma.stall.findUnique({
      where: { id },
    });

    if (!stall) {
      throw new NotFoundException(`Stall with ID '${id}' not found`);
    }

    if (size) {
      const validSizes = ['SMALL', 'MEDIUM', 'LARGE'];
      if (!validSizes.includes(size.toUpperCase())) {
        throw new BadRequestException('Size must be SMALL, MEDIUM, or LARGE');
      }
    }

    if (status) {
      const validStatuses = ['AVAILABLE', 'RESERVED', 'MAINTENANCE'];
      if (!validStatuses.includes(status.toUpperCase())) {
        throw new BadRequestException(
          'Status must be AVAILABLE, RESERVED, or MAINTENANCE',
        );
      }
    }

    if (name && name !== stall.name) {
      const existingStall = await this.prisma.stall.findUnique({
        where: { name },
      });

      if (existingStall) {
        throw new ConflictException(`Stall with name '${name}' already exists`);
      }
    }

    // Build update data 
    const updateData: any = {};
    if (name) updateData.name = name;
    if (size) updateData.size = size.toUpperCase();
    if (location) updateData.location = location;
    if (dimensions) updateData.dimensions = dimensions;
    if (pricePerDay) updateData.pricePerDay = pricePerDay;
    if (status) updateData.status = status.toUpperCase();

    const updatedStall = await this.prisma.stall.update({
      where: { id },
      data: updateData,
    });

    return updatedStall;
  }

//admin only
  async deleteStall(id: string) {
    const stall = await this.prisma.stall.findUnique({
      where: { id },
    });

    if (!stall) {
      throw new NotFoundException(`Stall with ID '${id}' not found`);
    }

    await this.prisma.stall.delete({
      where: { id },
    });

    return { message: 'Stall deleted successfully' };
  }

 //admin only
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
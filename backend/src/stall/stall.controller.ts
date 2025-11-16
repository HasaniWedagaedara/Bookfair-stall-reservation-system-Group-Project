import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { StallService } from './stall.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from './guards/admin.guard';

@Controller('stalls')
export class StallController {
  constructor(private stallService: StallService) {}

///create stall - admin only
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post()
  @HttpCode(201)
  async createStall(
    @Body()
    body: {
      name: string;
      size: string;
      location: string;
      dimensions: string;
      pricePerDay: number;
    },
  ) {
    return await this.stallService.createStall(
      body.name,
      body.size,
      body.location,
      body.dimensions,
      body.pricePerDay,
    );
  }

//get all stalls - public
  @Get()
  async getAllStalls() {
    return await this.stallService.getAllStalls();
  }

 ///get available stalls - public
  @Get('available')
  async getAvailableStalls() {
    return await this.stallService.getAvailableStalls();
  }

//GET /stalls/size?type=SMALL - public
  @Get('size')
  async getStallsBySize(@Query('type') type: string) {
    return await this.stallService.getStallsBySize(type);
  }

 //get stall statistics - admin only
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('statistics')
  async getStallStatistics() {
    return await this.stallService.getStallStatistics();
  }

//get stall by id - public
  @Get(':id')
  async getStallById(@Param('id') id: string) {
    return await this.stallService.getStallById(id);
  }

  //update stall - admin only
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Put(':id')
  async updateStall(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      size?: string;
      location?: string;
      dimensions?: string;
      pricePerDay?: number;
      status?: string;
    },
  ) {
    return await this.stallService.updateStall(
      id,
      body.name,
      body.size,
      body.location,
      body.dimensions,
      body.pricePerDay,
      body.status,
    );
  }

 //delete stall - admin only
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Delete(':id')
  async deleteStall(@Param('id') id: string) {
    return await this.stallService.deleteStall(id);
  }
}
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
  HttpStatus,
} from '@nestjs/common';
import { StallService } from './stall.service';
import { CreateStallDto } from './dto/create_stall.dto';
import { UpdateStallDto } from './dto/update_stall.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('stalls')
export class StallController {
  constructor(private readonly stallService: StallService) {}

  @UseGuards(JwtAuthGuard)//only organizers
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStall(@Body() createStallDto: CreateStallDto) {
    return await this.stallService.createStall(createStallDto);
  }

 
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllStalls() {
    return await this.stallService.getAllStalls();
  }


  @Get('available')
  @HttpCode(HttpStatus.OK)
  async getAvailableStalls() {
    return await this.stallService.getAvailableStalls();
  }

  @Get('size')
  @HttpCode(HttpStatus.OK)
  async getStallsBySize(@Query('type') type: string) {
    return await this.stallService.getStallsBySize(type);
  }

  @UseGuards(JwtAuthGuard)
  @Get('statistics')
  @HttpCode(HttpStatus.OK)
  async getStallStatistics() {
    return await this.stallService.getStallStatistics();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getStallById(@Param('id') id: string) {
    return await this.stallService.getStallById(id);
  }


  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateStall(
    @Param('id') id: string,
    @Body() updateStallDto: UpdateStallDto,
  ) {
    return await this.stallService.updateStall(id, updateStallDto);
  }


  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteStall(@Param('id') id: string) {
    return await this.stallService.deleteStall(id);
  }
}
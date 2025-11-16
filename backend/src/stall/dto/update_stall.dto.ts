import { IsString, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { StallSize, StallStatus } from './create_stall.dto';

export class UpdateStallDto {
  @IsString()
  @IsOptional() 
  name?: string;

  @IsEnum(StallSize)
  @IsOptional()
  size?: StallSize;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  dimensions?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  pricePerDay?: number;

  @IsEnum(StallStatus)
  @IsOptional()
  status?: StallStatus; 
}
import { IsString, IsNotEmpty, IsEnum, IsNumber, Min } from 'class-validator';

export enum StallSize {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
}

export enum StallStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

export class CreateStallDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Example: "A1", "B5", "C12"

  @IsEnum(StallSize)
  @IsNotEmpty()
  size: StallSize; 

  @IsString()
  @IsNotEmpty()
  location: string; // Example: "Ground Floor, Section A"

  @IsString()
  @IsNotEmpty()
  dimensions: string; // Example: "10x10 feet"

  @IsNumber()
  @Min(0) 
  pricePerDay: number; 
}
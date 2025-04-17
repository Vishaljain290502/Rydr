import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVehicleDto {
  @ApiProperty({ example: 'MH12AB1234', description: 'Unique vehicle registration number' })
  @IsString()
  @IsNotEmpty()
  vehicleNumber: string;

  @ApiProperty({ example: 'RC123456', description: 'Vehicle registration certificate number' })
  @IsString()
  @IsNotEmpty()
  registrationCertificateNumber: string;

  @ApiProperty({ example: 'John Doe', description: 'Name of the vehicle owner' })
  @IsString()
  @IsNotEmpty()
  vehicleOwnerName: string;

  @ApiProperty({ example: '60d5f8a2b4d6c849d4a3b123', description: 'Brand ID (MongoDB ObjectId)' })
  @IsString()
  @IsNotEmpty()
  brand: Types.ObjectId;

  @ApiProperty({ example: '60d5f8a2b4d6c849d4a3b124', description: 'Model ID (MongoDB ObjectId)' })
  @IsString()
  @IsNotEmpty()
  model: Types.ObjectId;

  @ApiProperty({ example: 'Car', description: 'Type of the vehicle (e.g., Car, Truck, Bike)' })
  @IsString()
  @IsNotEmpty()
  vehicleType: string;

  @ApiProperty({ example: 'Red', description: 'Color of the vehicle' })
  @IsString()
  @IsNotEmpty()
  vehicleColor: string;

  @ApiProperty({ 
    example: 'Petrol', 
    description: 'Fuel type of the vehicle', 
    enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] 
  })
  @IsEnum(['Petrol', 'Diesel', 'Electric', 'Hybrid'])
  @IsNotEmpty()
  fuelType: string;

  @ApiProperty({ example: 5, description: 'Number of seats in the vehicle' })
  @IsNumber()
  @IsNotEmpty()
  numberOfSeats: number;

  @ApiProperty({ example: true, description: 'Indicates if the vehicle has air conditioning' })
  @IsBoolean()
  isAirConditioned: boolean;
}

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'MH12AB5678', description: 'Updated vehicle registration number' })
  @IsOptional()
  @IsString()
  vehicleNumber?: string;

  @ApiPropertyOptional({ example: 'Car', description: 'Updated vehicle type' })
  @IsOptional()
  @IsString()
  vehicleType?: string;
}

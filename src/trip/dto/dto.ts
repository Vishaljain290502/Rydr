import { 
  IsNotEmpty, 
  IsString, 
  IsDateString, 
  IsNumber, 
  Min, 
  ValidateNested, 
  IsOptional, 
  IsMongoId 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class LocationDto {
  @ApiProperty({ example: 37.7749, description: 'Latitude of the location' })
  @IsNotEmpty()
  @IsNumber()
  readonly latitude: number;

  @ApiProperty({ example: -122.4194, description: 'Longitude of the location' })
  @IsNotEmpty()
  @IsNumber()
  readonly longitude: number;
}

export class CreateTripDto {
  @ApiProperty({ description: 'User ID of the trip host', example: '60c72b2f9b1e8b002b5f9a3d' })
  @IsNotEmpty()
  @IsMongoId()
  readonly host: string;

  @ApiProperty({ description: 'Start location of the trip' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly startLocation: LocationDto;

  @ApiProperty({ description: 'Destination of the trip' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly destination: LocationDto;

  @ApiProperty({ description: 'Start date of the trip', example: '2024-06-01T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  readonly startDate: string;

  @ApiProperty({ description: 'End date of the trip', example: '2024-06-05T00:00:00.000Z' })
  @IsNotEmpty()
  @IsDateString()
  readonly endDate: string;

  @ApiProperty({ description: 'Vehicle ID used for the trip', example: '60c72b2f9b1e8b002b5f9a3e' })
  @IsNotEmpty()
  @IsMongoId()
  readonly vehicle: string;  // Reference to Vehicle model

  @ApiProperty({ description: 'Number of available seats', minimum: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly seatsAvailable: number;

  @ApiProperty({ description: 'Array of participant user IDs', example: ['60c72b2f9b1e8b002b5f9a3f', '60c72b2f9b1e8b002b5f9a40'], required: false })
  @IsOptional()
  @IsMongoId({ each: true })
  readonly participants?: string[];

  @ApiProperty({ description: 'Trip status', enum: ["scheduled", "rescheduled", "canceled", "completed"], default: "scheduled" })
  @IsOptional()
  @IsString()
  readonly status?: string;
}

export class UpdateTripDto {
  @ApiProperty({ description: 'User ID of the trip host', example: '60c72b2f9b1e8b002b5f9a3d', required: false })
  @IsOptional()
  @IsMongoId()
  readonly host?: string;

  @ApiProperty({ description: 'Start location of the trip', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly startLocation?: LocationDto;

  @ApiProperty({ description: 'Destination of the trip', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly destination?: LocationDto;

  @ApiProperty({ description: 'Start date of the trip', example: '2024-06-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  readonly startDate?: string;

  @ApiProperty({ description: 'End date of the trip', example: '2024-06-05T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  readonly endDate?: string;

  @ApiProperty({ description: 'Vehicle ID used for the trip', example: '60c72b2f9b1e8b002b5f9a3e', required: false })
  @IsOptional()
  @IsMongoId()
  readonly vehicle?: string;  // Reference to Vehicle model

  @ApiProperty({ description: 'Number of available seats', minimum: 1, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly seatsAvailable?: number;

  @ApiProperty({ description: 'Array of participant user IDs', example: ['60c72b2f9b1e8b002b5f9a3f', '60c72b2f9b1e8b002b5f9a40'], required: false })
  @IsOptional()
  @IsMongoId({ each: true })
  readonly participants?: string[];

  @ApiProperty({ description: 'Trip status', enum: ["scheduled", "rescheduled", "canceled", "completed"], required: false })
  @IsOptional()
  @IsString()
  readonly status?: string;
}

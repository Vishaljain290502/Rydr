import { 
  IsNotEmpty, 
  IsString, 
  IsDateString, 
  IsNumber, 
  Min, 
  ValidateNested, 
  IsOptional, 
  IsMongoId, 
  ArrayMinSize,
  IsArray,
  ArrayMaxSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 'Point', description: 'GeoJSON type', enum: ['Point'] })
  @IsNotEmpty()
  @IsString()
  readonly type: 'Point';

  @ApiProperty({
    example: [75.8577, 22.7196],
    description: 'Coordinates in [longitude, latitude] format',
    minItems: 2,
    maxItems: 2,
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @IsNumber({}, { each: true })
  readonly coordinates: number[];
}

export class CreateTripDto {
  @ApiProperty({ description: 'Start location of the trip' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly source: LocationDto;

  @ApiProperty({ description: 'Source address (human-readable)' })
  @IsNotEmpty()
  @IsString()
  readonly sourceAddress: string;

  @ApiProperty({ description: 'Destination of the trip' })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly destination: LocationDto;

  @ApiProperty({ description: 'Destination address (human-readable)' })
  @IsNotEmpty()
  @IsString()
  readonly destinationAddress: string; 

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
  readonly source?: LocationDto;

  @ApiProperty({ description: 'Source address (human-readable)', required: false })
  @IsOptional()
  @IsString()
  readonly sourceAddress?: string;

  @ApiProperty({ description: 'Destination of the trip', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly destination?: LocationDto;

  @ApiProperty({ description: 'Destination address (human-readable)', required: false })
  @IsOptional()
  @IsString()
  readonly destinationAddress?: string;

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

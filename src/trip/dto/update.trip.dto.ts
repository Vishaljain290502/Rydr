import { IsOptional, IsString, IsDateString, IsNumber, Min } from 'class-validator';

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  readonly destination?: string;

  @IsOptional()
  @IsDateString()
  readonly startDate?: string;

  @IsOptional()
  @IsDateString()
  readonly endDate?: string;

  @IsOptional()
  @IsString()
  readonly vehicleType?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  readonly seatsAvailable?: number;
}


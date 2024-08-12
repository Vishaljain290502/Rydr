import { IsNotEmpty, IsString, IsDateString, IsNumber, Min } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  readonly destination: string;

  @IsNotEmpty()
  @IsDateString()
  readonly startDate: string;

  @IsNotEmpty()
  @IsDateString()
  readonly endDate: string;

  @IsNotEmpty()
  @IsString()
  readonly vehicleType: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  readonly seatsAvailable: number;
}

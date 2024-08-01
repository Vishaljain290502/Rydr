import { IsString, IsArray, ArrayMinSize, IsNumber } from 'class-validator';

export class LocationDto {
  @IsString()
  type: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}


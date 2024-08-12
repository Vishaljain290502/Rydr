import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class IdDetailsDto {
  @IsOptional()
  @IsString()
  front?: string;

  @IsOptional()
  @IsString()
  back?: string;

  @IsOptional()
  @IsString()
  frontPublicId?: string;

  @IsOptional()
  @IsString()
  backPublicId?: string;
}

export class VerificationIdDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDetailsDto)
  id?: IdDetailsDto;

  @IsOptional()
  @IsString()
  photo?: string;

  @IsOptional()
  @IsString()
  photoPublicId?: string;
}

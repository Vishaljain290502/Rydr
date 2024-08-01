import { IsOptional, IsString } from 'class-validator';

export class VerificationIdDto {
  @IsOptional()
  @IsString()
  type?: string;
}

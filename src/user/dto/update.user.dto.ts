import { IsString, IsOptional, IsBoolean, IsDate, IsArray, ArrayMinSize, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';



export class UpdateUserDto {
  @IsOptional()
  @IsString()
   name?: string;
  @IsOptional()
  @IsDate()
   dob?: Date;

  @IsOptional()
  @IsString()
   email?: string;

  @IsOptional()
  @IsString()
   password?: string;

  @IsOptional()
  @IsString()
   token?: string;

  @IsOptional()
  @IsString()
   mobileNumber?: string;

  @IsOptional()
  @IsBoolean()
   isPhoneVerified?: boolean;

  @IsOptional()
  @IsBoolean()
   isEmailVerified?: boolean;

  @IsOptional()
  @IsDate()
   resetTokenExpiration?: Date;

  @IsOptional()
  @IsString()
   otp?: string;

  @IsOptional()
  @IsString()
   address?: string;

  //  @IsOptional()
  // @ValidateNested()
  // @Type(() => LocationDto)
  // location?: LocationDto;
}

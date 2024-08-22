import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsDate, IsOptional, IsArray, ArrayNotEmpty, IsMongoId, ArrayMinSize, IsNumber, ValidateNested } from 'class-validator';
import {  IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
export class UserDto {
  @ApiProperty({
    description:"name",
    default:"Rider"
  })
  @IsString()
  readonly name: string;

  @ApiProperty({
    description:"dob",
  })
  @IsDate()
  readonly dob: Date;

  @ApiProperty({
    description:"email",
    default:"rider@gmail.com"
  })
  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;

  @IsOptional()
  @IsString()
  readonly token?: string;

  @IsOptional()
  @IsString()
  readonly mobileNumber?: string;

  @IsBoolean()
  readonly isPhoneVerified: boolean;

  @IsBoolean()
  readonly isEmailVerified: boolean;

  @IsOptional()
  @IsDate()
  readonly resetTokenExpiration?: Date;

  @IsOptional()
  @IsString()
  readonly otp?: string;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  readonly location?: {
    type: string;
    coordinates: [number, number];
  };
}

export class FetchUserDto {
  @ApiProperty({
    description:"UserId",
  })
  @IsMongoId()
  readonly id: string;
}

export class CreateUserDto {
  @ApiProperty({
    description:"firstName",
    default:"rider",
    required:true
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description:"lastName",
    default:"Ride",
    required:true
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description:"Email",
    default:"rider@gmail.com",
    required:true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // @IsString()
  // @IsNotEmpty()
  // mobileNumber: string;

  @ApiProperty({
    description:"CountryCode",
    required:true
  })
  @IsNotEmpty()
  @IsString()
  countryCode: string;

  @ApiProperty({
    description:"number",
    required:true
  })
  @IsNotEmpty()
  @IsString()
  number: string;

  @ApiProperty({
    description:"password",
    minLength:6,
    maxLength:18,
    required:true
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

export class LocationDto {
  @ApiProperty({
    description:"location"
  })
  @IsString()
  type: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class UpdateUserDto {
  @ApiProperty({
    description:"FirstName",
    default:"rider"
  })
  @IsOptional()
  @IsString()
   firstName?: string;

   @ApiProperty({
    description:"latsName",
    default:"ride"
   })
   @IsOptional()
   @IsString()
   lastName?:string;

   @ApiProperty({
    description:"password",
    maxLength:18,
    minLength:6,
    default:"2133434546"
   })
   @IsOptional()
   @IsString()
   password?:string;

   @ApiProperty({
    description:"OTP",
    minLength:6,
    maxLength:6,
    default:"123456"
   })
   @IsOptional()
   @IsString()
   otp?:string;


   @ApiProperty({
    description:"Date of birth",
   })
  @IsOptional()
  @IsDate()
   dob?: Date;

  @ApiProperty({
    description:"Email",
    default:"Rider@gmail.com"
  })
  @IsOptional()
  @IsString()
   email?: string;

  
  @IsOptional()
  @IsString()
   address?: string;

  //  @IsOptional()
  // @ValidateNested()
  // @Type(() => LocationDto)
  // location?: LocationDto;
}

class IdDetailsDto {
  @ApiProperty({
    description:"front"
  })
  @IsOptional()
  @IsString()
  front?: string;

  @ApiProperty({
    description:"Back"
  })
  @IsOptional()
  @IsString()
  back?: string;

  @ApiProperty({
    description:"frontPublicId"
  })
  @IsOptional()
  @IsString()
  frontPublicId?: string;

  @ApiProperty({
    description:"backPublicId"
  })
  @IsOptional()
  @IsString()
  backPublicId?: string;
}

export class CreateVehicleVerificationDto {

  @ApiProperty({
    description:"VehicleType",
    type:String
  })
  @IsString()
  vehicleType:string;

  @ApiProperty({
    description:"RegistrationCertificateNumber",
    type:String,
  })
  @IsString()
  registrationCertificateNumber:string;

//   @IsString()
//   drivingLicense:string;
  @ApiProperty({
    description:"VehicleNumber",
    type:String
  })
  @IsString()
  vehicleNumber:string;

  @ApiProperty({
    description:"Vehicle Owner Name",
    type:String
  })
  @IsString()
  vehicleOwnerName:string;

  @ApiProperty({
    description:"Insuarance Number"
  })
  @IsString()
  insuranceNumber:string;
}

export class VerificationIdDto {
  @ApiProperty({
    description:"Verification Details"
  })
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



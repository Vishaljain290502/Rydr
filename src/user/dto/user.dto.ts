import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsBoolean, IsDate, IsOptional, IsArray, ArrayNotEmpty, IsMongoId, ArrayMinSize, IsNumber, ValidateNested } from 'class-validator';
import {  IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { AnalyticsSchema, EmergencyContact, TokenSchema } from '../user.schema';
import { Vehicle } from 'src/vehicle/vehicle.schema';

class OtpDto {
  @IsString()
  value: string;

  @IsDate()
  createdAt: Date;
}

export class LocationDto {
  @ApiProperty({ description: "Location Type", default: "Point" })
  @IsString()
  type: string;

  @ApiProperty({ description: "Coordinates", type: [Number] })
  @IsArray()
  @ArrayMinSize(2)
  @IsNumber({}, { each: true })
  coordinates: [number, number];
}

export class UserDto {
  @ApiProperty({ description: "First Name", default: "Rider" })
  @IsString()
  readonly firstName: string;

  @ApiProperty({ description: "Last Name", default: "Ride" })
  @IsString()
  readonly lastName: string;

  @ApiProperty({ description: "Date of Birth" })
  @IsDate()
  readonly dob: Date;

  @ApiProperty({ description: "Email", default: "rider@gmail.com" })
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly password: string;

  @ApiProperty({ description: "Country Code" })
  @IsString()
  readonly countryCode: string;

  @ApiProperty({ description: "Phone Number" })
  @IsString()
  readonly number: string;

  @IsBoolean()
  readonly isPhoneVerified: boolean;

  @IsBoolean()
  readonly isEmailVerified: boolean;

  @IsOptional()
  @ValidateNested()
  @Type(() => OtpDto)
  readonly otp?: OtpDto;

  @IsOptional()
  @IsString()
  readonly address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  readonly location?: LocationDto;

  @IsOptional()
  @IsString()
  readonly profileImage?: string;

  @IsOptional()
  @IsString()
  readonly notificationToken?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => TokenSchema)
  readonly token?: TokenSchema;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnalyticsSchema)
  readonly analytics?: AnalyticsSchema;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EmergencyContact)
  readonly emergencyContacts?: EmergencyContact[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Vehicle)
  readonly vehicles?: Vehicle[];
}


export class FetchUserDto {
  @ApiProperty({ description: "User ID" })
  @IsMongoId()
  readonly id: string;
}


export class CreateUserDtoForPhone {
  @ApiProperty({ description: "OTP" })
  @ValidateNested()
  @Type(() => OtpDto)
  otp: OtpDto;

  @ApiProperty({ description: "Country Code" })
  @IsString()
  countryCode: string;

  @ApiProperty({ description: "Phone Number" })
  @IsString()
  number: string;
}



export class CreateUserDto {
  @ApiProperty({ description: "First Name", default: "Rider" })
  @IsString()
  firstName: string;

  @ApiProperty({ description: "Last Name", default: "Ride" })
  @IsString()
  lastName: string;

  @ApiProperty({ description: "Email", default: "rider@gmail.com" })
  @IsEmail()
  email: string;

  @ApiProperty({ description: "Country Code" })
  @IsString()
  countryCode: string;

  @ApiProperty({ description: "Phone Number" })
  @IsString()
  number: string;

  @ApiProperty({ description: "Password", minLength: 6, maxLength: 18, required: true })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}



export class UpdateUserDto {
  @ApiProperty({ description: "First Name", default: "Rider" })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: "Last Name", default: "Ride" })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: "Password", minLength: 6, maxLength: 18, default: "2133434546" })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ description: "OTP", minLength: 6, maxLength: 6, default: "123456" })
  @IsOptional()
  @ValidateNested()
  @Type(() => OtpDto)
  otp?: OtpDto;

  @ApiProperty({ description: "Date of Birth" })
  @IsOptional()
  @IsDate()
  dob?: Date;

  @ApiProperty({ description: "Email", default: "rider@gmail.com" })
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;
}


class IdDetailsDto {
  @ApiProperty({ description: "Front Image" })
  @IsOptional()
  @IsString()
  front?: string;

  @ApiProperty({ description: "Back Image" })
  @IsOptional()
  @IsString()
  back?: string;

  @ApiProperty({ description: "Front Public ID" })
  @IsOptional()
  @IsString()
  frontPublicId?: string;

  @ApiProperty({ description: "Back Public ID" })
  @IsOptional()
  @IsString()
  backPublicId?: string;
}

export class CreateVehicleVerificationDto {
  @ApiProperty({ description: "Vehicle Type", type: String })
  @IsString()
  vehicleType: string;

  @ApiProperty({ description: "Registration Certificate Number", type: String })
  @IsString()
  registrationCertificateNumber: string;

  @ApiProperty({ description: "Vehicle Number", type: String })
  @IsString()
  vehicleNumber: string;

  @ApiProperty({ description: "Vehicle Owner Name", type: String })
  @IsString()
  vehicleOwnerName: string;

  @ApiProperty({ description: "Insurance Number", type: String })
  @IsString()
  insuranceNumber: string;
}


export class VerificationIdDto {
  @ApiProperty({ description: "Verification Type" })
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => IdDetailsDto)
  id?: IdDetailsDto;

  @ApiProperty({ description: "Photo" })
  @IsOptional()
  @IsString()
  photo?: string;

  @ApiProperty({ description: "Photo Public ID" })
  @IsOptional()
  @IsString()
  photoPublicId?: string;
}



export class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}


export class CreateEmergencyContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the emergency contact' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ example: 'Brother', description: 'Relation to the user' })
  @IsNotEmpty()
  @IsString()
  readonly relation: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the emergency contact' })
  @IsNotEmpty()
  @IsString()
  readonly phoneNumber: string;
}

export class UpdateEmergencyContactDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the emergency contact', required: false })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiProperty({ example: 'Brother', description: 'Relation to the user', required: false })
  @IsOptional()
  @IsString()
  readonly relation?: string;

  @ApiProperty({ example: '+1234567890', description: 'Phone number of the emergency contact', required: false })
  @IsOptional()
  @IsString()
  readonly phoneNumber?: string;
}


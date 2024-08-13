import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, Length, MaxLength, Min, MinLength, ValidateNested } from "class-validator";


export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsString()
    @MinLength(6)
    @MaxLength(18)
    @IsNotEmpty()
    password:string;
}

export class GenerateOtpDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
    @IsString()
    otp: string;
  
    @IsString()
    @MinLength(6)
    @MaxLength(20)
    password: string;
  }

  
export class forgotPasswordDto {
    @IsString()
    email: string;
  }

  export class VerifyPhoneDto {
    @IsString()
    mobileNumber: string;

    @IsString()
    otp: string;
  }
  
  export class SendOtpDto {
    @IsString()
    @IsNotEmpty()
    countryCode: string;
  
    @IsString()
    @IsNotEmpty()
    number: string;
  }
  export class VerifyOtpDto {
    @IsString()
    @IsNotEmpty()
    countryCode: string;
  
    @IsString()
    @IsNotEmpty()
    number: string;
  
    @IsString()
    @IsNotEmpty()
    otp: string;
  }

  export class VerifyEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 6) 
    otp: string;
}
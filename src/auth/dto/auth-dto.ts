import { Type } from "class-transformer";
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString, Length, MaxLength, Min, MinLength, ValidateNested } from "class-validator";


export class LoginUserDto {
    @ApiProperty({
      description:"Email",
      required:true,
    })
    @IsEmail()
    @IsNotEmpty()
    email:string;

    @ApiProperty({
      minLength:6,
      maxLength:18,
      description:"Password",
      default:"123456789"
    })
    @IsString()
    @MinLength(6)
    @MaxLength(18)
    @IsNotEmpty()
    password:string;

    @ApiProperty({
      description:"Nitification Token",
      required:true,
    })
    @IsString()
    @IsNotEmpty()
    notificationToken:string;
  }
export class GenerateOtpDto {
    @ApiProperty({
      description:"Email",
      required:true,
      default:"Rider@gmail.com"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description: "Email of the user",
    example: "user@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "OTP",
    minLength: 6,
    maxLength: 6,
    example: "123456",
  })
  @IsString()
  @Length(6, 6)
  otp: string;

  @ApiProperty({
    description: "New password",
    minLength: 6,
    maxLength: 18,
    example: "StrongP@ss123",
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}

  
export class forgotPasswordDto {
    @ApiProperty({
      description:"Email",
      required:true,
      default:"Rider@gmail.com"
    })
    @IsString()
    email: string;
  }

 export class ChangePasswordDto {
  @ApiProperty({
    description:"currentPassword"
  })
    @IsNotEmpty()
    @IsString()
    currentPassword: string;
  
    @ApiProperty({
      description:"New Password"
    })
    @IsNotEmpty()
    @IsString()
    newPassword: string;
  }
  
  export class VerifyPhoneDto {
    @ApiProperty({
      description:"Phone",
      required:true,
      default:"9993764773"
    })
    @IsString()
    mobileNumber: string;

    @ApiProperty({
      description:"OTP",
      minLength:6,
      maxLength:6,
      default:"123456"
    })
    @IsString()
    otp: string;
  }
  
  export class SendOtpDto {
    @ApiProperty({
      description:"CountryCode",
      default:"+91",
      required:true
    })
    @IsString()
    @IsNotEmpty()
    countryCode: string;
  
    @ApiProperty({
      description:"number",
      default:"998838777",
      required:true
    })
    @IsString()
    @IsNotEmpty()
    number: string;
  }
  export class VerifyOtpDto {
    @ApiProperty({
      description:"CountryCode",
      default:"+91",
      required:true
    })
    @IsString()
    @IsNotEmpty()
    countryCode: string;
  
    @ApiProperty({
      description:"OTP",
      minLength:6,
      maxLength:6,
      default:"123456"
    })
    @IsString()
    @IsNotEmpty()
    number: string;
  
    @ApiProperty({
      description:"OTP",
      minLength:6,
      maxLength:6,
      default:"123456"
    })
    @IsString()
    @IsNotEmpty()
    otp: string;
  }

  export class SendEmailOtpDto {
    @ApiProperty({
      description:"Email"
    })
    @IsEmail()
    email: string;
  }
  

  export class VerifyEmailOtpDto {
    @ApiProperty({
      description:"Email"
    })
    @IsEmail()
    email: string;
  
    @ApiProperty({
      description:"Otp"
    })
    @IsString()
    otp: string;
  }


  
  




export class ResendOtpDto {
  @ApiProperty({
    description:"CountryCOde",
    default:"+91"
  })
  @IsString()
  @IsNotEmpty()
  countryCode: string;
  
  @ApiProperty({
    description:"Number"
  })
  @IsString()
  @IsNotEmpty()
  number: string;
}

export class GoogleLoginDto{
  @ApiProperty({
    description:"login"
  }) 
  @IsString()
  name:string
  @IsNumber()
  phoneNumber:Number
  @IsString()
  otp:string
  @IsEmail()
  email:string
  @IsString()
  password:string
  @IsString()
  googInfo:string
}
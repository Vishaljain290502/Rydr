import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/user.dto';
import {
  LoginUserDto,
  forgotPasswordDto,
  ResetPasswordDto,
  SendOtpDto,
  VerifyOtpDto,
  ResendOtpDto,
  ChangePasswordDto,
  SendEmailOtpDto,
  VerifyEmailOtpDto,
} from './dto/auth-dto';
import { MailerService } from 'src/helper/mailer.service';
import { Roles, RolesGuard } from 'src/guard/rolesGuard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Auth, GetUserId } from 'src/guard/authGuard';
import { Types } from 'mongoose';

@ApiTags('auth')
@ApiSecurity('basic')
@Controller('auth')
export class AuthController {
  googleAuthService: any;
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    let user = await this.userService.findUserByEmail(createUserDto.email);
    console.log(user)
    if (user) {
      throw new BadRequestException('User with Email already exists');
    }
    createUserDto.password = this.authService.hashedPassword(
      createUserDto.password,
    );
    user = await this.userService.createUser(createUserDto);
    const token = await this.authService.generateToken(user);
    return {
      status: HttpStatus.CREATED,
      data: user,
      token,
      message: 'User registered successfully',
    };
  }
  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.findUserByEmail(loginUserDto.email);
    if (!user) {
      throw new BadRequestException('User Email not Found');
    }
    if (!this.authService.matchPassword(loginUserDto.password, user.password)) {
      throw new BadRequestException('Password Not Matched');
    }
    const token = await this.authService.generateToken(user);
    return {
      status: HttpStatus.OK,
      user: this.authService.serializeUser(user),
      token,
      message: 'Login successful',
    };
  }
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: forgotPasswordDto,
  ): Promise<any> {
    const user = await this.userService.findUserByEmail(
      forgotPasswordDto.email,
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP in user model or a separate OTP storage (recommended)
    user.otp = { value: otp, createdAt: new Date() };
    await this.userService.updateUserById(user._id, { otp });

    // Send OTP to the user
    await this.mailerService.sendMail({ email: user.email, otp });

    return {
      status: HttpStatus.CREATED,
      message: 'OTP sent successfully',
      Otp: user.otp,
    };
  }

  @Post('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<any> {
    const { otp, password } = resetPasswordDto;

    // Ensure that the user is identified correctly
    const user = await this.userService.findUserByOtp(otp); // Assuming `findUserByOtp` is a method that finds a user by OTP
    if (!user) {
      throw new BadRequestException('Invalid OTP');
    }

    if (user.otp.value !== otp) {
      throw new BadRequestException('Invalid OTP');
    }
    

    // Update the user's password and clear the OTP
    await this.userService.updateUserById(user._id, {
      password: this.authService.hashedPassword(password),
      otp: null,
    });

    return {
      status: HttpStatus.CREATED,
      message: 'Password reset successfully',
    };
  }

  @Post('change-password')
  @Auth() 
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @GetUserId() userId: Types.ObjectId, 
  ): Promise<any> {
    const user = await this.userService.findUserById(userId);
    console.log("user",user)
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = await this.authService.comparePassword(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const hashedNewPassword = await this.authService.hashedPassword(
      changePasswordDto.newPassword,
    );

    await this.userService.updateUserById(userId, { password: hashedNewPassword });

    return {
      status: HttpStatus.OK,
      message: 'Password changed successfully',
    };
  }

  @Post('send-otp')
  async sendOtp(@Body() sendOtpDto: SendOtpDto) {
    const user = await this.userService.findUserByPhone(
      sendOtpDto.countryCode,
      sendOtpDto.number,
    );

    if (user) {
      const otp = await this.authService.generateOtp();
      await this.authService.sendOTPOnPhone(otp, user.number);
      await this.userService.updateUserByIdforOtp(user._id, {
        otp: { value: otp, createdAt: new Date() },
      });
      delete user.otp
      return {
        statusCode: HttpStatus.OK,
        message: 'OTP sent successfully',
        data:user
      };
    } else {
      const otp = await this.authService.generateOtp();
      await this.authService.sendOTPOnPhone(otp, sendOtpDto.number);
      const user = await this.userService.createUserByPhoneNumber({
        countryCode:sendOtpDto.countryCode,
        number: sendOtpDto.number,
        otp: {
          value: otp,
          createdAt: new Date()
        },
      });

      delete user.otp
      return {
        statusCode: HttpStatus.OK,
        message: 'OTP sent successfully',
        data:user
      };
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const user = await this.userService.findUserByPhone(
      verifyOtpDto.countryCode,
      verifyOtpDto.number,
    );
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isOtpValid = await this.authService.verifyOtp(user, verifyOtpDto.otp);
    if (!isOtpValid) {
      throw new BadRequestException('Invalid OTP');
    }

    return {
      status: HttpStatus.OK,
      message: 'OTP verified successfully',
      data: {
        user,
        token: await this.authService.generateToken(user),
      },
    };
  }

  @Post('resend-otp')
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    const user = await this.userService.findUserByPhone(
      resendOtpDto.countryCode,
      resendOtpDto.number,
    );

    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }

    const otpValidityPeriod = 5 * 60 * 1000; 
    const currentTime = new Date().getTime();
    const otpCreationTime = new Date(user.otp.createdAt).getTime();
    
    if (currentTime - otpCreationTime < otpValidityPeriod) {
      throw new BadRequestException('OTP is still valid, please try after some time');
    }

    const otp = await this.authService.generateOtp();
    await this.authService.sendOTPOnPhone(otp, user.number);
    await this.userService.updateUserByIdforOtp(user._id, {
      otp: { value: otp, createdAt: new Date() },
    });

    return {
      statusCode: HttpStatus.OK,
      message: 'OTP resent successfully',
      data: {
        user,
        token: await this.authService.generateToken(user),
      },
    };
  }

  @Post('send-email-otp')
  async sendEmailOtp(@Body() sendEmailOtpDto: SendEmailOtpDto) {
    const user = await this.userService.findUserByEmail(sendEmailOtpDto.email);
  
    if (user) {
      const otp = await this.authService.generateOtp();
      await this.authService.sendOTPOnEmail(otp, user.email);
      await this.userService.updateUserByIdforOtp(user._id, {
        otp: { value: otp, createdAt: new Date() },
      });
  
      return {
        statusCode: HttpStatus.OK,
        message: 'OTP sent successfully to your email',
        data: {
          user,
          token: await this.authService.generateToken(user),
        },
      };
    } else {
      throw new BadRequestException("User doesn't exist");
    }
  }
  
  @Post('verify-email-otp')
  async verifyEmailOtp(@Body() verifyEmailOtpDto: VerifyEmailOtpDto) {
  const user = await this.userService.findUserByEmail(verifyEmailOtpDto.email);
  if (!user) {
    throw new BadRequestException('User not found');
  }
  const isOtpValid = await this.authService.verifyOtp(user, verifyEmailOtpDto.otp);
  if (!isOtpValid) {
    throw new BadRequestException('Invalid OTP');
  }

  return {
    status: HttpStatus.OK,
    message: 'OTP verified successfully',
    data: {
      user,
      token: await this.authService.generateToken(user),
    },
  };
  }

  

}

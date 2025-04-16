import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { CloudinaryService } from 'src/services/cloudinaruy-services';
import { MailerService } from 'src/helper/mailer.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailerService : MailerService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async generateToken(user: User): Promise<string> {
    const payload = { email: user.email, sub: user._id };
    return this.jwtService.sign(payload);
  }
  hashedPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  matchPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  async validateToken(token: string): Promise<User> {
    const payload = this.jwtService.verify(token);
    const user = await this.userService.fetchUserById(payload.sub);
   return user;
  }


  async sendOTPOnPhone(otp: string, phoneNumber: string) {
    console.log(`Sending OTP ${otp} to ${phoneNumber}`);
  }


  async verifyOtp(user: User, otp: string): Promise<boolean> {
    const currentTime = new Date().getTime();
    const otpCreationTime = new Date(user.otp.createdAt).getTime();
    const timeDifference = (currentTime - otpCreationTime) / 1000 / 60; // time in minutes

    if (user.otp.value === otp && timeDifference <= 5) {
      return true;
    } else {
      throw new BadRequestException('Invalid or expired OTP');
    }
  }
  

  async generateOtp(): Promise<string> {
    return crypto.randomInt(100000, 999999).toString();
  }

  async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }


  async sendOTPOnEmail(otp: string, email: string): Promise<void> {
    await this.mailerService.sendMail({
      email, 
      otp,   
    });
  }

  // private readonly FIXED_OTP = '123456';
  // async verifyOtp(user: any, otp: string): Promise<boolean> {
  //   return otp === this.FIXED_OTP;
  // }

  serializeUser(user:User){
    return {
      firstName:user.firstName,
      lastName:user.lastName,
      email:user.email,
      token:user.token,
      id:user._id
    }
  }
}

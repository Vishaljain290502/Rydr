import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import * as crypto from 'crypto';
import { CloudinaryService } from 'src/services/cloudinaruy-services';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}




  // async generateToken(user: any): Promise<string> {
  //   const payload = { userId: user._id, email: user.email };
  //   return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
  // }
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

  // async validateToken(token: string): Promise<User | null> {
  //   try {
  //     const payload = this.jwtService.verify(token);
  //     console.log("Decoded JWT payload:", payload);
      
  //     if (!payload || !payload.userId) {
  //       console.log("Invalid payload or missing userId");
  //       return null;
  //     }
  
  //     const user = await this.userModel.findById(payload.userId).exec();
  //     if (!user) {
  //       console.log("User not found for given userId:", payload.userId);
  //       return null;
  //     }
  
  //     return user;
  //   } catch (error) {
  //     console.error("Error in validateToken:", error);
  //     return null;
  //   }
  // }
  

  async generateOtp(): Promise<string> {
    return crypto.randomInt(100000, 999999).toString();
  }



  private readonly FIXED_OTP = '123456';
  async verifyOtp(user: any, otp: string): Promise<boolean> {
    return otp === this.FIXED_OTP;
  }

  serializeUser(user:User){
    return {
      name: `${user.firstName} ${user.lastName}`,
      email:user.email,
      token:user.token
    }
  }
}

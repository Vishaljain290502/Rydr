import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from 'src/auth/dto/auth-dto';
import { UpdateUserDto } from './dto/update.user.dto';
import * as bcrypt from 'bcrypt';
import { LocationDto } from './dto/location.dto';
import { VerificationIdDto } from '../user/dto/update.verification.dto';
import { CloudinaryService } from 'src/services/cloudinaruy-services';



@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }

  async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async findUserByPhoneNumber(mobileNumber: string): Promise<User> {
    return this.userModel.findOne({ mobileNumber }).exec();
  }
  async findUserByOtp(otp: string): Promise<User | null> {
    return this.userModel.findOne({ otp }).exec();
  }

  async saveResetToken(
    user: User,
    token: string,
    expirationDate: Date,
  ): Promise<void> {
    user.token = token;
    user.resetTokenExpiration = expirationDate;
    await user.save();
  }

  async updatePassword(user: User, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(newPassword, salt);
    user.token = null;
    user.resetTokenExpiration = null;
    await user.save();
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => user.toObject() as User);
  }
  async fetchUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async updateUserById(id: Types.ObjectId, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    return updatedUser;
  }
  async updateLocationById(id: Types.ObjectId, updateLocationDto: LocationDto): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    user.location = updateLocationDto;
    return await user.save();
  }  

  async verifyUser(id: Types.ObjectId, files: any, verificationIdDto: VerificationIdDto): Promise<User> {
    // console.log('Files:', files);
    // console.log('Verification DTO:', verificationIdDto);
  
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  

    const verificationId = {
      type: verificationIdDto.type,  
      id: {
        front: '',
        back: '',
        frontPublicId: '',
        backPublicId: '',
      },
      photo: '',
      photoPublicId: '',
    };
  
    if (files.idFront && files.idFront[0]) {
      const frontResult = await this.cloudinaryService.uploadImage(files.idFront[0]);
      verificationId.id.front = frontResult.secure_url;
      verificationId.id.frontPublicId = frontResult.public_id;
    }
  
    if (files.idBack && files.idBack[0]) {
      const backResult = await this.cloudinaryService.uploadImage(files.idBack[0]);
      verificationId.id.back = backResult.secure_url;
      verificationId.id.backPublicId = backResult.public_id;
    }
  
    if (files.photo && files.photo[0]) {
      const photoResult = await this.cloudinaryService.uploadImage(files.photo[0]);
      verificationId.photo = photoResult.secure_url;
      verificationId.photoPublicId = photoResult.public_id;
    }
  
    user.verificationId = verificationId;
    return user.save();
  }
  
}

import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { CreateUserDto, CreateUserDtoForPhone } from './dto/user.dto';
import { LoginUserDto } from 'src/auth/dto/auth-dto';
import { UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { LocationDto } from './dto/user.dto';
import { VerificationIdDto } from '../user/dto/user.dto';
import { CloudinaryService } from 'src/services/cloudinaruy-services';
import { CreateVehicleVerificationDto } from './dto/user.dto';



@Injectable()
export class UserService {
  async findUserById(userId: Types.ObjectId): Promise<UserDocument | null> {
    return await this.userModel.findById(userId).exec();
  }
  
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private cloudinaryService: CloudinaryService
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto);
  }
  async createUserByPhoneNumber(createUserDtoForPhone:CreateUserDtoForPhone){
    return await this.userModel.create(createUserDtoForPhone);
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
  async findUserByPhone(
    countryCode: string,
    number: string,
  ): Promise<User | null> {
    return this.userModel.findOne({ countryCode, number }).exec();
  }

  async updateUserByIdforOtp(
    userId: Types.ObjectId,
    updateData: Partial<User>,
  ): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).exec();
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
  
    console.log("Received files:", files);
  
    if (files.idFront && files.idFront[0]) {
      const frontResult = await this.cloudinaryService.uploadImage(files.idFront[0]);
      console.log("Front ID upload result:", frontResult);
      verificationId.id.front = frontResult.secure_url;
      verificationId.id.frontPublicId = frontResult.public_id;
    }
  
    if (files.idBack && files.idBack[0]) {
      const backResult = await this.cloudinaryService.uploadImage(files.idBack[0]);
      console.log("Back ID upload result:", backResult);
      verificationId.id.back = backResult.secure_url;
      verificationId.id.backPublicId = backResult.public_id;
    }
  
    if (files.photo && files.photo[0]) {
      const photoResult = await this.cloudinaryService.uploadImage(files.photo[0]);
      console.log("Photo upload result:", photoResult);
      verificationId.photo = photoResult.secure_url;
      verificationId.photoPublicId = photoResult.public_id;
    }
  
    console.log("Final verificationId object:", verificationId);
  
    user.verificationId = verificationId;
    return user.save();
  }
  
  async verifyVehicle(
    id: Types.ObjectId,
    files: {
      registrationCertificate?: Express.Multer.File[],
      insurance?: Express.Multer.File[],
      vehiclePhoto?: Express.Multer.File[],
      drivingLicense?: Express.Multer.File[],
    },
    createVehicleVerificationDto: CreateVehicleVerificationDto,
  ): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { vehicleNumber, registrationCertificateNumber, insuranceNumber, vehicleType, vehicleOwnerName } = createVehicleVerificationDto;

    const vehicleVerification = {
      vehicleNumber,
      registrationCertificateNumber,
      insuranceNumber,
      vehicleOwnerName,
      vehicleType,
      registrationCertificateUrl: '',
      insuranceUrl: '',
      vehiclePhotoUrl: '',
      drivingLicenseUrl:'',
    };

    if (files.registrationCertificate && files.registrationCertificate[0]) {
      const registrationCertificateResult = await this.cloudinaryService.uploadImage(files.registrationCertificate[0]);
      vehicleVerification.registrationCertificateUrl = registrationCertificateResult.secure_url;
    }

    if (files.insurance && files.insurance[0]) {
      const insuranceResult = await this.cloudinaryService.uploadImage(files.insurance[0]);
      vehicleVerification.insuranceUrl = insuranceResult.secure_url;
    }

    if (files.vehiclePhoto && files.vehiclePhoto[0]) {
      const vehiclePhotoResult = await this.cloudinaryService.uploadImage(files.vehiclePhoto[0]);
      vehicleVerification.vehiclePhotoUrl = vehiclePhotoResult.secure_url;
    }

    if (files.drivingLicense && files.drivingLicense[0]){
      const drivingLicenseResult = await this.cloudinaryService.uploadImage(files.drivingLicense[0]);
      vehicleVerification.drivingLicenseUrl = drivingLicenseResult.secure_url;
      
    }

    user.vehicleVerification = vehicleVerification;
    return await user.save();
  } 
}

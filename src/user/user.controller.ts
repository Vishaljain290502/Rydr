import { Body, Controller, Get, Param, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema'; // Import the DTO
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/user.dto';
import { LocationDto } from './dto/user.dto';
import { VerificationIdDto } from './dto/user.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { CreateVehicleVerificationDto } from './dto/user.dto';
import { Auth, GetUserId } from 'src/guard/authGuard';
import { Roles } from 'src/guard/rolesGuard';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';


@Auth()
@ApiTags('users')
@ApiSecurity('basic')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  
 
  @Get('/getAllUsers')
  async getAllUsers(): Promise<User[]> {
    return this.userService.getAllUsers();
  }
 
  @Get('fetchUserById/:id')
  async fetchUserById(@Param('id') id: Types.ObjectId): Promise<User> {
    return this.userService.fetchUserById(id);
  }

  @Patch('updateUserById/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUserById(Types.ObjectId.createFromHexString(id), updateUserDto);
  }
  @Patch('updateLocation/:id')
  async updateLocation(
    @Param('id') id: Types.ObjectId,
    @Body() updateLocationDto: LocationDto,
  ): Promise<User> {
    return this.userService.updateLocationById(id, updateLocationDto);
  }
  
  @Post('verify/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'idFront', maxCount: 1 },
    { name: 'idBack', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
  ]))
  async verifyUser(
    @Param('id') id: Types.ObjectId,
    @UploadedFiles() files: { idFront?: Express.Multer.File[], idBack?: Express.Multer.File[], photo?: Express.Multer.File[] },
    @Body() verificationIdDto: VerificationIdDto,
  ): Promise<User> {
    return this.userService.verifyUser(id, files, verificationIdDto);
  }

  @Post('vehicleVerify/:id')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'insurance', maxCount: 1 },
    { name: 'vehiclePhoto', maxCount: 1 },
    { name: 'drivingLicense', maxCount: 1},
  ]))
  async verifyVehicle(
    @Param('id') id: Types.ObjectId,
    @UploadedFiles() files: {
      registrationCertificate?: Express.Multer.File[],
      insurance?: Express.Multer.File[],
      vehiclePhoto?: Express.Multer.File[],
      drivingLicense? : Express.Multer.File[],
    },
    @Body() createVehicleVerificationDto: CreateVehicleVerificationDto,
  ): Promise<User> {
    return this.userService.verifyVehicle(id, files, createVehicleVerificationDto);
  }
}





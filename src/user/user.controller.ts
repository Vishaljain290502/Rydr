import { Body, Controller, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema'; // Import the DTO
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update.user.dto';
import { LocationDto } from './dto/location.dto';
import { VerificationIdDto } from './dto/update.verification.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

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
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUserById(id, updateUserDto);
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
}

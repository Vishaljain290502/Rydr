import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema'; // Import the DTO
import { Types } from 'mongoose';
import { UpdateUserDto,FileUploadDto, UpdateEmergencyContactDto, CreateEmergencyContactDto } from './dto/user.dto';
import { LocationDto } from './dto/user.dto';
import { VerificationIdDto } from './dto/user.dto';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';
import { CreateVehicleVerificationDto } from './dto/user.dto';
import { Auth, GetUserId } from 'src/guard/authGuard';
import { Roles } from 'src/guard/rolesGuard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiConsumes, ApiBody, ApiSecurity } from '@nestjs/swagger';
import { CloudinaryService } from '../helper/cloudinary.service';


// @Auth()
@ApiTags('users')
@ApiSecurity('basic')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  
 
  @Post('upload')
  @UseInterceptors(FileInterceptor('file')) 
  @ApiOperation({ summary: 'Upload a single file to Cloudinary' })
  @ApiConsumes('multipart/form-data') 
  @ApiBody({ type: FileUploadDto }) 
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'No file uploaded' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
  
    const uploadResult = await this.cloudinaryService.uploadFile(file, 'quizess');
  
    return {
      url: uploadResult, 
      message: 'File uploaded successfully',
    };
  }

  @Get('/getAllUsers')
  async getAllUsers(): Promise<any> {
    const users = await this.userService.getAllUsers();
    return {
      status: HttpStatus.OK,
      message: 'Users fetched successfully',
      data: users,
    };
  }
  
  @Get('fetchUserById/:id')
  async fetchUserById(@Param('id') id: Types.ObjectId): Promise<any> {
    const user = await this.userService.fetchUserById(id);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return {
      status: HttpStatus.OK,
      message: 'User fetched successfully',
      data: user,
    };
  }
  
  @Patch('updateUserById/:id')
  async updateUserById(
    @GetUserId() userId: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    const updatedUser = await this.userService.updateUserById(userId, updateUserDto);
    return {
      status: HttpStatus.OK,
      message: 'User updated successfully',
      data: updatedUser,
    };
  }
  
  @Patch('updateLocation/:id')
  async updateLocation(
    @Param('id') id: Types.ObjectId,
    @Body() updateLocationDto: LocationDto,
  ): Promise<any> {
    const updatedUser = await this.userService.updateLocationById(id, updateLocationDto);
    return {
      status: HttpStatus.OK,
      message: 'User location updated successfully',
      data: updatedUser,
    };
  }

  @Auth()
  @Post('contact')
  @ApiOperation({ summary: 'Add a new emergency contact' })
  async addEmergencyContact(
    @GetUserId() userId: Types.ObjectId,
    @Body() dto: CreateEmergencyContactDto
  ) {
    return this.userService.addEmergencyContact(userId, dto);
  }

  // ✏️ Update Emergency Contact
  @Put('contact/:contactId')
  @ApiOperation({ summary: 'Update an existing emergency contact' })
  async updateEmergencyContact(
    @GetUserId() userId: Types.ObjectId,
    @Param('contactId') contactId: string,
    @Body() dto: UpdateEmergencyContactDto
  ) {
    return this.userService.updateEmergencyContact(userId, contactId, dto);
  }

  // ❌ Remove Emergency Contact
  @Delete('contact/:contactId')
  @ApiOperation({ summary: 'Delete an emergency contact' })
  async removeEmergencyContact(
    @GetUserId() userId: Types.ObjectId,
    @Param('contactId') contactId: string
  ) {
    return this.userService.removeEmergencyContact(userId, contactId);
  }
  
  
  // @Post('verify/:id')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'idFront', maxCount: 1 },
  //   { name: 'idBack', maxCount: 1 },
  //   { name: 'photo', maxCount: 1 },
  // ]))
  // async verifyUser(
  //   @Param('id') id: Types.ObjectId,
  //   @UploadedFiles() files: { idFront?: Express.Multer.File[], idBack?: Express.Multer.File[], photo?: Express.Multer.File[] },
  //   @Body() verificationIdDto: VerificationIdDto,
  // ): Promise<any> {
  //   const verifiedUser = await this.userService.verifyUser(id, files, verificationIdDto);
  //   return {
  //     status: HttpStatus.OK,
  //     message: 'User verification successful',
  //     data: verifiedUser,
  //   };
  // }
  
}





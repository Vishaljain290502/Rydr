import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Delete, 
    Body, 
    Param, 
    UseInterceptors, 
    UploadedFile, 
    BadRequestException 
  } from '@nestjs/common';
  import { VehicleService } from './vehicle.service';
  import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
  import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { FileUploadDto } from 'src/user/dto/user.dto';
  import { CloudinaryService } from '../helper/cloudinary.service';
import { Auth, GetUserId } from 'src/guard/authGuard';
import { Types } from 'mongoose';
  
  @ApiTags('Vehicles')
  @Controller('vehicle')
  export class VehicleController {
    constructor(
      private readonly vehicleService: VehicleService,
      private readonly cloudinaryService: CloudinaryService,
    ) {}
  
    // 📤 Upload a File to Cloudinary
    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: 'Upload a file to Cloudinary' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @ApiResponse({ status: 201, description: 'File uploaded successfully' })
    @ApiResponse({ status: 400, description: 'No file uploaded' })
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new BadRequestException('No file uploaded');
      }
      
      const uploadResult = await this.cloudinaryService.uploadFile(file, 'vehicles');
  
      return {
        url: uploadResult,
        message: 'File uploaded successfully',
      };
    }
  
    @Post('/add')
    @Auth()
    @ApiOperation({ summary: 'Add a new vehicle for a user' })
    @ApiParam({ name: 'userId', example: '60d5f8a2b4d6c849d4a3b125', description: 'User ID' })
    @ApiResponse({ status: 201, description: 'Vehicle added successfully' })
    async addVehicle(@GetUserId() userId: Types.ObjectId, @Body() createVehicleDto: CreateVehicleDto) {
      const vehicle = await this.vehicleService.addVehicle(userId, createVehicleDto);
      return {
        status: 201,
        message: 'Vehicle added successfully',
        data: vehicle,
      };
    }
  
    // 🔍 Get Vehicle by ID
    @Get('/:id')
    @ApiOperation({ summary: 'Retrieve vehicle details by ID' })
    @ApiParam({ name: 'id', example: '60d5f8a2b4d6c849d4a3b130', description: 'Vehicle ID' })
    @ApiResponse({ status: 200, description: 'Vehicle retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Vehicle not found' })
    async getVehicle(@Param('id') id: string) {
      const vehicle = await this.vehicleService.getVehicleById(id);
      return {
        status: 200,
        message: 'Vehicle fetched successfully',
        data: vehicle,
      };
    }
  
    // 📝 Update Vehicle
    @Patch('/:id')
    @ApiOperation({ summary: 'Update an existing vehicle' })
    @ApiParam({ name: 'id', example: '60d5f8a2b4d6c849d4a3b130', description: 'Vehicle ID' })
    @ApiResponse({ status: 200, description: 'Vehicle updated successfully' })
    @ApiResponse({ status: 404, description: 'Vehicle not found' })
    async updateVehicle(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
      const updatedVehicle = await this.vehicleService.updateVehicle(id, updateVehicleDto);
      return {
        status: 200,
        message: 'Vehicle updated successfully',
        data: updatedVehicle,
      };
    }
  
    // ❌ Delete Vehicle
    @Delete('/:userId/:vehicleId')
    @ApiOperation({ summary: 'Delete a vehicle linked to a user' })
    @ApiParam({ name: 'userId', example: '60d5f8a2b4d6c849d4a3b125', description: 'User ID' })
    @ApiParam({ name: 'vehicleId', example: '60d5f8a2b4d6c849d4a3b130', description: 'Vehicle ID' })
    @ApiResponse({ status: 200, description: 'Vehicle deleted successfully' })
    @ApiResponse({ status: 404, description: 'Vehicle not found' })
    async deleteVehicle(@Param('userId') userId: string, @Param('vehicleId') vehicleId: string) {
      await this.vehicleService.deleteVehicle(userId, vehicleId);
      return {
        status: 200,
        message: 'Vehicle deleted successfully',
      };
    }
  
    // 📋 List All Vehicles
    @Get('/')
    @ApiOperation({ summary: 'Retrieve all vehicles' })
    @ApiResponse({ status: 200, description: 'Vehicles retrieved successfully' })
    async listAllVehicles() {
      const vehicles = await this.vehicleService.listAllVehicles();
      return {
        status: 200,
        message: 'Vehicles retrieved successfully',
        data: vehicles,
      };
    }
  }
  
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle, VehicleDocument } from './vehicle.schema';
import { User, UserDocument } from '../user/user.schema';
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto';
import { BrandDocument } from '../brand/brand.schema';
import { ModelDocument } from '../brand/model.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel('Vehicle') private vehicleModel: Model<VehicleDocument>,
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Brand') private brandModel: Model<BrandDocument>,
    @InjectModel('Model') private modelModel: Model<ModelDocument>
  ) {}

  // 🆕 Add Vehicle & Link to User
  async addVehicle(userId: Types.ObjectId, createVehicleDto: CreateVehicleDto): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');
  
    const brand = await this.brandModel.findById(createVehicleDto.brand);
    if (!brand) throw new NotFoundException('Brand not found');
  
    const model = await this.modelModel.findById(createVehicleDto.model);
    if (!model) throw new NotFoundException('Model not found');
  
    const newVehicle = new this.vehicleModel({
      ...createVehicleDto,
      brand: brand.name,
      model: model.name,
    });
  
    user.vehicles.push(newVehicle); 
    await user.save();
  
    return user;
  }
  
  
  // 🔍 Get Vehicle by ID
  async getVehicleById(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleModel.findById(id);
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return vehicle;
  }

  // 📝 Update Vehicle
  async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto): Promise<Vehicle> {
    const updatedVehicle = await this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, { new: true });
    if (!updatedVehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    return updatedVehicle;
  }

  // ❌ Delete Vehicle & Remove from User
  async deleteVehicle(userId: string, vehicleId: string): Promise<void> {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.vehicles = user.vehicles.filter(v => v._id.toString() !== vehicleId);
    await user.save();
    await this.vehicleModel.findByIdAndDelete(vehicleId);
  }

  // 📋 List All Vehicles
  async listAllVehicles(): Promise<Vehicle[]> {
    return this.vehicleModel.find();
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand, BrandDocument } from './brand.schema';
import { CreateBrandDto,GetBrandsDto,UpdateBrandDto } from './dto/brand.dto';
import { Model as ModelEntity, ModelDocument } from './model.schema';
import { CreateModelDto,GetModelsDto,UpdateModelDto } from './dto/model.dto';


@Injectable()
export class BrandService {
  constructor(@InjectModel('Brand') private brandModel: Model<BrandDocument>,
  @InjectModel('Model') private modelModel: Model<ModelDocument>) {}

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandModel.create(createBrandDto);
  }

  async findAllBrand(getBrandsDto:GetBrandsDto): Promise<Brand[]> {
    const skip = (getBrandsDto.page - 1) * getBrandsDto.limit;
    const brands = await this.brandModel.find().skip(skip).limit(getBrandsDto.limit).exec();
    return brands;
  }
  

  async findOneBrand(userId: Types.ObjectId): Promise<Brand> {
    const brand = await this.brandModel.findById(userId).exec();
    if (!brand) throw new NotFoundException('Brand not found');
    return brand;
  }

  async updateBrand(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    return this.brandModel.findByIdAndUpdate(id, updateBrandDto, { new: true });
  }

  async removeBrand(id: string): Promise<void> {
    await this.brandModel.findByIdAndDelete(id);
  }

  async createModel(createModelDto: CreateModelDto): Promise<ModelEntity> {
    const brandId = new Types.ObjectId(createModelDto.brand);
    const brandExists = await this.brandModel.exists({ _id: brandId });
    if (!brandExists) {
      throw new NotFoundException('Brand not found');
    }
    const newModel = new this.modelModel({
      name: createModelDto.name,
      brand: brandId, 
    });
    return await newModel.save();
  }

  async findAllModel(getModelsDto:GetModelsDto): Promise<ModelEntity[]> {
    const skip = (getModelsDto.page - 1) * getModelsDto.limit;
    const limit = getModelsDto.limit;
    // Fetch models with pagination
    const models = await this.modelModel.find().populate('brand').skip(skip).limit(limit).exec();
    // Return the models along with pagination info
    return models;
  }
  

  async findOneModel(id: string): Promise<ModelEntity> {
    const model = await this.modelModel.findById(id).populate('brand').exec();
    if (!model) throw new NotFoundException('Model not found');
    return model;
  }

  async updateModel(id: string, updateModelDto: UpdateModelDto): Promise<ModelEntity> {
    return this.modelModel.findByIdAndUpdate(id, updateModelDto, { new: true });
  }

  async removeModel(id: string): Promise<void> {
    await this.modelModel.findByIdAndDelete(id);
  }

  async getModelByBrandId(
    brandId: Types.ObjectId, 
    getModelsDto:GetModelsDto
  ): Promise<ModelEntity[]> {
    const skip = (getModelsDto.page - 1) * getModelsDto.limit;
    const limit = getModelsDto.limit;
    const models = await this.modelModel
      .find({ brand: brandId })
      .skip(skip) 
      .limit(limit); 
  
    return models;
  }
  
}

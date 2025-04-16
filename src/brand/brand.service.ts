import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Brand, BrandDocument } from './brand.schema';
import { CreateBrandDto,UpdateBrandDto } from './dto/brand.dto';
import { Model as ModelEntity, ModelDocument } from './model.schema';
import { CreateModelDto,UpdateModelDto } from './dto/model.dto';


@Injectable()
export class BrandService {
  constructor(@InjectModel('Brand') private brandModel: Model<BrandDocument>,
  @InjectModel('Model') private modelModel: Model<ModelDocument>) {}

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    return this.brandModel.create(createBrandDto);
  }

  async findAllBrand(page: number, limit: number): Promise<{ brands: Brand[], pagination: { page: number, limit: number, totalBrands: number, totalPages: number } }> {
    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;
  
    // Get the total number of brands
    const totalBrands = await this.brandModel.countDocuments();
  
    // Fetch brands with pagination
    const brands = await this.brandModel.find().skip(skip).limit(limit).exec();
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalBrands / limit);
  
    // Return the brands along with pagination info
    return {
      brands,
      pagination: {
        page,
        limit,
        totalBrands,
        totalPages,
      },
    };
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

  async findAllModel(page: number, limit: number): Promise<{ models: ModelEntity[], pagination: { page: number, limit: number, totalModels: number, totalPages: number } }> {
    // Calculate the skip value for pagination
    const skip = (page - 1) * limit;
  
    // Get the total number of models
    const totalModels = await this.modelModel.countDocuments();
  
    // Fetch models with pagination
    const models = await this.modelModel.find().populate('brand').skip(skip).limit(limit).exec();
  
    // Calculate the total number of pages
    const totalPages = Math.ceil(totalModels / limit);
  
    // Return the models along with pagination info
    return {
      models,
      pagination: {
        page,
        limit,
        totalModels,
        totalPages,
      },
    };
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
    page: number, 
    limit: number
  ) {
    // Validate if brand exists
    const brandExists = await this.brandModel.exists({ _id: brandId });
    if (!brandExists) {
      throw new NotFoundException('Brand not found');
    }
  
    // Fetch the total count of models for the given brand
    const totalModels = await this.modelModel.countDocuments({ brand: brandId });
  
    // Fetch models with pagination
    const models = await this.modelModel
      .find({ brand: brandId })
      .skip((page - 1) * limit) // Skip models for the previous pages
      .limit(limit); // Limit the number of models per page
  
    // Calculate total pages
    const totalPages = Math.ceil(totalModels / limit);
  
    return {
      models,
      pagination: {
        page,
        limit,
        totalModels,
        totalPages,
      },
    };
  }
  
}

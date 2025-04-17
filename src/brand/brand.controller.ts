import { Controller, Get, Post, Body, Patch, Param, Delete,Query, NotFoundException } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto, GetBrandsDto, UpdateBrandDto } from './dto/brand.dto';
import { CreateModelDto, GetModelsDto, UpdateModelDto } from './dto/model.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Types } from 'mongoose';

@ApiTags('Brands & Models') // Adds a section in Swagger UI
@Controller('brands')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  // 📌 Create Brand
  @Post('')
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({ status: 201, description: 'Brand created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createBrand(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandService.createBrand(createBrandDto);
    return { statusCode: 201, message: 'Brand created successfully', data: brand };
  }

  // 🔍 Get All Brands
  @Get('')
  @ApiOperation({ summary: 'Retrieve all brands with pagination' })
  @ApiResponse({ status: 200, description: 'Brands retrieved successfully' })
  @ApiQuery({
    name: 'page',
    description: 'The page number for pagination',
    required: false,
    type: Number,
    example: 1, // Optional example value
  })
  @ApiQuery({
    name: 'limit',
    description: 'The number of brands per page',
    required: false,
    type: Number,
    example: 10, // Optional example value
  })
  async findAllBrand(@Query() getBrandsDto:GetBrandsDto ) {
    const brands = await this.brandService.findAllBrand(getBrandsDto);
    
    return {
      statusCode: 200,
      message: 'Brands retrieved successfully',
      data: brands,
    };
  }
  

  // 🔍 Get Single Brand
  @Get(':userId')
  @ApiOperation({ summary: 'Retrieve a specific brand by ID' })
  @ApiParam({ name: 'id', description: 'Brand ID', required: true })
  @ApiResponse({ status: 200, description: 'Brand retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async findOneBrand(@Param('userId') userId: Types.ObjectId) {
    const brand = await this.brandService.findOneBrand(userId);
    return { statusCode: 200, message: 'Brand retrieved successfully', data: brand };
  }

  // 📝 Update Brand
  @Patch(':id')
  @ApiOperation({ summary: 'Update a brand by ID' })
  @ApiParam({ name: 'id', description: 'Brand ID', required: true })
  @ApiResponse({ status: 200, description: 'Brand updated successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async updateBrand(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    const updatedBrand = await this.brandService.updateBrand(id, updateBrandDto);
    return { statusCode: 200, message: 'Brand updated successfully', data: updatedBrand };
  }

  // ❌ Delete Brand
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiParam({ name: 'id', description: 'Brand ID', required: true })
  @ApiResponse({ status: 200, description: 'Brand deleted successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async removeBrand(@Param('id') id: string) {
    await this.brandService.removeBrand(id);
    return { statusCode: 200, message: 'Brand deleted successfully', data: null };
  }

  // 📌 Create Model
  @Post('model')
  @ApiOperation({ summary: 'Create a new model' })
  @ApiResponse({ status: 201, description: 'Model created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async createModel(@Body() createModelDto: CreateModelDto) {
    const model = await this.brandService.createModel(createModelDto);
    return { statusCode: 201, message: 'Model created successfully', data: model };
  }

  // 🔍 Get All Models
  @Get('models')
  @ApiOperation({ summary: 'Retrieve all models with pagination' })
  @ApiResponse({ status: 200, description: 'Models retrieved successfully' })
  @ApiQuery({
    name: 'page',
    description: 'The page number for pagination',
    required: false,
    type: Number,
    example: 1, // Optional example value
  })
  @ApiQuery({
    name: 'limit',
    description: 'The number of models per page',
    required: false,
    type: Number,
    example: 10, // Optional example value
  })
  async findAllModel(
    @Query() getModelsDto:GetModelsDto, 
  ) {
    const models = await this.brandService.findAllModel(getModelsDto);
    return { 
      statusCode: 200, 
      message: 'Models retrieved successfully', 
      data: models 
    };
  }
  

  // 🔍 Get Single Model
  @Get('model/:id')
  @ApiOperation({ summary: 'Retrieve a specific model by ID' })
  @ApiParam({ name: 'id', description: 'Model ID', required: true })
  @ApiResponse({ status: 200, description: 'Model retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async findOneModel(@Param('id') id: string) {
    const model = await this.brandService.findOneModel(id);
    return { statusCode: 200, message: 'Model retrieved successfully', data: model };
  }

  // 📝 Update Model
  @Patch('model/:id')
  @ApiOperation({ summary: 'Update a model by ID' })
  @ApiParam({ name: 'id', description: 'Model ID', required: true })
  @ApiResponse({ status: 200, description: 'Model updated successfully' })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async updateModel(@Param('id') id: string, @Body() updateModelDto: UpdateModelDto) {
    const updatedModel = await this.brandService.updateModel(id, updateModelDto);
    return { statusCode: 200, message: 'Model updated successfully', data: updatedModel };
  }

  // ❌ Delete Model
  @Delete('model/:id')
  @ApiOperation({ summary: 'Delete a model by ID' })
  @ApiParam({ name: 'id', description: 'Model ID', required: true })
  @ApiResponse({ status: 200, description: 'Model deleted successfully' })
  @ApiResponse({ status: 404, description: 'Model not found' })
  async removeModel(@Param('id') id: string) {
    await this.brandService.removeModel(id);
    return { statusCode: 200, message: 'Model deleted successfully', data: null };
  }

  @Get('/models/:id')
  @ApiOperation({ summary: 'Retrieve all models under a specific brand with pagination' })
  @ApiParam({ name: 'id', description: 'Brand ID (MongoDB ObjectId)', required: true, type: String }) // Explicitly specify type
  @ApiQuery({
    name: 'page',
    description: 'The page number for pagination',
    required: false,
    type: Number,
    example: 1, // Optional example value
  })
  @ApiQuery({
    name: 'limit',
    description: 'The number of models per page',
    required: false,
    type: Number,
    example: 10, // Optional example value
  })
  @ApiResponse({ status: 200, description: 'Models fetched successfully' })
  @ApiResponse({ status: 404, description: 'Brand not found' })
  async getModelByBrandId(
    @Param('id') id: string, 
    @Query() getModelsDto:GetModelsDto,
  ) {
    const brand = await this.brandService.findOneBrand(Types.ObjectId.createFromHexString(id));
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const models = await this.brandService.getModelByBrandId(Types.ObjectId.createFromHexString(id), getModelsDto);
    return {
      statusCode: 200,
      message: 'Models fetched successfully',
      data: models,
    };
  }
  
  
}

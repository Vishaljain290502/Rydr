import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { FilterDto } from 'src/utils/filter.dto';

export class CreateModelDto {
  @ApiProperty({
    example: 'Corolla',
    description: 'Name of the vehicle model',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: '60d5f8a2b4d6c849d4a3b123',
    description: 'ObjectId of the associated brand',
  })
  @IsMongoId() 
  @IsNotEmpty()
  brand: string; 
}

export class UpdateModelDto extends PartialType(CreateModelDto) {
  @ApiProperty({
    example: 'Corolla',
    description: 'Updated model name (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: '60d5f8a2b4d6c849d4a3b123',
    description: 'Updated brand ObjectId (optional)',
    required: false,
  })
  @IsMongoId()
  @IsOptional()
  brand?: string;
}

export class GetModelsDto extends FilterDto{}
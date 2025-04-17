import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { FilterDto } from 'src/utils/filter.dto';

export class CreateBrandDto {
  @ApiProperty({
    example: 'Toyota',
    description: 'Name of the vehicle brand',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL of the brand logo (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {
  @ApiProperty({
    example: 'Toyota',
    description: 'Updated brand name (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'https://example.com/new-logo.png',
    description: 'Updated logo URL (optional)',
    required: false,
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;
}

export class GetBrandsDto extends FilterDto{}
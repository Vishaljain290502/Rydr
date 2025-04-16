import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { Brand, BrandSchema } from './brand.schema';
import { Model, ModelSchema } from './model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Brand', schema: BrandSchema },
      { name: 'Model', schema: ModelSchema },
    ]),
  ],
  providers: [BrandService],
  controllers: [BrandController],
  exports: [BrandService], 
})
export class BrandModule {}

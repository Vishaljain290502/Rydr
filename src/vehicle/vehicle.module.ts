import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { Vehicle, VehicleSchema } from './vehicle.schema';
import { HelperModule } from '../helper/helper.module';
import { UserModule } from '../user/user.module';
import { BrandModule } from '../brand/brand.module';
import { UserSchema } from '../user/user.schema';
import { AuthModule } from '../auth/auth.module';
import { BrandSchema } from '../brand/brand.schema';
import { ModelSchema } from '../brand/model.schema';

@Module({
  imports: [
    AuthModule,MongooseModule.forFeature([{ name: 'Vehicle', schema: VehicleSchema },{name:"User",schema:UserSchema},  { name: 'Brand', schema: BrandSchema },
          { name: 'Model', schema: ModelSchema },]),HelperModule,UserModule,BrandModule],
  controllers: [VehicleController],
  providers: [VehicleService],
  exports: [VehicleService],
})
export class VehicleModule {}

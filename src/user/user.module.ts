import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { CloudinaryService } from 'src/services/cloudinaruy-services';
import { CloudinaryModule } from 'src/services/cloudinary.module';
import { AuthModule } from 'src/auth/auth.module';
import { HelperModule } from 'src/helper/helper.module';

@Module({
  imports:[MongooseModule.forFeature([{name:"User",schema:UserSchema}]),
  CloudinaryModule,AuthModule,HelperModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}

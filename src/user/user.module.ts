import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './user.schema';
import { CloudinaryService } from 'src/services/cloudinaruy-services';
import { CloudinaryModule } from 'src/services/cloudinary.module';

@Module({
  imports:[MongooseModule.forFeature([{name:"User",schema:userSchema}]),
  CloudinaryModule],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}

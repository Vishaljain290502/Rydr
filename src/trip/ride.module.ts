import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripController } from './ride.controller';
import { TripService } from './ride.service';
import { TripSchema } from './ride.schema';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../user/user.schema';
import { NotificationModule } from 'src/services/notification.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema },{name:"User",schema:UserSchema}]),AuthModule,NotificationModule],
  controllers: [TripController],
  providers: [TripService]
})
export class TripModule {}

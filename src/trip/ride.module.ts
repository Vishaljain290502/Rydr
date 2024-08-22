import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripController } from './ride.controller';
import { TripService } from './ride.service';
import { TripSchema } from './ride.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema }]),AuthModule],
  controllers: [TripController],
  providers: [TripService]
})
export class TripModule {}

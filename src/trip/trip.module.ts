import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TripController } from './trip.controller';
import { TripService } from './trip.service';
import { TripSchema } from './trip.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Trip', schema: TripSchema }]),AuthModule],
  controllers: [TripController],
  providers: [TripService]
})
export class TripModule {}

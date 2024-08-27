import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip } from './ride.schema';

@Injectable()
export class TripService {
  constructor(@InjectModel('Trip') private readonly tripModel: Model<Trip>) {}

  async createTrip(createTripDto: any, userId: Types.ObjectId): Promise<Trip> {
    const newTrip = new this.tripModel({ ...createTripDto, host:userId });
    return await newTrip.save(); 
  }
  
  async joinTrip(tripId: string, userId: Types.ObjectId): Promise<Trip> {
    const trip = await this.tripModel.findById(tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    if (trip.seatsAvailable <= 0) {
      throw new UnauthorizedException('No seats available');
    }
    trip.participants.push(userId.toHexString());
    trip.seatsAvailable -= 1;
    return await trip.save();
  }

  async getTripDetails(tripId: string): Promise<Trip> {
    const trip = await this.tripModel.findById(tripId).populate('participants');
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    return trip;
  }

  async leaveTrip(tripId: string, userId: Types.ObjectId): Promise<Trip> {
    const trip = await this.tripModel.findById(tripId);
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
    const userIdString = userId.toHexString();
    trip.participants = trip.participants.filter(
      participant => participant !== userIdString
    );
    trip.seatsAvailable += 1;
    return await trip.save();
  }

  async cancelTrip(tripId: string): Promise<void> {
    const result = await this.tripModel.deleteOne({ _id: tripId });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Trip not found');
    }
  }

  async listAllTrips(userId: Types.ObjectId): Promise<Trip[]> {
    return this.tripModel.find({ host: userId });
  }

  async updateTrip(tripId: string, updateTripDto: any, userId: Types.ObjectId): Promise<Trip> {
    const trip = await this.tripModel.findOneAndUpdate(
      { _id: tripId, host: userId },
      updateTripDto,
      { new: true },
    );
    if (!trip) {
      throw new NotFoundException('Trip not found or unauthorized');
    }
    return trip;
  }
}

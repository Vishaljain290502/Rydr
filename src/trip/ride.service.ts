import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip } from './ride.schema';

@Injectable()
export class TripService {
  constructor(@InjectModel('Trip') private readonly tripModel: Model<Trip>) {}

  async createTrip(createTripDto: any, userId: Types.ObjectId): Promise<Trip> {
    const newTrip = new this.tripModel({
      ...createTripDto,
      host: userId,
      participants: [userId] 
    });
  
    return await newTrip.save();
  }
  
  async joinTrip(tripId: string, userId: Types.ObjectId): Promise<Trip> {
    const trip = await this.tripModel.findById(tripId);
    
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
  
    // Check if the user is already a participant
    if (trip.participants.includes(userId.toHexString())) {
      throw new UnauthorizedException('User already joined this trip');
    }
  
    // Check if available seats are sufficient
    if (trip.participants.length >= trip.seatsAvailable) {
      throw new UnauthorizedException('No seats available');
    }
  
    // Add user to participants and decrease available seats
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
  
    // Prevent host from leaving
    if (trip.host.toString() === userId.toHexString()) {
      throw new UnauthorizedException('Host cannot leave the trip');
    }
  
    const userIdString = userId.toHexString();
    const initialParticipantsCount = trip.participants.length;
  
    // Remove user from participants
    trip.participants = trip.participants.filter(participant => participant !== userIdString);
  
    // If user was in the participants list, increase available seats
    if (trip.participants.length < initialParticipantsCount) {
      trip.seatsAvailable += 1;
    } else {
      throw new UnauthorizedException('User is not a participant of this trip');
    }
  
    return await trip.save();
  }
  
  async cancelTrip(tripId: string, userId: Types.ObjectId): Promise<void> {
    const trip = await this.tripModel.findById(tripId);
  
    if (!trip) {
      throw new NotFoundException('Trip not found');
    }
  
    // Only the host can cancel the trip
    if (trip.host.toString() !== userId.toHexString()) {
      throw new UnauthorizedException('Only the host can cancel the trip');
    }
  
    await this.tripModel.deleteOne({ _id: tripId });
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

  async findNearbyRides(latitude: number, longitude: number, radiusInKm: number) {
    const radiusInMeters = radiusInKm * 1000; // Convert km to meters

    return this.tripModel.find({
      startLocation: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusInMeters,
        },
      },
      status: "scheduled", 
    });
  }

}

import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip } from './ride.schema';
import { CreateTripDto } from './dto/dto';
import { UserDocument } from '../user/user.schema';
import { NotificationService } from 'src/services/notification.service';

@Injectable()
export class TripService {
  constructor(@InjectModel('Trip') private readonly tripModel: Model<Trip>,
             @InjectModel('User') private readonly userModel: Model<UserDocument>,
             private notificationService: NotificationService
           ) {}

           async createTrip(createTripDto: CreateTripDto, userId: Types.ObjectId): Promise<Trip> {
            const { vehicle: vehicleId, participants = [], ...restDto } = createTripDto;
          
            // 1. Fetch host full object with their vehicles
            const host = await this.userModel.findById(userId);
            if (!host) {
              throw new NotFoundException('Host user not found');
            }
          
            // 2. Find the matching vehicle from the host’s vehicles
            const selectedVehicle = host.vehicles.find((v: any) => v._id.toString() === vehicleId);
            if (!selectedVehicle) {
              throw new NotFoundException('Vehicle not found in host’s profile');
            }
          
            // 3. Fetch all participants as full user objects
            const participantUsers = await this.userModel.find({ _id: { $in: participants } });
          
            // 4. Combine host and participants
            const allParticipants = [host, ...participantUsers];
          
            // 5. Create and save the trip
            const newTrip = new this.tripModel({
              ...restDto,
              host,
              vehicle: selectedVehicle,
              participants: allParticipants,
            });
          
            const savedTrip = await newTrip.save();
          
            // 6. ✅ Send notification to all participants (including host)
            const notificationTitle = '🚗 Trip Created';
            const notificationMessage = `You've joined a trip from ${savedTrip.sourceAddress} to ${savedTrip.destinationAddress}.`;
          
            try {
              await this.notificationService.sendPushNotificationToUsers(
                allParticipants,
                notificationTitle,
                notificationMessage
              );
            } catch (err) {
              console.error('Notification error:', err);
            }
          
            return savedTrip;
          }          
          
          async joinTrip(tripId: string, userId: Types.ObjectId): Promise<Trip> {
            const trip = await this.tripModel.findById(tripId);
            if (!trip) {
              throw new NotFoundException('Trip not found');
            }
          
            const user = await this.userModel.findById(userId);
            if (!user) {
              throw new NotFoundException('User not found');
            }
          
            const alreadyJoined = trip.participants.some(participant =>
              participant._id.toString() === user._id.toString()
            );
          
            if (alreadyJoined) {
              throw new UnauthorizedException('User already joined this trip');
            }
          
            if (trip.participants.length >= trip.seatsAvailable) {
              throw new UnauthorizedException('No seats available');
            }
          
            // ✅ Push user to participants
            trip.participants.push(user);
            trip.seatsAvailable -= 1;
          
            const updatedTrip = await trip.save();
          
            // 📲 Send notification to the user who just joined
            const title = '🎉 Trip Joined Successfully';
            const message = `You’ve joined a trip from ${trip.sourceAddress} to ${trip.destinationAddress}.`;
          
            try {
              await this.notificationService.sendPushNotificationToUsers(
                [user], // single user array
                title,
                message
              );
            } catch (error) {
              console.error('Failed to send join trip notification:', error);
            }
          
            return updatedTrip;
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
    if (trip.host._id.toString() === userId.toHexString()) {
      throw new UnauthorizedException('Host cannot leave the trip');
    }
  
    const userIdString = userId.toHexString();
    const initialParticipantsCount = trip.participants.length;
  
    // Remove user from participants (compare by _id)
    trip.participants = trip.participants.filter(
      (participant) => participant._id.toString() !== userIdString
    );
  
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
    const radiusInMeters = radiusInKm * 1000; 

    return this.tripModel.find({
      source: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusInMeters,
        },
      },
      status: "scheduled", 
    });
  }

  async getOngoingRides(userId: string) {
    const ongoingRides = await this.tripModel
      .find({
        $or: [
          { host: userId }, 
          { participants: userId },
        ],
        status: 'ongoing', 
      })
      .populate('vehicle')
      .populate('host')
      .populate('participants'); // Optionally populate related data like vehicle and participants

    return ongoingRides;
  }

  async updateTripStatus(tripId: string, status: string) {
    const validStatuses = ["scheduled", "ongoing", "rescheduled", "canceled", "completed"];
  
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid trip status');
    }
  
    const updatedTrip = await this.tripModel.findByIdAndUpdate(
      tripId,
      { status },
      { new: true }
    );
  
    if (!updatedTrip) {
      throw new NotFoundException('Trip not found');
    }
  
    // 📲 Send notification to host and participants
    try {
      const usersToNotify = [updatedTrip.host, ...updatedTrip.participants];
      const title = `🛣️ Trip Status Updated`;
      const message = `The trip from ${updatedTrip.sourceAddress} to ${updatedTrip.destinationAddress} is now marked as "${status}".`;
  
      await this.notificationService.sendPushNotificationToUsers(usersToNotify, title, message);
    } catch (error) {
      console.error('Notification error while updating trip status:', error);
    }
  
    return updatedTrip;
  }
  

}

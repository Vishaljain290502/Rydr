import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Trip } from './ride.schema';
import { CreateTripDto } from './dto/dto';
import { UserDocument } from '../user/user.schema';
import { NotificationService } from 'src/services/notification.service';

@Injectable()
export class TripService {
  constructor(
    @InjectModel('Trip') private readonly tripModel: Model<Trip>,
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
    private notificationService: NotificationService,
  ) {}

  async createTrip(
    createTripDto: CreateTripDto,
    userId: Types.ObjectId,
  ): Promise<Trip> {
    const { vehicle: vehicleId, participants = [], ...restDto } = createTripDto;

    const host = await this.userModel.findById(userId);
    if (!host) {
      throw new NotFoundException('Host user not found');
    }

    const selectedVehicle = host.vehicles.find(
      (v: any) => v._id.toString() === vehicleId,
    );
    if (!selectedVehicle) {
      throw new NotFoundException('Vehicle not found in host’s profile');
    }
  

    const participantUsers = await this.userModel.find({
      _id: { $in: participants },
    });
  

    const hostPayload = {
      _id: host._id,
      firstName: host.firstName,
      lastName: host.lastName,
      number: host.number,
      countryCode: host.countryCode,
      profileImage: host.profileImage,
    };
  
    const participantPayloads = participantUsers.map(user => ({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      number: user.number,
      countryCode: user.countryCode,
      profileImage: user.profileImage,
    }));
  
 
    const newTrip = new this.tripModel({
      ...restDto,
      host: hostPayload,
      vehicle: selectedVehicle,
      participants: [hostPayload, ...participantPayloads],
    });
  
    const savedTrip = await newTrip.save();
  

    const notificationTitle = '🚗 Trip Created';
    const notificationMessage = `You've joined a trip from ${savedTrip.sourceAddress} to ${savedTrip.destinationAddress}.`;
  
    try {
      await this.notificationService.sendPushNotificationToUsers(
        [host, ...participantUsers], 
        notificationTitle,
        notificationMessage,
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

    const alreadyJoined = trip.participants.some(
      (participant) => participant._id.toString() === user._id.toString(),
    );

    if (alreadyJoined) {
      throw new BadRequestException('User already joined this trip');
    }

    if (trip.participants.length >= trip.seatsAvailable) {
      throw new BadRequestException('No seats available');
    }

    // ✅ Push user to participants
    trip.participants.push({
      _id:user._id,
      firstName:user.firstName,
      lastName:user.lastName,
      profileImage:user.profileImage,
      number:user.number,
      countryCode:user.countryCode,
    });
    trip.seatsAvailable -= 1;

    const updatedTrip = await trip.save();

    // 📲 Send notification to the user who just joined
    const title = '🎉 Trip Joined Successfully';
    const message = `You’ve joined a trip from ${trip.sourceAddress} to ${trip.destinationAddress}.`;

    try {
      await this.notificationService.sendPushNotificationToUsers(
        [user],
        title,
        message,
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
  
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    const userIdString = userId.toHexString();
    const initialParticipantsCount = trip.participants.length;
  
    // Remove user from participants
    trip.participants = trip.participants.filter(
      (participant) => participant._id.toString() !== userIdString,
    );
  
    if (trip.participants.length < initialParticipantsCount) {
      trip.seatsAvailable += 1;
  
      // ✅ Send notification to host
      const notificationTitle = '👤 User Left Trip';
      const notificationMessage = `${user.firstName} ${user.lastName} has left the trip from ${trip.sourceAddress} to ${trip.destinationAddress}.`;
  
      // try {
      //   await this.notificationService.sendPushNotificationToUsers(
      //     [trip.host],
      //     notificationTitle,
      //     notificationMessage,
      //   );
      // } catch (err) {
      //   console.error('Notification to host failed:', err);
      // }
  
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

  async updateTrip(
    tripId: string,
    updateTripDto: any,
    userId: Types.ObjectId,
  ): Promise<Trip> {
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

  async findNearbyRides(
    latitude: number,
    longitude: number,
    radiusInKm: number,
  ) {
    const radiusInMeters = radiusInKm * 1000;

    return this.tripModel.find({
      source: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusInMeters,
        },
      },
      status: 'scheduled',
    });
  }

  async getOngoingRides(userId: string) {
    const ongoingRides = await this.tripModel
      .find({
        $or: [{ host: userId }, { participants: userId }],
        status: 'ongoing',
      })
      .populate('vehicle')
      .populate('host')
      .populate('participants'); // Optionally populate related data like vehicle and participants

    return ongoingRides;
  }

  async updateTripStatus(tripId: string, status: string) {
    const validStatuses = [
      'scheduled',
      'ongoing',
      'rescheduled',
      'canceled',
      'completed',
    ];

    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Invalid trip status');
    }

    const updatedTrip = await this.tripModel.findByIdAndUpdate(
      tripId,
      { status },
      { new: true },
    );

    if (!updatedTrip) {
      throw new NotFoundException('Trip not found');
    }

    // 📲 Send notification to host and participants
    try {
      const usersToNotify = [updatedTrip.host, ...updatedTrip.participants];
      const title = `🛣️ Trip Status Updated`;
      const message = `The trip from ${updatedTrip.sourceAddress} to ${updatedTrip.destinationAddress} is now marked as "${status}".`;

      // await this.notificationService.sendPushNotificationToUsers(
      //   usersToNotify,
      //   title,
      //   message,
      // );
    } catch (error) {
      console.error('Notification error while updating trip status:', error);
    }

    return updatedTrip;
  }
}

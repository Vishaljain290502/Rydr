import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpStatus,
  Query,
  Req,
} from '@nestjs/common';
import { TripService } from './ride.service';
import { CreateTripDto, UpdateTripDto } from './dto/dto';
import { AuthGuard, GetUserId } from '../guard/authGuard';
import { Auth } from '../guard/authGuard';
import { Types } from 'mongoose';
import {
  ApiSecurity,
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Trips')
@ApiSecurity('basic')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('/createTrip')
  @Auth()
  @ApiOperation({ summary: 'Create a new trip' })
  @ApiBody({ type: CreateTripDto })
  @ApiResponse({ status: 201, description: 'Trip created successfully' })
  async createTrip(
    @Body() createTripDto: CreateTripDto,
    @GetUserId() userId: Types.ObjectId,
  ) {
    const trip = await this.tripService.createTrip(createTripDto, userId);
    return {
      status: HttpStatus.CREATED,
      message: 'Trip created successfully',
      data: trip,
    };
  }

  @Post('/join')
  @Auth()
  @ApiOperation({ summary: 'Join an existing trip' })
  @ApiBody({ schema: { properties: { tripId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Successfully joined the trip' })
  async joinTrip(
    @Body() body: { tripId: string },
    @GetUserId() userId: Types.ObjectId,
  ) {
    const joinedTrip = await this.tripService.joinTrip(body.tripId, userId);
    return {
      status: HttpStatus.OK,
      message: 'Successfully joined the trip',
      data: joinedTrip,
    };
  }

  @Get('/tripDetails/:tripId')
  @Auth()
  @ApiOperation({ summary: 'Get trip details' })
  @ApiParam({ name: 'tripId', description: 'ID of the trip', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Trip details retrieved successfully',
  })
  async getTripDetails(@Param('tripId') tripId: string) {
    const trip = await this.tripService.getTripDetails(tripId);
    return {
      status: HttpStatus.OK,
      message: 'Trip details retrieved successfully',
      data: trip,
    };
  }

  @Post('/leaveTrip')
  @Auth()
  @ApiOperation({ summary: 'Leave a trip' })
  @ApiBody({ schema: { properties: { tripId: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Successfully left the trip' })
  async leaveTrip(
    @Body() body: { tripId: string },
    @GetUserId() userId: Types.ObjectId,
  ) {
    const leftTrip = await this.tripService.leaveTrip(body.tripId, userId);
    return {
      status: HttpStatus.OK,
      message: 'Successfully left the trip',
      data: leftTrip,
    };
  }

  @Delete('/cancelTrip/:tripId')
  @Auth()
  @ApiOperation({ summary: 'Cancel a trip' })
  @ApiParam({ name: 'tripId', description: 'ID of the trip', type: 'string' })
  @ApiResponse({ status: 200, description: 'Trip canceled successfully' })
  async cancelTrip(
    @Param('tripId') tripId: string,
    @GetUserId() userId: Types.ObjectId,
  ) {
    await this.tripService.cancelTrip(tripId, userId);
    return {
      status: HttpStatus.OK,
      message: 'Trip canceled successfully',
      data: null,
    };
  }

  @Get('/getAllTrips')
  @Auth()
  @ApiOperation({ summary: 'List all trips' })
  @ApiResponse({ status: 200, description: 'Trips retrieved successfully' })
  async listAllTrips(@GetUserId() userId: Types.ObjectId) {
    const trips = await this.tripService.listAllTrips(userId);
    return {
      status: HttpStatus.OK,
      message: 'Trips retrieved successfully',
      data: trips,
    };
  }

  @Patch('/updateTrip/:tripId')
  @Auth()
  @ApiOperation({ summary: 'Update trip details' })
  @ApiParam({ name: 'tripId', description: 'ID of the trip', type: 'string' })
  @ApiBody({ type: UpdateTripDto })
  @ApiResponse({ status: 200, description: 'Trip updated successfully' })
  async updateTrip(
    @Param('tripId') tripId: string,
    @Body() updateTripDto: UpdateTripDto,
    @GetUserId() userId: Types.ObjectId,
  ) {
    const updatedTrip = await this.tripService.updateTrip(
      tripId,
      updateTripDto,
      userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'Trip updated successfully',
      data: updatedTrip,
    };
  }

  @Get('nearby')
  async getNearbyRides(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number = 10,
  ) {
    const rides = await this.tripService.findNearbyRides(
      latitude,
      longitude,
      radius,
    );
    return {
      status: HttpStatus.OK,
      message: 'Nearby rides  fetched successfully',
      data: rides,
    };
  }

  @Get('ongoing')
  @Auth()
  async getOngoingRides(@GetUserId() userId: string) {
    const ongoingRides = await this.tripService.getOngoingRides(userId);
    return {
      status: 'success',
      data: ongoingRides,
      message: 'Ongoing rides fetched successfully',
    };
  }

  @Patch('status/:tripId')
  async changeTripStatus(
    @Param('tripId') tripId: string,
    @Body('status') status: string,
  ) {
    const updatedTrip = await this.tripService.updateTripStatus(tripId, status);

    return {
      statusCode: HttpStatus.OK,
      message: 'Trip status updated successfully',
      data: updatedTrip,
    };
  }

  @Get('my-trips')
  @Auth()
  async getMyTrips(@Req() req, @GetUserId() userId: Types.ObjectId) {
    const rides = await this.tripService.getMyTrips(userId);
    return {
      status: HttpStatus.OK,
      message: 'Rides Fetched succesfully',
      data: rides,
    };
  }
}

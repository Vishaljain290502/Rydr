import { Controller, Post, Get, Patch, Delete, Param, Body, Query, Req, UseGuards } from '@nestjs/common';
import { TripService } from './ride.service';
import { CreateTripDto } from './dto/create.trip.dto';
import { UpdateTripDto } from './dto/update.trip.dto';
import { AuthGuard, GetUserId } from '../guard/authGuard'; 
import { Auth } from '../guard/authGuard';
import { Request } from 'express';
import { Types } from 'mongoose';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('trips')
@ApiSecurity('basic')
@Controller('trips')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  @Post('/createTrip')
  @Auth()
  async createTrip(@Body() createTripDto: CreateTripDto, @GetUserId() userId:Types.ObjectId) {
    return await this.tripService.createTrip(createTripDto, userId);
  }

  @Post('/join')
  @Auth()
  async joinTrip(@Body() body: { tripId: string }, @GetUserId() userId:Types.ObjectId) {
    return await this.tripService.joinTrip(body.tripId, userId);
  }

  @Auth()
  @Get('/tripDetails/:tripId')
  async getTripDetails(@Param('tripId') tripId: string) {
    return await this.tripService.getTripDetails(tripId);
  }

  @Post('/leaveTrip')
  @Auth()
  async leaveTrip(@Body() body: { tripId: string }, @GetUserId() userId:Types.ObjectId) {
    return await this.tripService.leaveTrip(body.tripId, userId);
  }

  @Delete('cancelTrip/:tripId')
  @Auth()
  async cancelTrip(@Param('tripId') tripId: string) {
    await this.tripService.cancelTrip(tripId);
    return { message: 'Trip canceled successfully' };
  }

  @Get('/getAllTrips')
  @Auth()
  async listAllTrips(@GetUserId() userId:Types.ObjectId) {
    return await this.tripService.listAllTrips(userId);
  }

  @Patch('/updateTrip/:tripId')
  @Auth()
  async updateTrip(@Param('tripId') tripId: string, @Body() updateTripDto: UpdateTripDto, @GetUserId() userId:Types.ObjectId) {
    return await this.tripService.updateTrip(tripId, updateTripDto, userId);
  }
}

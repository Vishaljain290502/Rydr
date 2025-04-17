import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Vehicle } from 'src/vehicle/vehicle.schema';

@Schema({ _id: false }) 
export class Location {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @Prop({ type: [Number], required: true }) 
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);


@Schema()
export class Trip extends Document {
  @Prop({ type: String, required: true, ref: 'User' })
  host: string;

  @Prop({ type: LocationSchema, required: true })
  source: Location;

  @Prop({ required: true })
  sourceAddress: string; 

  @Prop({ type: LocationSchema, required: true })
  destination: Location;

  @Prop({ required: true })
  destinationAddress: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'Vehicle', required: true })
  vehicle: Vehicle;

  @Prop({ required: true })
  seatsAvailable: number;

  @Prop({ type: [{ type: String, ref: 'User' }] })
  participants: string[];

  @Prop({
    type: String,
    enum: ["scheduled", "ongoing", "rescheduled", "canceled", "completed"],
    default: "scheduled",
  })
  status: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ source: '2dsphere' });

TripSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
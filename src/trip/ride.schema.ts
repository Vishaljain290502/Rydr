import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../user/user.schema';
import { Vehicle } from 'src/vehicle/vehicle.schema';

@Schema()
export class Location {
  @Prop({ required: true })
  latitude: number;

  @Prop({ required: true })
  longitude: number;
}

const LocationSchema = SchemaFactory.createForClass(Location);

@Schema()
export class Trip extends Document {
  @Prop({ type: String, required: true, ref: 'User' })
  host: string;

  @Prop({ type: LocationSchema, required: true })
  startLocation: Location;

  @Prop({ type: LocationSchema, required: true })
  destination: Location;

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
    enum: ["scheduled", "rescheduled", "canceled", "completed"],
    default: "scheduled",
  })
  status: string;
}

export const TripSchema = SchemaFactory.createForClass(Trip);
TripSchema.index({ startLocation: '2dsphere' });

TripSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
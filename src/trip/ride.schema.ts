import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { User, UserSchema } from '../user/user.schema';
import { Vehicle, VehicleSchema } from 'src/vehicle/vehicle.schema';

@Schema({ _id: false })
export class TripUser {
  @Prop({ required: true })
  _id: Types.ObjectId;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  profileImage: string;

  @Prop()
  number: string;

  @Prop()
  countryCode: string;
}

export const TripUserSchema = SchemaFactory.createForClass(TripUser);
export type TripUserDocument = HydratedDocument<TripUser>;


@Schema({ _id: false }) 
export class Location {
  @Prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @Prop({ type: [Number], required: true }) 
  coordinates: number[];
}

export const LocationSchema = SchemaFactory.createForClass(Location);


export enum TripStatus {
   Scheduled="scheduled",
   Ongoing="ongoing",
   ReScheduled="rescheduled",
   Canceled="canceled",
   ompleted="completed"
}
@Schema()
export class Trip extends Document {
  @Prop({ type: TripUserSchema, required: true }) 
  host: TripUser;

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

  @Prop({ type: VehicleSchema, required: true }) 
  vehicle: Vehicle;

  @Prop({ required: true })
  seatsAvailable: number;

  @Prop({ type: [TripUserSchema], default: [] }) 
  participants: TripUser[];

  @Prop({
    type: String,
    enum: TripStatus,
    default: "scheduled",
  })
  status: string;

  @Prop({required: true,  default:0})
  pricePerPerson: number;
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
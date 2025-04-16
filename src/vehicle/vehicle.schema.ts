import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from '../brand/brand.schema';
import { Model } from '../brand/model.schema';

@Schema({ timestamps: true })
export class Vehicle {

  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })  
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  vehicleNumber: string;

  @Prop({ required: true })
  registrationCertificateNumber: string;

  @Prop({ required: true })
  insuranceNumber: string;

  @Prop()
  registrationCertificateUrl: string;

  @Prop()
  insuranceUrl: string;

  @Prop()
  vehiclePhotoUrl: string;

  @Prop({ required: true })
  vehicleOwnerName: string;

  @Prop()
  drivingLicenseUrl: string;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Brand' })
  brand: Brand;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Model' })
  model: Model;

  @Prop({ required: true })
  vehicleType: string;

  @Prop({ required: true })
  vehicleColor: string;

  @Prop({ required: true, enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid'] })
  fuelType: string;

  @Prop({ required: true })
  numberOfSeats: number;

  @Prop({ default: false })
  isAirConditioned: boolean;

  @Prop({ default: false })
  isVerified: boolean;
}

export type VehicleDocument = Vehicle & Document;
export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

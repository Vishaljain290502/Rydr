import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Vehicle, VehicleSchema } from '../vehicle/vehicle.schema';


// 📍 Location Schema
@Schema({ _id: false })
export class LocationDocument {
  @Prop({ type: String, enum: ["Point"], required: true, default: "Point" })
  type: string;

  @Prop({ type: [Number], required: true, default: [0, 0] })
  coordinates: [number, number];
}

export const LocationSchema = SchemaFactory.createForClass(LocationDocument);

// 🔐 Token Schema
@Schema({ _id: false })
export class TokenSchema {
  @Prop({ default: "" })
  refresh_token: string;

  @Prop({ default: "" })
  access_token: string;

  @Prop({ default: 0 })
  expires_in: number;
}

export const TokenSchemaModel = SchemaFactory.createForClass(TokenSchema);

// 📊 Analytics Schema
@Schema({ _id: false })
export class AnalyticsSchema {
  @Prop({ default: 0 })
  totalRides: number;

  @Prop({ default: 0 })
  totalSavings: number;

  @Prop({ default: 0 })
  averageRating: number;
}

export const AnalyticsSchemaModel = SchemaFactory.createForClass(AnalyticsSchema);

// 📞 Emergency Contact Schema
@Schema({ _id: true })
export class EmergencyContact {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  relation: string;

  @Prop({ required: true })
  phoneNumber: string;
}

export const EmergencyContactSchema = SchemaFactory.createForClass(EmergencyContact);

// 👤 User Schema
@Schema({ timestamps: true })
export class UserDocument {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop()
  dob: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: TokenSchemaModel, default: () => ({}) }) 
  token: TokenSchema;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true, unique: true })
  number: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ type: { value: { type: String, required: true }, createdAt: { type: Date, default: Date.now } } })
  otp: {
    value: string;
    createdAt: Date;
  };

  @Prop()
  address: string;

  @Prop({ type: LocationSchema })
  location: LocationDocument;

  @Prop({ type: [EmergencyContactSchema], default: [] })  
  emergencyContacts: EmergencyContact[];

  @Prop({ type: AnalyticsSchemaModel, default: () => ({}) }) 
  analytics: AnalyticsSchema;

  @Prop({ default: 0 })
  profileCompletion: number;

  @Prop({ default: "" })
  profileImage: string;

  @Prop({ default: "" })
  notificationToken: string;

  @Prop({ type: [VehicleSchema], default: [] })  
  vehicles: Vehicle[];
}

export type User = HydratedDocument<UserDocument>;
export const UserSchema = SchemaFactory.createForClass(UserDocument);

UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

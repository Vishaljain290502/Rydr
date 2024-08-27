import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

// LocationDocument Schema
@Schema()
export class LocationDocument {
  @Prop({
    type: String,
    enum: ["Point"],
    required: true,
    default: "Point",
  })
  type: string;

  @Prop({
    type: [Number],
    required: true,
    default: [0, 0],
  })
  coordinates: [number, number];
}

export const LocationSchema = SchemaFactory.createForClass(LocationDocument);

// VehicleVerification Schema
@Schema()
export class VehicleVerification {
  @Prop({ required: true })
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

  @Prop()
  vehicleOwnerName: string;

  @Prop()
  drivingLicenseUrl: string;

  @Prop()
  vehicleType: string;
}

export const VehicleVerificationSchema = SchemaFactory.createForClass(VehicleVerification);

// VerificationId Schema
@Schema()
export class VerificationId {
  @Prop({ required: true })
  type: string;

  @Prop({
    type: {
      front: { type: String, default: "" },
      back: { type: String, default: "" },
      frontPublicId: { type: String, default: "" },
      backPublicId: { type: String, default: "" },
    },
  })
  id: {
    front: string;
    back: string;
    frontPublicId: string;
    backPublicId: string;
  };

  @Prop({ default: "" })
  photo: string;

  @Prop({ default: "" })
  photoPublicId: string;
}

export const VerificationIdSchema = SchemaFactory.createForClass(VerificationId);

// UserDocument Schema
@Schema()
export class UserDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  dob: Date;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  token: string;

  @Prop({ required: true })
  countryCode: string;

  @Prop({ required: true })
  number: string;

  

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;


  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  resetTokenExpiration: Date;

  @Prop({
    type: {
      value: { type: String, required: true },
      createdAt: { type: Date, required: true }
    }
  })
  otp: {
    value: string;
    createdAt: Date;
  };

  @Prop()
  address: string;

  @Prop({ type: LocationSchema })
  location: LocationDocument;

  @Prop({ type: VerificationIdSchema })
  verificationId: VerificationId;

  @Prop({ type: VehicleVerificationSchema })
  vehicleVerification?: VehicleVerification;
}

export type User = HydratedDocument<UserDocument>;

export const userSchema = SchemaFactory.createForClass(UserDocument);


import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

@Schema()
class LocationDocument {
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

const locationSchema = SchemaFactory.createForClass(LocationDocument);
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
  vehicleOwnerName:string;

  @Prop()
  drivingLicenseUrl:string;

  @Prop()
  vehicleType:string;
}



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

const VerificationIdSchema = SchemaFactory.createForClass(VerificationId);


@Schema()
export class UserDocument {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  dob: Date;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  token: string;

  @Prop()
  mobileNumber: string;

  @Prop({ default: false })
  isPhoneVerified: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop()
  resetTokenExpiration: Date;

  @Prop()
  otp: string;

  @Prop()
  address: string;

  @Prop({ type: locationSchema })
  location: LocationDocument;

  @Prop({ type: VerificationIdSchema })  
  verificationId: VerificationId;

  @Prop({ type: VehicleVerification })
  vehicleVerification?: VehicleVerification;
}


export type User = HydratedDocument<UserDocument>;

export const userSchema = SchemaFactory.createForClass(UserDocument);

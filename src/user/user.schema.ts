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

  @Prop({
    type: {
      type: String, // should be a string
      id: {
        front: { type: String, default: "" },
        back: { type: String, default: "" },
        frontPublicId: { type: String, default: "" },
        backPublicId: { type: String, default: "" },
      },
      photo: { type: String, default: "" },
      photoPublicId: { type: String, default: "" },
    },
    _id: false,
  })
  verificationId: {
    type: string;
    id: {
      front: string;
      back: string;
      frontPublicId: string;
      backPublicId: string;
    };
    photo: string;
    photoPublicId: string;
  };
}

export type User = HydratedDocument<UserDocument>;

export const userSchema = SchemaFactory.createForClass(UserDocument);

import { Schema, Document } from 'mongoose';

export const TripSchema = new Schema({
  host: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  vehicleType: { type: String, required: true },
  seatsAvailable: { type: Number, required: true },
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

export interface Trip extends Document {
  userId: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  vehicleType: string;
  seatsAvailable: number;
  participants: string[];
}

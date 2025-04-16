import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Brand } from './brand.schema';

@Schema({ timestamps: true })
export class Model {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brand: Types.ObjectId;
}

export type ModelDocument = Model & Document;
export const ModelSchema = SchemaFactory.createForClass(Model);

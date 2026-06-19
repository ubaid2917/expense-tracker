import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string; 

  @Prop({ required: true, enum: ['Income', 'Fixed Expenses', 'Variable Expenses', 'Savings', 'Debts'] })
  type: string; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
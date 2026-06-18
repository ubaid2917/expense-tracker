import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true, trim: true })
  name: string; 

  @Prop({ required: true, enum: ['Income', 'Fixed Expenses', 'Variable Expenses', 'Savings', 'Debts'] })
  type: string; 
}

export const CategorySchema = SchemaFactory.createForClass(Category);
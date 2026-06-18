import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Budget extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ required: true })
  month: number; // 1 to 12

  @Prop({ required: true })
  year: number; // e.g., 2026

  @Prop({ required: true, default: 0 })
  plannedAmount: number;
}

export const BudgetSchema = SchemaFactory.createForClass(Budget);
// Create a unique index
BudgetSchema.index({ category: 1, month: 1, year: 1 }, { unique: true });
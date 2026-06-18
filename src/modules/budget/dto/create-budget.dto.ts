import { IsNotEmpty, IsNumber, IsMongoId, Min, Max } from 'class-validator';

export class CreateBudgetDto {
  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid category ID format' })
  category: string; // Jis category ka budget plan ho raha hai

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(12)
  month: number; // 1 to 12

  @IsNotEmpty()
  @IsNumber()
  @Min(2000)
  year: number; // e.g., 2026

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Planned amount cannot be negative' })
  plannedAmount: number; // Allocated budget amount
}
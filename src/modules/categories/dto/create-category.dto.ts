import { IsNotEmpty, IsIn, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['Income', 'Fixed Expenses', 'Variable Expenses', 'Savings', 'Debts'])
  type: string;
}
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsMongoId, IsDateString, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsString()
  detail: string; 

  @IsNotEmpty()
  @IsNumber()
  amount: number; 
  @IsNotEmpty()
  @IsEnum(['income', 'expense'], { message: 'Type must be either income or expense' })
  type: string;

  @IsNotEmpty()
  @IsMongoId({ message: 'Invalid category ID format' })
  category: string; 

  @IsOptional()
  @IsDateString()
  date?: string; 
}
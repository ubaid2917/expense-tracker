import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import {GetBudgetReportDto} from './dto/get-budget.dto'

@Controller('budget')
export class BudgetController {
  constructor(private readonly budgetService: BudgetService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.setBudget(createBudgetDto);
  }

  @Get()
  findAll(@Query() getBudgetDto: GetBudgetReportDto) {
    return this.budgetService.getReport(getBudgetDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.budgetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBudgetDto: UpdateBudgetDto) {
    return this.budgetService.update(+id, updateBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.budgetService.remove(+id);
  }
}

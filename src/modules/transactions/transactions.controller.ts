import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  @Get()
  findAll(@Query() filterDto: GetTransactionsFilterDto) {
    return this.transactionsService.findAll(filterDto);
  }
}
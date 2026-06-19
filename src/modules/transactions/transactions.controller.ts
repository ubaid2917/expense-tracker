import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { GetUser } from '../../common/decorators/get-user.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post() 
 async create(
    @Body() createTransactionDto: CreateTransactionDto,
    @GetUser() user,
  ) {
    const data = await this.transactionsService.create({ ...createTransactionDto, user: user.id });
    return { success: true, message: 'Transaction created successfully', data };
  }

  @Get()
  findAll(@Query() filterDto: GetTransactionsFilterDto, @GetUser() user) {
    return this.transactionsService.findAll(filterDto, user.id);
  }
}

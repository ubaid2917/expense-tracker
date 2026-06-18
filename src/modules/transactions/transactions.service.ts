import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './schemas/transaction.schema';
import { GetTransactionsFilterDto } from './dto/get-transactions-filter.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto'; // Standard create properties

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>,
  ) { }

  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = new this.transactionModel(createTransactionDto);
    return newTransaction.save();
  }

  async findAll(filterDto: GetTransactionsFilterDto) {
    const { page, limit, month, year } = filterDto;
    const skip = (page - 1) * limit;

    // Dynamic query building
    const query: any = {};

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      query.date = { $gte: startDate, $lt: endDate };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year + 1, 0, 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const [data, totalItems] = await Promise.all([
      this.transactionModel
        .find(query)
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name type')
        .exec(),
      this.transactionModel.countDocuments(query).exec(),
    ]);

    return {
      totalAmount: data.reduce((total, transaction) => total + transaction.amount, 0),
      data,
      total: totalItems,
    };
  }
}
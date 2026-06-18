import { Injectable } from '@nestjs/common';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Budget } from './schema/budget.schema';
import { Model, Types } from 'mongoose';
import {GetBudgetReportDto} from './dto/get-budget.dto'

@Injectable()
export class BudgetService { 

  constructor(
    @InjectModel(Budget.name) private budgetModel: Model<Budget>,
  ){}
  setBudget(createBudgetDto: CreateBudgetDto) {
    const { category, month, year, plannedAmount } = createBudgetDto;
     
    return this.budgetModel.findOneAndUpdate(
      { category, month, year },
      { plannedAmount },
      { upsert: true, new: true },
    );
  }

async getReport(reportDto: GetBudgetReportDto) {
    const month = Number(reportDto.month);
    const year = Number(reportDto.year);

    // Strict Date objects formulation for MongoDB matching bounds
    const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    return this.budgetModel.aggregate([
      // 1. Force match using explicit numbers parsing
      { 
        $match: { 
          month: month, 
          year: year 
        } 
      },

      // 1.5 Convert raw string reference to strong ObjectId for pipeline evaluation 
      {
        $addFields: {
          category: { $toObjectId: '$category' }
        }
      },

      // 2. Lookup Category details for UI name representation
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo',
        },
      },
      { $unwind: '$categoryInfo' },

      // 3. Lookup matching transactions for actual spent calculation
      {
        $lookup: {
          from: 'transactions',
          let: { catId: '$category' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    // Dynamic parsing inside expression logic to bypass type variations
                    { $eq: [{ $toObjectId: '$category' }, '$$catId'] }, 
                    { $gte: ['$date', startDate] },
                    { $lt: ['$date', endDate] },
                    { $eq: ['$type', 'expense'] }, 
                  ],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalSpent: { $sum: '$amount' },
              },
            },
          ],
          as: 'spentData',
        },
      },

      // 4. Project clean structure for React frontend
      {
        $project: {
          _id: 1,
          month: 1,
          year: 1,
          categoryId: '$category',
          categoryName: '$categoryInfo.name',
          categoryType: '$categoryInfo.type',
          plannedAmount: 1,
          actualSpent: {
            $ifNull: [{ $arrayElemAt: ['$spentData.totalSpent', 0] }, 0],
          },
        },
      },
    ]);
  }


  findOne(id: number) {
    return `This action returns a #${id} budget`;
  }

  update(id: number, updateBudgetDto: UpdateBudgetDto) {
    return `This action updates a #${id} budget`;
  }

  remove(id: number) {
    return `This action removes a #${id} budget`;
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model, Types } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';

@Injectable()
export class CategoriesService {

  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

  async create(createCategoryDto: CreateCategoryDto, user: string) {
    console.log("user", user);

    const isExistingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name, user: new Types.ObjectId(user) });
    if (isExistingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    newCategory.user = new Types.ObjectId(user);
    return newCategory.save();
  }

  async findAll(paginationDto: PaginationDto, user): Promise<any> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit; 

    const filter = { user: new Types.ObjectId(user) };

    const [data, total] = await Promise.all([
      this.categoryModel.find(filter).skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments(filter).exec(),
    ]);
    return { data, total };
  }

  findOne(id: string, user: string) {
    return this.categoryModel.findOne({
      _id: id,
      user: new Types.ObjectId(user),
    });
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
  }

  async remove(id: string) {
    const deleted = await this.categoryModel.findByIdAndDelete(id);
    return deleted;
  }
}

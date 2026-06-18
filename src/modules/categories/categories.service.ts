import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto'; 
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schema/category.schema';
import { Model } from 'mongoose';
import { PaginatedRes } from 'src/common/interfaces/paginated-res.interface';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';

@Injectable()
export class CategoriesService {
  
  constructor(@InjectModel(Category.name) private categoryModel: Model<Category>){}
   
  async create(createCategoryDto: CreateCategoryDto) {

    const isExistingCategory = await this.categoryModel.findOne({ name: createCategoryDto.name });
    if (isExistingCategory) {
      throw new BadRequestException('Category with this name already exists');
    }

    const newCategory = new this.categoryModel(createCategoryDto);
    return newCategory.save();
  }

  async findAll(paginationDto: PaginationDto): Promise<any> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.categoryModel.find().skip(skip).limit(limit).exec(),
      this.categoryModel.countDocuments().exec(),
    ]);
     return { data, total };
  }

  findOne(id: string) {
    return this.categoryModel.findById(id);
  }

  update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true });
  }

 async remove(id: string) {
  const deleted = await this.categoryModel.findByIdAndDelete(id);
  return deleted;
}
}

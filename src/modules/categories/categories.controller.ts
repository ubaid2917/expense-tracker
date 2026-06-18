import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationDto } from 'src/common/dto/pagination/pagination.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<{ message: string, success: boolean }> {
    const data = await this.categoriesService.create(createCategoryDto);
    return {
      success: true,
      message: 'Category created successfully',
    }
  }

  @Get()
   findAll(@Query() paginationDto: PaginationDto) {
    return  this.categoriesService.findAll(paginationDto);
  }

  @Get(':id')
 async findOne(@Param('id') id: string) {
   const data = await  this.categoriesService.findOne(id);
    return {
      success: true,
      message: 'Category fetched successfully',
      data,
    }
  }
  
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    const data = await  this.categoriesService.update(id, updateCategoryDto);
     return {
      success: true,
      message: 'Category updated successfully',
    }
  }
  
  @Delete(':id')
 async remove(@Param('id') id: string) {
  const deleted = await this.categoriesService.remove(id);
  if (!deleted) {
    return {
      success: false,
      message: 'Category not found with this id',
    };
  }
  return {
    success: true,
    message: 'Category deleted successfully',
  };
}
}

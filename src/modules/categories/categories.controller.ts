import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './services/categories.service';
import { ActtiveUserId } from 'src/shared/decorators/ActiveUserId';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(@ActtiveUserId() userId: string) {
    return this.categoriesService.findAllByUserId(userId);
  }
}

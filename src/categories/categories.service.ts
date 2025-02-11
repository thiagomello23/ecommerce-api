import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Categories } from "./categories.entity";
import { DatabaseRepositoryConstants } from "src/constants";
import { CreateCategoryDto } from "./dto/create-category.dto";

@Injectable()
export class CategoriesService {

    constructor(
        @Inject(DatabaseRepositoryConstants.categoriesRepository)
        private readonly categoriesRepository: Repository<Categories>
    ){}

    async createCategory(createCategoryDto: CreateCategoryDto) {
        const existingCategory = await this.categoriesRepository
            .createQueryBuilder("categories")
            .where("categories.name = :categoryName", {categoryName: createCategoryDto.name})
            .getOne()

        if(existingCategory) {
            throw new BadRequestException("This category already exists!")
        }

        const category = new Categories()
        category.name = createCategoryDto.name

        return this.categoriesRepository.save(category)
    }

    async getAllCategories() {
        return this.categoriesRepository
            .createQueryBuilder("categories")
            .getMany()
    }

    async deleteCategory(
        categoryId: string
    ) {
        try {
            return this.categoriesRepository
                .createQueryBuilder("categories")
                .softDelete()
                .where("id = :categoryId", {categoryId})
                .execute()
        } catch(err) {
            throw new BadRequestException("Failed to delete a category, invalid category ID!")
        }
    }
}
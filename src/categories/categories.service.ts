import { Inject, Injectable } from "@nestjs/common";
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
        console.log(createCategoryDto)
    }
}
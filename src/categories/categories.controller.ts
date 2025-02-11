import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl-action";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Public } from "src/auth/decorators/is-public.decorator";
import { Categories } from "./categories.entity";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService
    ){}

    @Post()
    @ApiBearerAuth()
    @ApiBody({type: CreateCategoryDto})
    @ApiResponse({status: 200, type: Categories})
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Category"))
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categoriesService.createCategory(createCategoryDto)
    }

    @Get("all")
    @Public()
    async getAllCategories() {
        return this.categoriesService.getAllCategories()
    }
}
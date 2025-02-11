import { Body, Controller, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl-action";
import { CreateCategoryDto } from "./dto/create-category.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {

    constructor(
        private readonly categoriesService: CategoriesService
    ){}

    @Post()
    @ApiBearerAuth()
    @ApiBody({type: CreateCategoryDto})
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Category"))
    async createCategory(
        @Body() createCategoryDto: CreateCategoryDto
    ) {
        return this.categoriesService.createCategory(createCategoryDto)
    }

}
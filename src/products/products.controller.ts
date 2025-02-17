import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl-action";
import { CreateProductDto } from "./dto/create-product.dto";
import { Users } from "src/users/users.entity";

@ApiTags("products")
@Controller("products")
export class ProductsController {
    
    constructor(
        private readonly productsService: ProductsService
    ){}

    @Post("create")
    @ApiBearerAuth()
    @ApiBody({type: CreateProductDto})
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Products"))
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsService.createProduct(createProductDto, user)
    }

    @Patch()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "Products"))
    async validateProduct(
        @Param("productId") productId: string,
        @Req() request
    ) {
        const user: Users = request.user
        console.log(productId)
        console.log(user)
    }
}
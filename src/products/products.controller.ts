import { Body, Controller, Post, Req } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { AppAbility } from "src/casl/casl-ability.factory";
import { Action } from "src/casl/enums/casl-action";
import { CreateProductDto } from "./dto/create-product.dto";
import { Users } from "src/users/users.entity";
import { Public } from "src/auth/decorators/is-public.decorator";

@ApiTags("products")
@Controller("products")
export class ProductsController {
    
    constructor(
        private readonly productsService: ProductsService
    ){}

    @Post("create")
    @ApiBearerAuth()
    @ApiBody({type: CreateProductDto})
    @Public()
    //@CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Products"))
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsService.createProduct(createProductDto, user)
    }
}
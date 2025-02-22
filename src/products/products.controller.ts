import { Body, Controller, Param, Patch, Post, Req } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { Action } from "src/casl/enums/casl-action";
import { CreateProductDto } from "./dto/create-product.dto";
import { Users } from "src/users/users.entity";
import { Products } from "./products.entity";

@ApiTags("products")
@Controller("products")
export class ProductsController {
    
    constructor(
        private readonly productsService: ProductsService
    ){}

    @Post("create")
    @ApiBearerAuth()
    @ApiBody({type: CreateProductDto})
    @CheckPolicies({
        action: Action.Create,
        subject: "Products",
    })
    async createProduct(
        @Body() createProductDto: CreateProductDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsService.createProduct(createProductDto, user)
    }

    // Just admins could validate a new product in the platform
    @Patch("validate/:productId")
    @CheckPolicies({
        action: Action.Manage,
        subject: "all"
    })
    async validateProduct(
        @Param("productId") productId: string,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsService.validateProduct(productId)
    }
}
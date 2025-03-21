import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProductsVariantsService } from "./products-variants.service";
import { CreateProductVariantDto } from "./dto/create-product-variant.dto";
import { Public } from "src/auth/decorators/is-public.decorator";
import { Users } from "src/users/users.entity";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { Action } from "src/casl/enums/casl-action";
import { ProductsVariants } from "./products-variants.entity";

@ApiTags("products-variants")
@Controller("products-variants")
export class ProductsVariantsController {

    constructor(
        private readonly productsVariantsService: ProductsVariantsService
    ){}

    @Post("create")
    @CheckPolicies({
        action: Action.Create,
        subject: "ProductsVariants"
    })
    async createProductsVariantsForExistingProduct(
        @Body() createProductVariantDto: CreateProductVariantDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsVariantsService.createProductsVariantsForExistingProduct(createProductVariantDto, user)
    }

    @Get("variants/:productId")
    @CheckPolicies({
        action: Action.Read,
        subject: "ProductsVariants"
    })
    // This return more informations about the product, and return inactive products
    async getAllVariantsWithinAProduct(
        @Param("productId") productId: string,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsVariantsService.getAllVariantsWithinAProduct(productId, user)
    }

    @Patch("update/:productVariantId")
    async updateVariant() {

    }

    @Delete("delete/:productVariantId")
    async deleteVariant() {

    }
}
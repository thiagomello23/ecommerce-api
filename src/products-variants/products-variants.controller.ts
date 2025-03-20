import { Body, Controller, Delete, Get, Patch, Post, Req } from "@nestjs/common";
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
        subject: "ProductsVariants",
        getSubject: (context, dataSource) => {
            const requestBody = context.switchToHttp().getRequest().body

            return dataSource.manager
                .getRepository(ProductsVariants)
                .createQueryBuilder("productsVariants")
                .where("products.id = :productId", {productId: requestBody.productId})
                .getOne()
        },
    })
    async createProductsVariantsForExistingProduct(
        @Body() createProductVariantDto: CreateProductVariantDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.productsVariantsService.createProductsVariantsForExistingProduct(createProductVariantDto, user)
    }

    @Get("variants/:productId")
    async getAllVariantsWithinAProduct() {

    }

    @Patch("update/:productVariantId")
    async updateVariant() {

    }

    @Delete("delete/:productVariantId")
    async deleteVariant() {

    }
}
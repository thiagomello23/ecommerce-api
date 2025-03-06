import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { ProductsService } from "./products.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { Action } from "src/casl/enums/casl-action";
import { CreateProductDto } from "./dto/create-product.dto";
import { Users } from "src/users/users.entity";
import { Products } from "./products.entity";
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
    @CheckPolicies({
        action: Action.Create,
        subject: "Products",
        getSubject: (context, dataSource) => {
            // The way that policiesguard works is using the subject name equals to subject type
            // But in this specific case the subject type needs vendor data, so i return a product
            // with vendor data instead of returning the vendor.
            const vendorDataProd = new Products();

            const request = context.switchToHttp().getRequest()
            const user: Users = request.user

            vendorDataProd.vendor = user.vendors

            return vendorDataProd
        }
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

    @Delete("delete/:productId")
    @CheckPolicies({
        action: Action.Delete,
        subject: "Products",
        getSubject: (context, dataSource) => {
            const request = context.switchToHttp().getRequest()
            const productId = request.params.productId;
            return dataSource
                .getRepository(Products)
                .createQueryBuilder("products")
                .where("products.id = :productsId", {productsId: productId})
                .getOne()
        }
    })
    async disableProduct(
        @Param("productId") productId: string,
        @Req() request
    ) {
        const user: Users = request.user;
        return this.productsService.disableProduct(productId, user)
    }

    // Development Only
    @Get("/all/dev")
    @Public()
    async getAllProductsOfAllVendors() {
        if(process.env.ENVIRONMENT.toString() !== "dev") {
            return;
        }

        return this.productsService.getAllProductsOfAllVendors()
    }

}
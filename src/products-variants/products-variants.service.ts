import { Body, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DatabaseRepositoryConstants } from "src/constants";
import { Repository } from "typeorm";
import { ProductsVariants } from "./products-variants.entity";
import { CreateProductVariantDto } from "./dto/create-product-variant.dto";
import { Users } from "src/users/users.entity";
import { Products } from "src/products/products.entity";
import { plainToInstance } from "class-transformer";

@Injectable()
export class ProductsVariantsService {

    constructor(
        @Inject(DatabaseRepositoryConstants.productsVariantsRepository)
        private readonly productsVariantsRepository: Repository<ProductsVariants>,
        @Inject(DatabaseRepositoryConstants.productsRepository)
        private readonly productsRepository: Repository<Products>,
    ){}

    async createProductsVariantsForExistingProduct(
        createProductVariantDto: CreateProductVariantDto,
        user: Users
    ) {
        const product = await this.productsRepository
            .createQueryBuilder("products")
            .where("products.id = :productId", {productId: createProductVariantDto.productId})
            .andWhere("products.vendorId = :vendorId", {vendorId: user.vendors.id})
            .getOne()

        if(!product) {
            throw new NotFoundException("Product not found!")
        }

        // if(numberOfProducts > +process.env.MAX_NUMBER_PRODUCTS_VARIANTS) {
        //     throw new UnauthorizedException(`You reach the maximum number of variants in the same product. (max: ${process.env.MAX_NUMBER_PRODUCTS_VARIANTS})`)
        // }

        const newVariant = plainToInstance(ProductsVariants, createProductVariantDto, {excludeExtraneousValues: true})
        newVariant.product = product

        return this.productsVariantsRepository.save(newVariant)
    }
}
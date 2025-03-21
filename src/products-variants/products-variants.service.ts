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
            .innerJoinAndSelect("products.productsVariants", "productsVariants", "productsVariants.productId = products.id")
            .where("products.id = :productId", {productId: createProductVariantDto.productId})
            .andWhere("products.vendorId = :vendorId", {vendorId: user.vendors.id})
            .getOne()

        if(!product) {
            throw new NotFoundException("Product not found!")
        }

        if(product.productsVariants.length > +process.env.MAX_NUMBER_PRODUCTS_VARIANTS) {
            throw new UnauthorizedException(`You reach the maximum number of product variants to the same product. (max: ${process.env.MAX_NUMBER_PRODUCTS_VARIANTS})`)
        }

        const newVariant = plainToInstance(ProductsVariants, createProductVariantDto, {excludeExtraneousValues: true})
        newVariant.product = product

        return this.productsVariantsRepository.save(newVariant)
    }

    async getAllVariantsWithinAProduct(
        productId: string,
        user: Users
    ) {
        const productVariants = await this.productsVariantsRepository
            .createQueryBuilder("productsVariants")
            .innerJoin("productsVariants.product", "products")
            .where("products.id = :productId", {productId})
            .andWhere("products.vendorId = :vendorId", {vendorId: user.vendors.id})
            .getMany()

        return productVariants
    }

    async deleteVariant(
        productVariantId: string,
        user: Users
    ) {
        const productVariant= await this.productsVariantsRepository
            .createQueryBuilder("productsVariants")
            .innerJoin("productsVariants.product", "products")
            .where("productsVariants.id = :productVariantId", {productVariantId})
            .andWhere("products.vendorId = :vendorId", {vendorId: user.vendors.id})
            .getOne()

        if(!productVariant) {
            throw new NotFoundException("Product variant not found!")
        }

        return this.productsVariantsRepository.softDelete(productVariant.id)
    }
}
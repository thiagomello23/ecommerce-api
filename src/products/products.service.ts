import { BadRequestException, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { DatabaseRepositoryConstants } from "src/constants";
import { DataSource, Repository } from "typeorm";
import { Products } from "./products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Users } from "src/users/users.entity";
import { plainToInstance } from "class-transformer";
import { Vendors } from "src/vendor/vendors.entity";
import { Categories } from "src/categories/categories.entity";
import { ProductsVariants } from "src/products-variants/products-variants.entity";

@Injectable()
export class ProductsService {

    constructor(
        @Inject(DatabaseRepositoryConstants.productsRepository)
        private readonly productsRepository: Repository<Products>,
        @Inject(DatabaseRepositoryConstants.vendorsRepository)
        private readonly vendorsRepository: Repository<Vendors>,
        @Inject(DatabaseRepositoryConstants.categoriesRepository)
        private readonly categoriesRepository: Repository<Categories>,
        @Inject(DatabaseRepositoryConstants.productsVariantsRepository)
        private readonly productsVariantsRepository: Repository<ProductsVariants>,
        @Inject(DatabaseRepositoryConstants.dataSource)
        private readonly dataSource: DataSource,
    ){}

    async createProduct(
        createProductDto: CreateProductDto,
        user: Users
    ) {
        const vendor = await this.vendorsRepository
            .createQueryBuilder("vendors")
            .where("vendors.user.id = :userId", {userId: user.id})
            .getOne()

        if(!vendor) {
            throw new UnauthorizedException("Only vendors could create products!")
        }

        if(createProductDto.categoriesId.length > +process.env.MAX_NUMBER_CATEGORIES) {
            throw new BadRequestException("Products couldn't have more than 5 categories!")
        }

        let categories: Categories[]

        try {
            categories = await this.categoriesRepository
                .createQueryBuilder("categories")
                .where("categories.id IN (:...ids)", {ids: createProductDto.categoriesId})
                .getMany()
        } catch(err) {
            throw new BadRequestException("Invalid categories!")
        }
        
        const products = plainToInstance(Products, createProductDto, {excludeExtraneousValues: true})
        const productsVariants = plainToInstance(ProductsVariants, createProductDto, {excludeExtraneousValues: true})

        productsVariants.variantName = products.productName

        // For the product creation the first variant is going to be a defaultVariant
        productsVariants.defaultVariant = true

        products.vendor = vendor
        products.categories = categories

        const queryRunner = this.dataSource.createQueryRunner()
        let productVariantReturn: ProductsVariants;

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            await queryRunner.manager.save(Products, products)
            productsVariants.product = products
            productVariantReturn = await queryRunner.manager.save(ProductsVariants, productsVariants)

            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release()
        }

        return productVariantReturn
    }

    async validateProduct(
        productId: string
    ) {
        const existingProduct = await this.productsRepository
            .createQueryBuilder("products")
            .where("products.id = :productId", {productId})
            .getOne()
        
        if(!existingProduct) {
            throw new BadRequestException("Product does not exist!")
        }

        if(existingProduct.isValid) {
            throw new BadRequestException("Product has been validated!")
        }

        existingProduct.isValid = true

        return this.productsRepository.save(existingProduct)
    }

    async disableProduct(
        productId: string,
        user: Users
    ) {
        const existingProduct = await this.productsRepository
            .createQueryBuilder("products")
            .innerJoin(Vendors, "vendor")
            .where("products.id = :productsId", {productsId: productId})
            .andWhere("vendor.id = :vendorId", {vendorId: user.vendors.id})
            .getOne()

        if(!existingProduct) {
            throw new BadRequestException("Product does not exist;")
        }

        return this.productsRepository
            .createQueryBuilder("products")
            .softDelete()
            .where("products.id = :productsId", {productsId: existingProduct.id})
            .execute()
    }

    async getAllProductsOfAllVendors() {
        return this.productsRepository
            .createQueryBuilder("products")
            .innerJoinAndSelect("products.vendor", "vendors")
            .getMany()
    }
}
import { Inject, Injectable } from "@nestjs/common";
import { DatabaseRepositoryConstants } from "src/constants";
import { Repository } from "typeorm";
import { Products } from "./products.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { Users } from "src/users/users.entity";
import { plainToInstance } from "class-transformer";
import { Vendors } from "src/vendor/vendors.entity";

@Injectable()
export class ProductsService {

    constructor(
        @Inject(DatabaseRepositoryConstants.productsRepository)
        private readonly productsRepository: Repository<Products>,
        @Inject(DatabaseRepositoryConstants.vendorsRepository)
        private readonly vendorsRepository: Repository<Vendors>,
    ){}

    async createProduct(
        createProductDto: CreateProductDto,
        user: Users
    ) {
        // Validate vendor user
        const vendor = await this.vendorsRepository
            .createQueryBuilder("vendors")
            .where("vendors.user.id = :userId", {userId: user.id})
            .getOne()

        console.log(vendor)

        // Validate categories (products could not have more than 5 categories)

        // class-transform
        // plainToInstance

        // Save a new product
    }
}
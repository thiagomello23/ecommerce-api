import { Inject, Injectable } from "@nestjs/common";
import { DatabaseRepositoryConstants } from "src/constants";
import { Repository } from "typeorm";
import { ProductsVariants } from "./products-variants.entity";

@Injectable()
export class ProductsVariantsService {

    constructor(
        @Inject(DatabaseRepositoryConstants.productsVariantsRepository)
        private readonly productsVariantsRepository: Repository<ProductsVariants>
    ){}

}
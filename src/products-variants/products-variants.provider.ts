import { DataSource } from "typeorm";
import { DatabaseRepositoryConstants } from "src/constants";
import { ProductsVariants } from "./products-variants.entity";

export const productsVariantsProviders = [{
    provide: DatabaseRepositoryConstants.productsVariantsRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductsVariants),
    inject: ['DATA_SOURCE'],
}]
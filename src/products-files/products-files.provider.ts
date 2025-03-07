
import { DataSource } from "typeorm";
import { DatabaseRepositoryConstants } from "src/constants";
import { ProductsFiles } from "./products-files.entity";

export const productsFilesProviders = [{
    provide: DatabaseRepositoryConstants.productsFilesRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductsFiles),
    inject: ['DATA_SOURCE'],
}]
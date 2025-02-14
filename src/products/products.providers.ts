import { DataSource } from "typeorm";
import { DatabaseRepositoryConstants } from "src/constants";
import { Products } from "./products.entity";

export const productsProviders = [{
    provide: DatabaseRepositoryConstants.productsRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Products),
    inject: ['DATA_SOURCE'],
}]
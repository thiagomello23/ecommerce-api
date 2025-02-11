import { DataSource } from "typeorm";
import { DatabaseRepositoryConstants } from "src/constants";
import { Categories } from "./categories.entity";

export const categoriesProviders = [{
    provide: DatabaseRepositoryConstants.categoriesRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Categories),
    inject: ['DATA_SOURCE'],
}]
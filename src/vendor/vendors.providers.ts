import { DataSource } from "typeorm";
import { DatabaseRepositoryConstants } from "src/constants";
import { Vendors } from "./vendors.entity";

export const vendorsProviders = [{
    provide: DatabaseRepositoryConstants.vendorsRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Vendors),
    inject: ['DATA_SOURCE'],
}]
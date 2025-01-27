import { DataSource } from "typeorm";
import { DatabaseRepositoryConstants } from "src/constants";
import { Address } from "./address.entity";

export const addressProviders = [{
    provide: DatabaseRepositoryConstants.addressRepository,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Address),
    inject: ['DATA_SOURCE'],
}]
import { Module } from "@nestjs/common";
import { productsVariantsProviders } from "./products-variants.provider";
import { ProductsVariantsService } from "./products-variants.service";
import { ProductsVariantsController } from "./products-variants.controller";

@Module({
    controllers: [ProductsVariantsController],
    providers: [ProductsVariantsService, ...productsVariantsProviders],
    exports: [ProductsVariantsService, ...productsVariantsProviders]
})
export class ProductsVariantsModule {}
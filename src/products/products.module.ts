import { Module } from "@nestjs/common";
import { productsProviders } from "./products.providers";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { VendorsModule } from "src/vendor/vendors.module";
import { CategoriesModule } from "src/categories/categories.module";

@Module({
    imports: [VendorsModule, CategoriesModule],
    controllers: [ProductsController],
    providers: [ProductsService, ...productsProviders],
    exports: [ProductsService, ...productsProviders]
})
export class ProductsModule {}
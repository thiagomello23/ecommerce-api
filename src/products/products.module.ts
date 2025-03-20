import { forwardRef, Module } from "@nestjs/common";
import { productsProviders } from "./products.providers";
import { ProductsController } from "./products.controller";
import { ProductsService } from "./products.service";
import { VendorsModule } from "src/vendor/vendors.module";
import { CategoriesModule } from "src/categories/categories.module";
import { ProductsVariantsModule } from "src/products-variants/products-variants.module";

@Module({
    imports: [VendorsModule, CategoriesModule, forwardRef(() => ProductsVariantsModule)],
    controllers: [ProductsController],
    providers: [ProductsService, ...productsProviders],
    exports: [ProductsService, ...productsProviders]
})
export class ProductsModule {}
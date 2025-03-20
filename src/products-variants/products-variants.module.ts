import { forwardRef, Module } from "@nestjs/common";
import { productsVariantsProviders } from "./products-variants.provider";
import { ProductsVariantsService } from "./products-variants.service";
import { ProductsVariantsController } from "./products-variants.controller";
import { ProductsModule } from "src/products/products.module";

@Module({
    imports: [forwardRef(() => ProductsModule)],
    controllers: [ProductsVariantsController],
    providers: [ProductsVariantsService, ...productsVariantsProviders],
    exports: [ProductsVariantsService, ...productsVariantsProviders]
})
export class ProductsVariantsModule {}
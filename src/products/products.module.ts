import { Module } from "@nestjs/common";
import { productsProviders } from "./products.providers";

@Module({
    providers: [...productsProviders],
    exports: [...productsProviders]
})
export class ProductsModule {}
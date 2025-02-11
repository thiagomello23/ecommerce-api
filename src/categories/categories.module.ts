import { Module } from "@nestjs/common";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { categoriesProviders } from "./categories.providers";

@Module({
    imports: [],
    controllers: [CategoriesController],
    providers: [CategoriesService, ...categoriesProviders],
    exports: [CategoriesService, ...categoriesProviders]
})
export class CategoriesModule {}
import { Controller } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ProductsVariantsService } from "./products-variants.service";

@ApiTags("products-variants")
@Controller("products-variants")
export class ProductsVariantsController {

    constructor(
        private readonly productsVariantsService: ProductsVariantsService
    ){}

}
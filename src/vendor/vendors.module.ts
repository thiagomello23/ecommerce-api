import { Module } from "@nestjs/common";
import { vendorsProviders } from "./vendors.providers";
import { VendorsService } from "./vendors.service";

@Module({
    providers: [...vendorsProviders, VendorsService],
    exports: [...vendorsProviders, VendorsService]
})
export class VendorsModule{}
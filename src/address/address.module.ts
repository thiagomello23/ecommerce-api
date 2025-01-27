import { Module } from "@nestjs/common";
import { addressProviders } from "./address.providers";
import { AddressService } from "./address.service";

@Module({
    providers: [...addressProviders, AddressService],
    exports: [...addressProviders, AddressService]
})
export class AddressModule {}
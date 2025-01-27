import { Module } from "@nestjs/common";
import { addressProviders } from "./address.providers";
import { AddressService } from "./address.service";
import { UsersModule } from "src/users/users.module";

@Module({
    imports: [UsersModule],
    providers: [...addressProviders, AddressService],
    exports: [...addressProviders, AddressService]
})
export class AddressModule {}
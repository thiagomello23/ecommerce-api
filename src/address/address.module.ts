import { forwardRef, Module } from "@nestjs/common";
import { addressProviders } from "./address.providers";
import { AddressService } from "./address.service";
import { UsersModule } from "src/users/users.module";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [
        forwardRef(() => UsersModule), 
        HttpModule
    ],
    providers: [...addressProviders, AddressService],
    exports: [...addressProviders, AddressService]
})
export class AddressModule {}
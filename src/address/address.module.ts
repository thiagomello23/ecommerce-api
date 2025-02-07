import { forwardRef, Module } from "@nestjs/common";
import { addressProviders } from "./address.providers";
import { AddressService } from "./address.service";
import { UsersModule } from "src/users/users.module";
import { HttpModule } from "@nestjs/axios";
import { AddressController } from "./address.controller";

@Module({
    imports: [
        forwardRef(() => UsersModule), 
        HttpModule
    ],
    controllers: [AddressController],
    providers: [...addressProviders, AddressService],
    exports: [...addressProviders, AddressService]
})
export class AddressModule {}
import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import { AddressService } from "./address.service";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CreateAddressDto } from "./dto/create-address.dto";
import { Action } from "src/casl/enums/casl-action";
import { Users } from "src/users/users.entity";
import { Address } from "./address.entity";
import { Public } from "src/auth/decorators/is-public.decorator";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";

@ApiTags("address")
@Controller("address")
export class AddressController {

    constructor(
        private readonly addressService: AddressService
    ){}

    @Post()
    @ApiBearerAuth()
    @ApiBody({type: CreateAddressDto})
    @ApiResponse({status: 401, description: "Max address limit register, please remove some address to create new ones!"})
    @ApiResponse({status: 200, type: Address})
    @CheckPolicies({
        action: Action.Create,
        subject: "Address"
    })
    async createNewAddress(
        @Body() createAddressDto: CreateAddressDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.createNewAddress(createAddressDto, user)
    }

    @Get()
    @ApiBearerAuth()
    @CheckPolicies({
        action: Action.Read,
        subject: "Address"
    })
    async getAllUserAddress(
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.getAllUserAddress(user)
    }

    @Patch("/default/:addressId")
    @ApiBearerAuth()
    @CheckPolicies({
        action: Action.Update,
        subject: "Address"
    })
    async makeDefaultAddress(
        @Param("addressId") addressId: string,
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.makeDefaultAddress(addressId, user)
    }

    @Delete("/delete/:addressId")
    @ApiBearerAuth()
    @CheckPolicies({
        action: Action.Delete,
        subject: "Address"
    })
    async deleteAddress(
        @Param("addressId") addressId: string,
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.deleteAddress(addressId, user)
    }
}
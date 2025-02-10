import { Body, Controller, Delete, Param, Patch, Post, Req } from "@nestjs/common";
import { AddressService } from "./address.service";
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { CreateAddressDto } from "./dto/create-address.dto";
import { AppAbility } from "src/casl/casl-ability.factory";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { Action } from "src/casl/enums/casl-action";
import { Users } from "src/users/users.entity";
import { Address } from "./address.entity";
import { Public } from "src/auth/decorators/is-public.decorator";

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
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Create, "Address"))
    async createNewAddress(
        @Body() createAddressDto: CreateAddressDto,
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.createNewAddress(createAddressDto, user)
    }

    @Patch("/default/:addressId")
    @ApiBearerAuth()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "Address"))
    async makeDefaultAddress(
        @Param("addressId") addressId: string,
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.makeDefaultAddress(addressId, user)
    }

    @Delete("/delete/:addressId")
    @ApiBearerAuth()
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "Address"))
    async deleteAddress(
        @Param("addressId") addressId: string,
        @Req() request
    ) {
        const user: Users = request.user
        return this.addressService.deleteAddress(addressId, user)
    }
}
import { BadRequestException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { DatabaseRepositoryConstants, googleUrlKeys } from "src/constants";
import { Repository } from "typeorm";
import { Address } from "./address.entity";
import { Users } from "src/users/users.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, map } from "rxjs";
import axios from "axios";

@Injectable()
export class AddressService {

    constructor(
        @Inject(DatabaseRepositoryConstants.addressRepository)
        private readonly addressRepository: Repository<Address>,
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private readonly usersRepository: Repository<Users>,
        private readonly httpService: HttpService
    ){}

    async mapAddressWithoutUser(createAddressDto: CreateAddressDto) {
        const address = new Address()

        address.city = createAddressDto.city;
        address.country = createAddressDto.country;
        address.district = createAddressDto.district;
        address.houseNumber = createAddressDto.houseNumber;
        address.locationReference = createAddressDto.locationReference;
        address.postalCode = createAddressDto.postalCode;
        address.state = createAddressDto.state;
        address.street = createAddressDto.street;

        return address
    }

    async validateAddress(add: Address): Promise<boolean> {
        const addressLines = `
            ${add.houseNumber} ${add.street}, 
            ${add?.district} ${add.city}, 
            ${add.state}, ${add.postalCode}, 
            ${add.country}
        `;

        const result = await firstValueFrom(this.httpService.post(
                `${googleUrlKeys.addressValidationAPI}?key=${process.env.GCP_GEOLOCATION_API_KEY}`,
                {
                    "address": {
                        "postalCode": add.postalCode,
                        "addressLines": [addressLines]
                    }
                }
            ))

        const data = await result.data
        const verdict = await data.result.verdict;
        const address = await data.result.address;

        // Apply Simple Validation for Address
        if(!verdict?.addressComplete && verdict?.hasUnconfirmedComponents) {
            return false;
        }

        return true;
    }
}
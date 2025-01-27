import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { DatabaseRepositoryConstants } from "src/constants";
import { Repository } from "typeorm";
import { Address } from "./address.entity";
import { Users } from "src/users/users.entity";

@Injectable()
export class AddressService {

    constructor(
        @Inject(DatabaseRepositoryConstants.addressRepository)
        private readonly addressRepository: Repository<Address>,
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private readonly usersRepository: Repository<Users>
    ){}

    async createAddress(
        createAddressDto: CreateAddressDto
    ) {
        const address = new Address()
        
        // Validate it its a real user
        const existingUser = await this.usersRepository.findOne({
            where: {
                id: createAddressDto.userId
            }
        })

        if(!existingUser) {
            throw new BadRequestException("Invalid user id!")
        }

        address.city = createAddressDto.city;
        address.country = createAddressDto.country;
        address.district = createAddressDto.district;
        address.houseNumber = createAddressDto.houseNumber;
        address.locationReference = createAddressDto.locationReference;
        address.postalCode = createAddressDto.postalCode;
        address.state = createAddressDto.state;
        address.street = createAddressDto.street;
        address.user = existingUser;

        return this.addressRepository.save(address)
    }

    async validateCityCountryZipAndState(
        
    ) {}
}
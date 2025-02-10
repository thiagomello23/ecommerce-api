import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateAddressDto } from "./dto/create-address.dto";
import { DatabaseRepositoryConstants, googleUrlKeys } from "src/constants";
import { DataSource, Repository } from "typeorm";
import { Address } from "./address.entity";
import { Users } from "src/users/users.entity";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom, map } from "rxjs";
import axios from "axios";
import { plainToInstance } from "class-transformer";

@Injectable()
export class AddressService {

    constructor(
        @Inject(DatabaseRepositoryConstants.addressRepository)
        private readonly addressRepository: Repository<Address>,
        @Inject(DatabaseRepositoryConstants.usersRepository)
        private readonly usersRepository: Repository<Users>,
        private readonly httpService: HttpService,
        @Inject(DatabaseRepositoryConstants.dataSource)
        private readonly dataSource: DataSource,
    ){}

    async createNewAddress(createAddressDto: CreateAddressDto, user: Users) {
        const countAddress = await this.addressRepository
            .createQueryBuilder("address")
            .where("address.user.id = :id", {id: user.id})
            .getCount()

        if(countAddress >= +process.env.MAX_LIMIT_ADDRESSES) {
            throw new UnauthorizedException("Max address limit register, please remove some address to create new ones!")
        }

        const address = plainToInstance(Address, createAddressDto, {excludeExtraneousValues: true})
        address.user = user

        const validationAddress = await this.validateAddress(address)

        if(!validationAddress) {
            throw new BadRequestException("Invalid address!")
        }

        address.defaultAddress = createAddressDto.defaultAddress

        const queryRunner = this.dataSource.createQueryRunner()
        let createdAddress;

        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            createdAddress = await queryRunner.manager.save(Address, address)

            await queryRunner.commitTransaction()
        } catch(err) {
            await queryRunner.rollbackTransaction()
            throw err;
        } finally {
            await queryRunner.release()
        }

        return createdAddress
    }

    async getAllUserAddress(
        user: Users
    ) {
        return this.addressRepository
            .createQueryBuilder("address")
            .where("address.userId = :userId", {userId: user.id})
            .orderBy("address.createdAt")
            .getMany()
    }

    async makeDefaultAddress(
        addressId: string,
        user: Users
    ){
        const existingAddress = await this.addressRepository.findOne({
            where: {
                id: addressId,
                user: {
                    id: user.id
                }
            }
        })

        if(!existingAddress) {
            throw new NotFoundException("Address not found!")
        }

        existingAddress.defaultAddress = true

        return this.addressRepository.save(existingAddress)
    }

    async deleteAddress(
        addressId: string,
        user: Users
    ){
        return this.addressRepository
            .createQueryBuilder("address")
            .softDelete()
            .where("id = :addressId", {addressId})
            .andWhere("userId = :userId", {userId: user.id})
            .execute()
    }

    async mapAddressWithoutUser(createAddressDto: CreateAddressDto) {
        const address = plainToInstance(Address, createAddressDto, {excludeExtraneousValues: true})

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
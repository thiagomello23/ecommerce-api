import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { DatabaseRepositoryConstants } from "src/constants";
import { Repository } from "typeorm";
import { Vendors } from "./vendors.entity";
import { CreateVendor } from "./dto/create-vendor.dto";

@Injectable()
export class VendorsService {

    constructor(
        @Inject(DatabaseRepositoryConstants.vendorsRepository)
        private readonly vendorsRepository: Repository<Vendors>,
    ){}

    async createVendor(createVendorDto: CreateVendor) {
        const newVendor = new Vendors()
        // Validate vendor data like business name and registration number
        const existingVendor = await this.vendorsRepository
                                    .createQueryBuilder("vendors")
                                    .where("vendors.businessName = :businessName", {businessName: createVendorDto.businessName})
                                    .orWhere("vendors.registrationNumber = :registrationNumber", {registrationNumber: createVendorDto.registrationNumber})
                                    .getOne()

        if(existingVendor) {
            throw new UnauthorizedException("Vendor registration number or business name was already been used!")
        }

        newVendor.businessName = createVendorDto.businessName.toUpperCase()
        newVendor.businessType = createVendorDto.businessType
        newVendor.registrationNumber = createVendorDto.registrationNumber
        newVendor.validVendor = false

        // For now i will just do that until i decide how to work with transactions
        return newVendor;
    }
}
import { Body, Controller, Delete, ParseFilePipe, ParseFilePipeBuilder, Patch, Req, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiBearerAuth, ApiBody, ApiTags } from "@nestjs/swagger";
import { Action } from "src/casl/enums/casl-action";
import { AppAbility } from "src/casl/casl-ability.factory";
import { CheckPolicies } from "src/auth/decorators/check-policies.decorator";
import { UpdateUserProfile } from "./dto/update-user-profile.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from 'express'
import { FileValidationPipe } from "src/files/files-validation.pipe";
import { validMimeTypesForFiles } from "src/constants";
import { Public } from "src/auth/decorators/is-public.decorator";
import { FilesService } from "src/files/files.service";
import { FilesTransformName } from "src/files/files-transform-name.pipe";

@ApiTags("users")
@Controller("users")
export class UsersControllers {

    constructor(
        private readonly usersService: UsersService
    ) {}

    @Patch("profile")
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Update, "Users"))
    @ApiBody({type: UpdateUserProfile})
    @ApiBearerAuth()
    @UseInterceptors(FileInterceptor("profilePic"))
    async updateUserProfile(
        @Body() updateUserProfileDto: UpdateUserProfile,
        @Req() request,
        @UploadedFile(
            new FileValidationPipe(),
            new FilesTransformName()
        ) profilePic: Express.Multer.File
    ) {
        updateUserProfileDto.file = profilePic
        return this.usersService.updateUserProfile(updateUserProfileDto, request.user)
    }

    @Delete("delete/client")
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "Users"))
    @ApiBearerAuth()
    async deleteClientUser(
        @Req() request
    ) {
        const user = request.user
        return this.usersService.deleteClientUser(user)
    }

    // For now is equals to a normal user delete, but forward this will have some extra
    // validations for this to work
    @Delete("delete/vendors")
    @CheckPolicies((ability: AppAbility) => ability.can(Action.Delete, "Users"))
    @ApiBearerAuth()
    async deleteVendorUser(
        @Req() request
    ) { 
        // const user = request.user
        // return this.usersService.deleteVendorUser(user)
    }
}
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { maxFileSize, validMimeTypesForFiles } from "src/constants";

@Injectable()
export class FileValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const validType = validMimeTypesForFiles.includes(value.mimetype.split("/")[1])

        if(!validType) {
            throw new BadRequestException("Not valid mimetype, valid mimetypes are: " + validMimeTypesForFiles.toString())
        }

        if(value.size > maxFileSize) {
            throw new BadRequestException("Max file size is 10mb!")
        }

        return value;
    }
}
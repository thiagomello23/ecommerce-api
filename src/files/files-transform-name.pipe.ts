import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { randomUUID } from "crypto";

@Injectable()
export class FilesTransformName implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        const uuid = randomUUID()
        value.filename = uuid + "_" + value.originalname
        return value
    }
}
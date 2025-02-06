import { Module } from "@nestjs/common";
import { FileValidationPipe } from "./files-validation.pipe";
import { FilesService } from "./files.service";
import { MulterModule } from "@nestjs/platform-express";
import * as multer from "multer";
import { FilesTransformName } from "./files-transform-name.pipe";

@Module({
    // Carefull with memory leak
    imports: [MulterModule.register({storage: multer.memoryStorage()})],
    providers: [FileValidationPipe, FilesService, FilesTransformName],
    exports: [FileValidationPipe, FilesService, FilesTransformName]
})
export class FilesModule {}
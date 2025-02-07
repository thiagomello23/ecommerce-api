import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";
import { googleStorageEndpoint, googleStorageProfileFolder } from "src/constants";

@Injectable()
export class FilesService {

    async fileUploadGCP(file: Express.Multer.File) {
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID
        })

        await storage.bucket(process.env.GCP_BUCKET_NAME)
            .file("profilePicture/" + file.filename)
            .save(file.buffer, {public: true})

        return {
            publicUrl: `${googleStorageEndpoint}${process.env.GCP_BUCKET_NAME}/${googleStorageProfileFolder + file.filename}`
        }
    }

}
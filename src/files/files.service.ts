import { Injectable } from "@nestjs/common";
import { Storage } from "@google-cloud/storage";

@Injectable()
export class FilesService {

    async fileUploadGCP(file: Express.Multer.File) {
        const storage = new Storage({
            projectId: process.env.GCP_PROJECT_ID
        })

        return storage.bucket(process.env.GCP_BUCKET_NAME)
            .file("profilePicture/" + file.filename)
            .save(file.buffer, {public: true})
    }

}
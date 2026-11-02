import { v2 as cloudinary } from 'cloudinary';
import dontenv from 'dotenv';

dontenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export function uploadMediaInCloudinary(fileBuffer, folderName) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folderName: folderName,

            },
            (error, result) => {
                if (error) {
                    return reject(error)
                }
                resolve(result)
            }
        )

        uploadStream.end(fileBuffer)
    })
}

export async function checkMediaExistInCloudinary(publicId, type) {
    try {
        const isExist = await cloudinary.api.resource(publicId, {
            resource_type: type
        })

        if (isExist) {
            return true
        } else {
            return false
        }
    } catch (error) {
        if (error.http_code === 404) {
            throw new Error("Resources does not Exist!")
        } else {
            throw new Error(`Cloudinary Error: ${error}`)
        }
    }
}

export async function deleteMediaFromCloudinary(publicId, type) {
    return await cloudinary.uploader.destroy(publicId, {
        resource_type: type
    })
}

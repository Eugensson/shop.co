"server-only";

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadSingleFile = async (
  file: File
): Promise<{ secureUrl: string | null; publicId: string | null }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResponse: UploadApiResponse = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: "auto" },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error("Download result is uncertain"));
            }
          }
        );
        uploadStream.end(buffer);
      }
    );

    return {
      secureUrl: uploadResponse.secure_url ?? null,
      publicId: uploadResponse.public_id,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return { secureUrl: null, publicId: null };
  }
};

export const uploadImageToCloudinary = async (file: File) => {
  return uploadSingleFile(file);
};

export const uploadImagesToCloudinary = async (files: File[]) => {
  return Promise.all(files.map((file) => uploadSingleFile(file)));
};

export const deleteImageFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    console.error("Image deletion error:", error);
    return false;
  }
};

export const deleteImagesFromCloudinary = async (
  publicIds: string[]
): Promise<boolean[]> => {
  return Promise.all(
    publicIds.map((publicId) => deleteImageFromCloudinary(publicId))
  );
};

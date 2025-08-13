import { uploadImagesToCloudinary } from "@/lib/uploadImage";
import { MAX_FILE_SIZE, MAX_FILE_SIZE_MB } from "@/constants";

type InputImage = { file: File; isMain: boolean };

type UploadResult =
  | { error: string }
  | { images: { url: string; publicId: string; isMain: boolean }[] };

export const processUploadedImages = async (
  images: InputImage[]
): Promise<UploadResult> => {
  if (images.length === 0) {
    return { error: "Add at least one image" };
  }

  if (images.length > 5) {
    return { error: "You can upload a maximum of 5 images" };
  }

  for (const { file } of images) {
    if (!file.type.startsWith("image/")) {
      return { error: `File "${file.name}" is not an image.` };
    }
    if (file.size > MAX_FILE_SIZE) {
      return {
        error: `File "${file.name}" exceeds max size of ${MAX_FILE_SIZE_MB}MB.`,
      };
    }
  }

  const files = images.map((img) => img.file);
  const uploaded = await uploadImagesToCloudinary(files);

  const validImages = uploaded
    .map((upload, i) => {
      if (upload.secureUrl && upload.publicId) {
        return {
          url: upload.secureUrl,
          publicId: upload.publicId,
          isMain: images[i]?.isMain ?? false,
        };
      }
      return null;
    })
    .filter(
      (img): img is { url: string; publicId: string; isMain: boolean } =>
        img !== null
    );

  if (validImages.length === 0) {
    return { error: "Failed to upload any images" };
  }

  return { images: validImages };
};

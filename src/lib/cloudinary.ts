import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
}

export interface CloudinaryDeleteResult {
  result: string;
}

// Upload image to Cloudinary
export async function uploadImage(
  file: File,
  folder: string = 'portfolio'
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const arrayBuffer = file.arrayBuffer();
    arrayBuffer
      .then((buffer) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            format: 'webp', // Convert to webp for better performance
            quality: 'auto:good',
          },
          (error, result) => {
            if (error || !result) {
              reject(error || new Error('Upload failed'));
              return;
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              bytes: result.bytes,
            });
          }
        );

        uploadStream.end(Buffer.from(buffer));
      })
      .catch(reject);
  });
}

// Delete image from Cloudinary
export async function deleteImage(publicId: string): Promise<CloudinaryDeleteResult> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });
  });
}

// Extract public_id from Cloudinary URL
export function extractPublicId(url: string): string | null {
  try {
    // Example URL: https://res.cloudinary.com/cloud_name/image/upload/folder/public_id.webp
    const urlParts = url.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return null;

    const folderAndPublicId = urlParts.slice(uploadIndex + 1).join('/');
    const publicId = folderAndPublicId.replace(/\.[a-zA-Z]+$/, ''); // Remove file extension
    return publicId;
  } catch {
    return null;
  }
}

// Check if URL is a Cloudinary URL
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com');
}

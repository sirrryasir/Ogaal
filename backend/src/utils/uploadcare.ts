import { uploadFile } from '@uploadcare/upload-client';

const UPLOADCARE_PUBLIC_KEY = process.env.UPLOADCARE_PUBLIC_KEY;
const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY;

if (!UPLOADCARE_PUBLIC_KEY) {
  console.warn('Warning: UPLOADCARE_PUBLIC_KEY is not set in environment variables');
}

if (!UPLOADCARE_SECRET_KEY) {
  console.warn('Warning: UPLOADCARE_SECRET_KEY is not set in environment variables');
}

export const uploadImageToUploadcare = async (fileBuffer: Buffer, filename: string) => {
  if (!UPLOADCARE_PUBLIC_KEY) {
    throw new Error('Uploadcare public key is not configured');
  }

  try {
    const result = await uploadFile(fileBuffer, {
      publicKey: UPLOADCARE_PUBLIC_KEY,
      fileName: filename,
      store: 'auto', // Store permanently
    });
    return {
      uuid: result.uuid,
      cdnUrl: result.cdnUrl || `https://ucarecdn.com/${result.uuid}/`,
      originalFilename: result.originalFilename || filename,
    };
  } catch (error) {
    console.error('Uploadcare upload error:', error);
    throw new Error('Failed to upload image');
  }
};

export const deleteImageFromUploadcare = async (uuid: string) => {
  // Note: For deletion, you would typically use the REST API with the secret key
  // This is a simplified version - in production, implement proper deletion
  if (!UPLOADCARE_SECRET_KEY) {
    console.warn('Uploadcare secret key not configured, cannot delete image');
    return;
  }
  console.log(`Image deletion requested for UUID: ${uuid}`);
  // Implement deletion logic using Uploadcare REST API if needed
};



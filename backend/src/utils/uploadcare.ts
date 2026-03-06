// @ts-ignore
import { uploadFile } from '@uploadcare/upload-client';

const publicKey = process.env.UPLOADCARE_PUBLIC_KEY;
const secretKey = process.env.UPLOADCARE_SECRET_KEY;

if (!publicKey) {
  console.warn('UPLOADCARE_PUBLIC_KEY is not set. Image uploads will fail.');
}

export const uploadImageToUploadcare = async (fileBuffer: Buffer, filename: string) => {
  if (!publicKey) throw new Error('UPLOADCARE_PUBLIC_KEY is not configured');

  try {
    const result = await uploadFile(fileBuffer as any, {
      publicKey,
      fileName: filename,
      store: 'auto',
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

// If you need deletion using the secret key, implement it using the REST API and
// ensure UPLOADCARE_SECRET_KEY is present in the environment and kept secret.
export const deleteImageFromUploadcare = async (uuid: string) => {
  if (!secretKey) {
    console.warn('UPLOADCARE_SECRET_KEY is not configured. Deletion will be a no-op.');
    return;
  }

  // Example deletion via REST API:
  // await fetch(`https://api.uploadcare.com/files/${uuid}/`, {
  //   method: 'DELETE',
  //   headers: {
  //     Authorization: `Uploadcare.Simple ${publicKey}:${secretKey}`,
  //   },
  // });

  console.log(`Image deletion requested for UUID: ${uuid}`);
};

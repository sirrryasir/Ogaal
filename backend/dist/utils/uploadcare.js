import { uploadFile } from '@uploadcare/upload-client';
const UPLOADCARE_PUBLIC_KEY = 'db5971bb8db82d86a6b6';
const UPLOADCARE_SECRET_KEY = '28b10f2cd7cc8a5b93a7';
export const uploadImageToUploadcare = async (fileBuffer, filename) => {
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
    }
    catch (error) {
        console.error('Uploadcare upload error:', error);
        throw new Error('Failed to upload image');
    }
};
export const deleteImageFromUploadcare = async (uuid) => {
    // Note: For deletion, you would typically use the REST API with the secret key
    // This is a simplified version - in production, implement proper deletion
    console.log(`Image deletion requested for UUID: ${uuid}`);
    // Implement deletion logic using Uploadcare REST API if needed
};
//# sourceMappingURL=uploadcare.js.map
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from 'firebase/storage';
import { storage } from './firebase';

// Upload an image to Firebase Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image must be less than 5MB');
    }
    
    // Create a reference to the storage location
    const storageRef = ref(storage, path);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to upload image');
  }
};

// Get download URL for an image
export const getImageURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting image URL:', error);
    throw new Error('Failed to get image URL');
  }
};

// Delete an image from Firebase Storage
export const deleteImage = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw error if image doesn't exist
    if (error instanceof Error && !error.message.includes('object does not exist')) {
      throw new Error('Failed to delete image');
    }
  }
};

// List all images in a folder
export const listImages = async (path: string): Promise<string[]> => {
  try {
    const listRef = ref(storage, path);
    const res = await listAll(listRef);
    
    const urls = await Promise.all(
      res.items.map(itemRef => getDownloadURL(itemRef))
    );
    
    return urls;
  } catch (error) {
    console.error('Error listing images:', error);
    // Return empty array if folder doesn't exist
    if (error instanceof Error && error.message.includes('does not exist')) {
      return [];
    }
    throw new Error('Failed to list images');
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files: File[], basePath: string): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadImage(file, path);
    });
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw new Error('Failed to upload images');
  }
};
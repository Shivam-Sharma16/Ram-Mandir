import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'; // Added deleteObject
import { updateContent, getContentBySectionKey, createContent } from './cms';
import { v4 as uuidv4 } from 'uuid';

export const uploadHeroImage = async (file: File): Promise<string> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${uuidv4()}.${fileExt}`;
    const storageRef = ref(storage, `hero_banners/${fileName}`);

    await uploadBytes(storageRef, file);
    const publicUrl = await getDownloadURL(storageRef);

    const existingHeroRecords = await getContentBySectionKey('home_hero');
    
    if (existingHeroRecords.length > 0) {
      await updateContent(existingHeroRecords[0].id!, { imageUrl: publicUrl });
    } else {
      await createContent({
        sectionKey: 'home_hero',
        title: 'Main Hero Banner',
        imageUrl: publicUrl,
        description: 'Dynamically uploaded via admin dashboard.'
      });
    }

    return publicUrl;
  } catch (error) {
    console.error("Error uploading hero image:", error);
    throw error;
  }
};

/**
 * Removes the hero banner image URL from the CMS.
 * Extension: To delete from Storage, you'd need the specific file path.
 */
export const removeHeroBanner = async (): Promise<void> => {
  try {
    const existingHeroRecords = await getContentBySectionKey('home_hero');
    if (existingHeroRecords.length > 0) {
      // Clear the imageUrl in the database
      await updateContent(existingHeroRecords[0].id!, { imageUrl: '' });
    }
  } catch (error) {
    console.error("Error removing hero banner:", error);
    throw error;
  }
};
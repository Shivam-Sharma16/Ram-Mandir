import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateContent, getContentBySectionKey, createContent } from './cms';
import { v4 as uuidv4 } from 'uuid'; // We need a way to generate unique file names

export const uploadHeroImage = async (file: File): Promise<string> => {
  try {
    // 1. Create a unique reference in Firebase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${uuidv4()}.${fileExt}`;
    const storageRef = ref(storage, `hero_banners/${fileName}`);

    // 2. Upload the file
    await uploadBytes(storageRef, file);

    // 3. Get the public download URL
    const publicUrl = await getDownloadURL(storageRef);

    // 4. Update the 'home_hero' document in CMS
    const existingHeroRecords = await getContentBySectionKey('home_hero');
    
    if (existingHeroRecords.length > 0) {
      // Update existing
      await updateContent(existingHeroRecords[0].id!, { imageUrl: publicUrl });
    } else {
      // Create new
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

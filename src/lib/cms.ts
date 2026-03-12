import { db } from './firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp
} from 'firebase/firestore';

export interface SiteContent {
  id?: string;
  sectionKey: string; // e.g., 'hero', 'about', 'donation_banner'
  title: string;
  description?: string;
  imageUrl?: string;
  additionalData?: any; // JSON string or object for extra fields
  createdAt?: any;
  updatedAt?: any;
}

const COLLECTION_NAME = 'site_contents';

export const getContentList = async (): Promise<SiteContent[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const contents: SiteContent[] = [];
    querySnapshot.forEach((doc) => {
      contents.push({ id: doc.id, ...doc.data() } as SiteContent);
    });
    return contents;
  } catch (error) {
    console.error("Error getting contents: ", error);
    return [];
  }
};

export const getContentBySectionKey = async (sectionKey: string): Promise<SiteContent[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("sectionKey", "==", sectionKey));
    const querySnapshot = await getDocs(q);
    const contents: SiteContent[] = [];
    querySnapshot.forEach((doc) => {
      contents.push({ id: doc.id, ...doc.data() } as SiteContent);
    });
    return contents;
  } catch (error) {
    console.error("Error getting contents by section: ", error);
    return [];
  }
};

export const createContent = async (content: Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...content,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const updateContent = async (id: string, content: Partial<SiteContent>) => {
  try {
    const contentRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(contentRef, {
      ...content,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    throw error;
  }
};

export const deleteContent = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
    return true;
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};

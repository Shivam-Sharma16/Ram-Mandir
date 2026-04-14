import { db, storage } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Album {
  id?: string;
  title: string;
  coverImageUrl: string;
  priority: number;
  createdAt?: any;
}

export interface AlbumImage {
  id?: string;
  albumId: string;
  imageUrl: string;
  priority: number;
  createdAt?: any;
}

// ---------------- ALBUMS ---------------- //

export const getAlbums = async (): Promise<Album[]> => {
  const albumsCol = collection(db, 'albums');
  const snapshot = await getDocs(albumsCol);
  const albums = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
  
  // Sort in JS to avoid Firebase composite index requirements
  return albums.sort((a, b) => {
    // Sort by priority first (descending)
    if (b.priority !== a.priority) return b.priority - a.priority;
    // Then by creation time if priorities are equal
    const timeA = a.createdAt?.toMillis?.() || 0;
    const timeB = b.createdAt?.toMillis?.() || 0;
    return timeB - timeA;
  });
};

export const getAlbumById = async (id: string): Promise<Album | null> => {
  const docRef = doc(db, 'albums', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Album;
  }
  return null;
}

export const createAlbum = async (album: Album): Promise<string> => {
  const albumsCol = collection(db, 'albums');
  const docRef = await addDoc(albumsCol, {
    ...album,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateAlbum = async (id: string, data: Partial<Album>): Promise<void> => {
  const docRef = doc(db, 'albums', id);
  await updateDoc(docRef, data);
};

export const deleteAlbum = async (id: string): Promise<void> => {
  // First delete all images associated with this album
  const images = await getAlbumImages(id);
  for (const img of images) {
    if (img.id) await deleteAlbumImage(img.id, img.imageUrl);
  }
  
  const docRef = doc(db, 'albums', id);
  await deleteDoc(docRef);
};

export const uploadAlbumCover = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `album_covers/${uuidv4()}.${fileExt}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// ---------------- IMAGES ---------------- //

export const getAlbumImages = async (albumId: string): Promise<AlbumImage[]> => {
  const imagesCol = collection(db, 'album_images');
  const q = query(
    imagesCol, 
    where('albumId', '==', albumId)
  );
  const snapshot = await getDocs(q);
  const images = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AlbumImage));
  
  // Sort in JS to avoid Firebase composite index requirements
  return images.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    const timeA = a.createdAt?.toMillis?.() || 0;
    const timeB = b.createdAt?.toMillis?.() || 0;
    return timeB - timeA;
  });
};

export const addImageToAlbum = async (image: AlbumImage): Promise<string> => {
  const imagesCol = collection(db, 'album_images');
  const docRef = await addDoc(imagesCol, {
    ...image,
    createdAt: serverTimestamp()
  });
  return docRef.id;
};

export const updateAlbumImage = async (id: string, data: Partial<AlbumImage>): Promise<void> => {
  const docRef = doc(db, 'album_images', id);
  await updateDoc(docRef, data);
};

export const deleteAlbumImage = async (id: string, imageUrl: string): Promise<void> => {
  // Try to delete from storage if possible
  try {
    // Basic extraction of path from URL, this might fail if url is complex, 
    // but usually firebase storage urls have a specific format.
    // It's safer to just delete the doc and if storage extraction works, delete from storage.
    const urlObj = new URL(imageUrl);
    const pathRegex = /o\/(.+)\?/;
    const matches = urlObj.pathname.match(pathRegex);
    if (matches && matches[1]) {
      const decodedPath = decodeURIComponent(matches[1]);
      const storageRef = ref(storage, decodedPath);
      await deleteObject(storageRef);
    }
  } catch (e) {
    console.warn("Could not delete image from storage:", e);
  }
  
  const docRef = doc(db, 'album_images', id);
  await deleteDoc(docRef);
};

export const uploadGalleryImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `gallery/${uuidv4()}.${fileExt}`;
  const storageRef = ref(storage, fileName);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

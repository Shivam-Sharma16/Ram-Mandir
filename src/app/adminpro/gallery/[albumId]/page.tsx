'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Album, getAlbumById, AlbumImage, 
  getAlbumImages, addImageToAlbum, 
  deleteAlbumImage, updateAlbumImage, uploadGalleryImage 
} from '../../../../lib/galleryCms';
import styles from '../GalleryAdmin.module.css';

export default function AlbumImagesAdminPage() {
  const { albumId } = useParams() as { albumId: string };
  const router = useRouter();

  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Upload State
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (albumId) {
      loadData();
    }
  }, [albumId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedAlbum = await getAlbumById(albumId);
      if (!fetchedAlbum) {
        alert('Album not found!');
        router.push('/adminpro/gallery');
        return;
      }
      setAlbum(fetchedAlbum);
      await fetchImages();
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async () => {
    try {
      const data = await getAlbumImages(albumId);
      setImages(data);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) return alert('Please select images to upload');

    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const imageUrl = await uploadGalleryImage(file);
        
        // Let's set priority to 0 by default, they can edit later
        await addImageToAlbum({
          albumId,
          imageUrl,
          priority: 0
        });
      }
      setFiles(null);
      // Reset file input
      const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      await fetchImages();
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, url: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteAlbumImage(id, url);
        fetchImages();
      } catch (error) {
        console.error('Error deleting image:', error);
        alert('Failed to delete image');
      }
    }
  };

  const handleUpdatePriority = async (id: string, currentPriority: number) => {
    const newPriority = prompt('Enter new priority (higher number comes first):', currentPriority.toString());
    if (newPriority !== null && !isNaN(Number(newPriority))) {
      try {
        await updateAlbumImage(id, { priority: Number(newPriority) });
        fetchImages();
      } catch (error) {
        console.error('Error updating priority:', error);
      }
    }
  };

  if (loading) return <div className={styles.loading}>Loading Data...</div>;
  if (!album) return <div className={styles.loading}>Album not found.</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <Link href="/adminpro/gallery" style={{ color: '#666', textDecoration: 'none', marginBottom: '8px', display: 'inline-block' }}>
            &larr; Back to Albums
          </Link>
          <h1>Images for "{album.title}"</h1>
        </div>
      </div>

      <div className={styles.formContainer}>
        <h2>Upload New Images</h2>
        <form onSubmit={handleUpload}>
          <div className={styles.formGroup}>
            <input 
              id="fileUpload"
              type="file" 
              accept="image/*" 
              multiple 
              onChange={(e) => setFiles(e.target.files)} 
              required
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
        </form>
      </div>

      <div className={styles.grid}>
        {images.map((img) => (
          <div key={img.id} className={styles.card}>
            <div className={styles.imageWrapper} style={{ height: '200px' }}>
              <img src={img.imageUrl} alt="Gallery item" />
            </div>
            <div className={styles.cardContent} style={{ padding: '12px' }}>
              <p className={styles.cardPriority} style={{ marginBottom: '8px' }}>
                Priority: {img.priority}
              </p>
              <div className={styles.cardActions}>
                <button className={styles.editBtn} onClick={() => handleUpdatePriority(img.id!, img.priority)}>
                  Change Priority
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(img.id!, img.imageUrl)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            No images in this album yet. Upload some above!
          </p>
        )}
      </div>
    </div>
  );
}

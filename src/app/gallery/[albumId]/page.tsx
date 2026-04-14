'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import { Album, AlbumImage, getAlbumById, getAlbumImages } from '../../../lib/galleryCms';
import styles from './AlbumView.module.css';

export default function AlbumViewPage() {
  const { albumId } = useParams() as { albumId: string };
  const [album, setAlbum] = useState<Album | null>(null);
  const [images, setImages] = useState<AlbumImage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    if (albumId) {
      loadData();
    }
  }, [albumId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const fetchedAlbum = await getAlbumById(albumId);
      if (fetchedAlbum) {
        setAlbum(fetchedAlbum);
        const fetchedImages = await getAlbumImages(albumId);
        setImages(fetchedImages);
      }
    } catch (error) {
      console.error("Failed to load album data", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length);
    }
  };

  if (loading) return <div className={styles.container}><div style={{textAlign:'center', marginTop:'50px'}}>Loading Album...</div></div>;
  if (!album) return <div className={styles.container}><div style={{textAlign:'center', marginTop:'50px'}}>Album not found.</div></div>;

  return (
    <>
      <Head>
        <title>{album.title} | Gallery | Shree Ram Mandir</title>
      </Head>
      <div className={styles.container}>
        <Link href="/gallery" className={styles.backBtn}>
          &larr; Back to Gallery
        </Link>
        <div className={styles.header}>
          <h1 className={styles.title}>{album.title}</h1>
        </div>

        <div className={styles.grid}>
          {images.map((img, index) => (
            <div 
              key={img.id} 
              className={styles.imageWrapper}
              onClick={() => openLightbox(index)}
            >
              <img src={img.imageUrl} alt={`${album.title} - Image ${index + 1}`} className={styles.albumImage} loading="lazy" />
            </div>
          ))}
          {images.length === 0 && (
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
              No images in this album yet.
            </p>
          )}
        </div>

        {/* Lightbox */}
        {lightboxIndex !== null && (
          <div className={styles.lightbox} onClick={closeLightbox}>
            <div className={styles.lightboxContent}>
              <button className={styles.closeBtn} onClick={closeLightbox}>&times;</button>
              
              {images.length > 1 && (
                <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={prevImage}>&#10094;</button>
              )}
              
              <img 
                src={images[lightboxIndex].imageUrl} 
                alt="Popup" 
                className={styles.lightboxImage} 
                onClick={(e) => e.stopPropagation()} 
              />
              
              {images.length > 1 && (
                <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={nextImage}>&#10095;</button>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

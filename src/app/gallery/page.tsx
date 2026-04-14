'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Album, getAlbums } from '../../lib/galleryCms';
import styles from './Gallery.module.css';

export default function GalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const data = await getAlbums();
        setAlbums(data);
      } catch (error) {
        console.error("Failed to load albums", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbums();
  }, []);

  return (
    <>
      <Head>
        <title>Gallery | Shree Ram Mandir</title>
        <meta name="description" content="Explore the beautiful gallery of Shree Ram Mandir." />
      </Head>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Divine Glimpses</span>
          <h1 className={styles.title}>Photo Gallery</h1>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading Albums...</div>
        ) : (
          <div className={styles.grid}>
            {albums.map(album => (
              <Link href={`/gallery/${album.id}`} key={album.id} className={styles.albumCard}>
                <img src={album.coverImageUrl} alt={album.title} className={styles.albumImage} loading="lazy" />
                <div className={styles.overlay}>
                  <h3 className={styles.albumTitle}>{album.title}</h3>
                  <span className={styles.viewText}>View Album &rarr;</span>
                </div>
              </Link>
            ))}
            {albums.length === 0 && !loading && (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
                Albums are currently being updated. Please check back later.
              </p>
            )}
          </div>
        )}
      </div>
    </>
  );
}

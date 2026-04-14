'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './GalleryAdmin.module.css';
import { Album, getAlbums, createAlbum, updateAlbum, deleteAlbum, uploadAlbumCover } from '../../../lib/galleryCms';

export default function GalleryAdminPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingCover, setExistingCover] = useState('');

  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const data = await getAlbums();
      setAlbums(data);
    } catch (error) {
      console.error('Error fetching albums:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setPriority(0);
    setFile(null);
    setExistingCover('');
    setShowForm(false);
  };

  const handleEdit = (album: Album) => {
    setEditingId(album.id!);
    setTitle(album.title);
    setPriority(album.priority);
    setExistingCover(album.coverImageUrl);
    setShowForm(true);
  };

  const handleDelete = async (id: string, titleStr: string) => {
    if (confirm(`Are you sure you want to delete the album "${titleStr}" and ALL its images?`)) {
      try {
        await deleteAlbum(id);
        fetchAlbums();
      } catch (error) {
        console.error('Error deleting album:', error);
        alert('Failed to delete album.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Title is required');
    if (!editingId && !file) return alert('Cover image is required for new albums');

    setIsSubmitting(true);
    try {
      let coverUrl = existingCover;

      if (file) {
        coverUrl = await uploadAlbumCover(file);
      }

      const albumData: Album = {
        title,
        priority: Number(priority),
        coverImageUrl: coverUrl,
      };

      if (editingId) {
        await updateAlbum(editingId, albumData);
      } else {
        await createAlbum(albumData);
      }

      resetForm();
      fetchAlbums();
    } catch (error) {
      console.error('Error saving album:', error);
      alert('Failed to save album');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading Albums...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Manage Gallery Albums</h1>
        {!showForm && (
          <button className={styles.addButton} onClick={() => setShowForm(true)}>
            + Add New Album
          </button>
        )}
      </div>

      {showForm && (
        <div className={styles.formContainer}>
          <h2>{editingId ? 'Edit Album' : 'Create New Album'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Album Title *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
                placeholder="e.g. Navgraha Darshan"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Priority * (Higher number comes first)</label>
              <input 
                type="number" 
                value={priority} 
                onChange={(e) => setPriority(Number(e.target.value))} 
                required 
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cover Image {editingId ? '(Leave empty to keep existing)' : '*'}</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                required={!editingId}
              />
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Album'}
              </button>
              <button type="button" className={styles.cancelBtn} onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.grid}>
        {albums.map((album) => (
          <div key={album.id} className={styles.card}>
            <Link href={`/adminpro/gallery/${album.id}`} className={styles.imageWrapper}>
              <img src={album.coverImageUrl} alt={album.title} />
            </Link>
            <div className={styles.cardContent}>
              <h3 className={styles.cardTitle}>{album.title}</h3>
              <p className={styles.cardPriority}>Priority: {album.priority}</p>
              <div className={styles.cardActions}>
                <Link href={`/adminpro/gallery/${album.id}`} className={styles.viewBtn}>
                  Manage Images
                </Link>
                <button className={styles.editBtn} onClick={() => handleEdit(album)}>
                  Edit
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(album.id!, album.title)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
        {albums.length === 0 && !showForm && (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#666' }}>
            No albums found. Create one to get started!
          </p>
        )}
      </div>
    </div>
  );
}

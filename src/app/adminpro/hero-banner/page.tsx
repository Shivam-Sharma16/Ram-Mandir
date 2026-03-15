'use client';

import React, { useState, useEffect } from 'react';
import { getContentBySectionKey } from '@/src/lib/cms';
import { uploadHeroImage, removeHeroBanner } from '@/src/lib/storage'; // Import removeHeroBanner
import styles from './HeroBannerAdmin.module.css';
import { FiUploadCloud, FiImage, FiCheckCircle, FiTrash2 } from 'react-icons/fi'; // Added FiTrash2

export default function HeroBannerAdmin() {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // New state
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchCurrentImage = async () => {
    try {
      const records = await getContentBySectionKey('home_hero');
      if (records.length > 0 && records[0].imageUrl) {
        setCurrentImageUrl(records[0].imageUrl);
      } else {
        setCurrentImageUrl(null);
      }
    } catch (err) {
      console.error("Failed to load current banner image", err);
    }
  };

  useEffect(() => {
    fetchCurrentImage();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setSuccessMsg('');
      setErrorMsg('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const publicUrl = await uploadHeroImage(selectedFile);
      setCurrentImageUrl(publicUrl);
      setSuccessMsg('Hero banner updated successfully!');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  // New function to handle removal
  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove the current banner and revert to default?')) return;
    
    setIsDeleting(true);
    try {
      await removeHeroBanner();
      setCurrentImageUrl(null);
      setSuccessMsg('Hero banner removed. Theme default is now active.');
    } catch (err: any) {
      setErrorMsg('Failed to remove banner.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Manage Hero Banner</h1>
        <p>Upload or remove the homepage background image.</p>
      </header>

      {successMsg && (
        <div className={styles.alertSuccess}>
          <FiCheckCircle className={styles.alertIcon} />
          {successMsg}
        </div>
      )}

      {errorMsg && <div className={styles.alertError}>{errorMsg}</div>}

      <div className={styles.grid}>
        <div className={styles.panel}>
          <h2>Current Live Banner</h2>
          {currentImageUrl ? (
            <>
              <div className={styles.imagePreviewWrapper}>
                <img src={currentImageUrl} alt="Current Hero" className={styles.previewImage} />
              </div>
              <button 
                className={styles.removeBtn} 
                onClick={handleRemove}
                disabled={isDeleting}
              >
                <FiTrash2 /> {isDeleting ? 'Removing...' : 'Remove Current Banner'}
              </button>
            </>
          ) : (
            <div className={styles.emptyState}>
              <FiImage className={styles.emptyIcon} />
              <p>No custom banner set. Theme default is active.</p>
            </div>
          )}
        </div>

        <div className={styles.panel}>
          <h2>Upload New Banner</h2>
          <div className={styles.uploadArea}>
            <input 
              type="file" 
              id="bannerUpload" 
              accept="image/*" 
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="bannerUpload" className={styles.uploadLabel}>
              <FiUploadCloud className={styles.uploadIcon} />
              <span className={styles.uploadText}>
                {selectedFile ? selectedFile.name : 'Click to upload'}
              </span>
            </label>
          </div>

          {previewUrl && (
            <div className={styles.previewSection}>
              <p className={styles.previewTitle}>Preview:</p>
              <img src={previewUrl} alt="New Selection" className={styles.previewImageSmall} />
            </div>
          )}

          <div className={styles.actions}>
            <button 
              className={styles.submitBtn} 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Save Main Banner'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
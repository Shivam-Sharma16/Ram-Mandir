'use client';

import React, { useState, useEffect } from 'react';
import { getContentBySectionKey } from '@/src/lib/cms';
import { uploadHeroImage } from '@/src/lib/storage';
import styles from './HeroBannerAdmin.module.css';
import { FiUploadCloud, FiImage, FiCheckCircle } from 'react-icons/fi';

export default function HeroBannerAdmin() {
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch the active image on load
  const fetchCurrentImage = async () => {
    try {
      const records = await getContentBySectionKey('home_hero');
      if (records.length > 0 && records[0].imageUrl) {
        setCurrentImageUrl(records[0].imageUrl);
      }
    } catch (err) {
      console.error("Failed to load current banner image", err);
    }
  };

  useEffect(() => {
    fetchCurrentImage();
  }, []);

  // Handle drag/drop or input selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // Clear previous messages
      setSuccessMsg('');
      setErrorMsg('');
    }
  };

  // Upload to Firebase Storage
  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const publicUrl = await uploadHeroImage(selectedFile);
      setCurrentImageUrl(publicUrl);
      setSuccessMsg('Hero banner updated successfully! The homepage background has changed.');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Manage Hero Banner</h1>
        <p>Upload a new image to dynamically replace the homepage background.</p>
      </header>

      {successMsg && (
        <div className={styles.alertSuccess}>
          <FiCheckCircle className={styles.alertIcon} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className={styles.alertError}>
          {errorMsg}
        </div>
      )}

      <div className={styles.grid}>
        {/* Current Live Image Panel */}
        <div className={styles.panel}>
          <h2>Current Live Banner</h2>
          {currentImageUrl ? (
            <div className={styles.imagePreviewWrapper}>
              <img src={currentImageUrl} alt="Current Hero Banner" className={styles.previewImage} />
            </div>
          ) : (
            <div className={styles.emptyState}>
              <FiImage className={styles.emptyIcon} />
              <p>No custom banner set yet. Theme default is active.</p>
            </div>
          )}
        </div>

        {/* Upload Panel */}
        <div className={styles.panel}>
          <h2>Upload New Banner</h2>
          
          <div className={styles.uploadArea}>
            <input 
              type="file" 
              id="bannerUpload" 
              accept="image/png, image/jpeg, image/webp" 
              className={styles.fileInput}
              onChange={handleFileChange}
            />
            <label htmlFor="bannerUpload" className={styles.uploadLabel}>
              <FiUploadCloud className={styles.uploadIcon} />
              <span className={styles.uploadText}>
                {selectedFile ? selectedFile.name : 'Click or drag image to upload'}
              </span>
              <span className={styles.uploadHint}>Recommended size: 1920x1080px (JPEG/WEBP)</span>
            </label>
          </div>

          {previewUrl && (
            <div className={styles.previewSection}>
              <p className={styles.previewTitle}>Preview (Before Saving):</p>
              <img src={previewUrl} alt="New Selection" className={styles.previewImageSmall} />
            </div>
          )}

          <div className={styles.actions}>
            <button 
              className={styles.submitBtn} 
              onClick={handleUpload} 
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? 'Uploading to Storage...' : 'Save Main Banner'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

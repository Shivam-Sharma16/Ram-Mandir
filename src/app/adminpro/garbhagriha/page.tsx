'use client';

import React, { useState, useEffect } from 'react';
import { getContentBySectionKey, createContent, updateContent, deleteContent, SiteContent } from '@/src/lib/cms';
import { uploadGenericImage } from '@/src/lib/storage';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSave, FiX, FiCheckCircle } from 'react-icons/fi';
import styles from './GarbhagrihaAdmin.module.css';

export default function GarbhagrihaAdmin() {
  const [deities, setDeities] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeity, setEditingDeity] = useState<SiteContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [priority, setPriority] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  // Messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDeities = async () => {
    setLoading(true);
    try {
      const records = await getContentBySectionKey('garbhagriha_deity');
      // Sort by priority ascending
      records.sort((a, b) => {
        const pA = a.additionalData?.priority || 0;
        const pB = b.additionalData?.priority || 0;
        return pA - pB;
      });
      setDeities(records);
    } catch (err) {
      console.error("Failed to load deities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeities();
  }, []);

  const handleOpenForm = (deity?: SiteContent) => {
    if (deity) {
      setEditingDeity(deity);
      setName(deity.title);
      setPriority(deity.additionalData?.priority || 0);
      setExistingImageUrl(deity.imageUrl || '');
      setPreviewUrl(deity.imageUrl || null);
    } else {
      setEditingDeity(null);
      setName('');
      setPriority(deities.length + 1);
      setExistingImageUrl('');
      setPreviewUrl(null);
    }
    setSelectedFile(null);
    setSuccessMsg('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingDeity(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErrorMsg('Deity name is required.');
    if (!selectedFile && !existingImageUrl) return setErrorMsg('An image is required.');

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalImageUrl = existingImageUrl;

      if (selectedFile) {
        finalImageUrl = await uploadGenericImage(selectedFile, 'garbhagriha');
      }

      const payload = {
        sectionKey: 'garbhagriha_deity',
        title: name,
        imageUrl: finalImageUrl,
        additionalData: { priority }
      };

      if (editingDeity && editingDeity.id) {
        await updateContent(editingDeity.id, payload);
        setSuccessMsg('Deity updated successfully!');
      } else {
        await createContent(payload);
        setSuccessMsg('New Deity added successfully!');
      }

      fetchDeities();
      setTimeout(handleCloseForm, 1500); // Close after showing success briefly
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving the deity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to completely remove this Deity card?")) {
      try {
        await deleteContent(id);
        fetchDeities();
        setSuccessMsg('Deity removed successfully!');
      } catch (err) {
        console.error("Error deleting deity", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Garbhagriha Management</h1>
          <p>Dynamically manage the Navgraha and Principal Deities displayed on the homepage.</p>
        </div>
        {!isFormOpen && (
          <button className={styles.primaryBtn} onClick={() => handleOpenForm()}>
            <FiPlus className={styles.btnIcon} /> Add Deity
          </button>
        )}
      </header>

      {successMsg && !isFormOpen && (
        <div className={styles.alertSuccess}>
          <FiCheckCircle className={styles.alertIcon} /> {successMsg}
        </div>
      )}

      {isFormOpen ? (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{editingDeity ? 'Edit Deity Card' : 'Add New Deity Card'}</h2>
            <button className={styles.closeBtn} onClick={handleCloseForm} type="button">
              <FiX />
            </button>
          </div>

          {(errorMsg || successMsg) && (
            <div className={successMsg ? styles.alertSuccess : styles.alertError}>
              {successMsg || errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Deity Name <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g., Shree Ram" 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Priority Order</label>
              <input 
                type="number" 
                value={priority} 
                onChange={(e) => setPriority(parseInt(e.target.value) || 0)} 
                className={styles.input}
              />
              <small className={styles.helpText}>Lower numbers show up first in the grid (1, 2, 3...)</small>
            </div>

            <div className={styles.formGroup}>
              <label>Deity Image <span className={styles.required}>*</span></label>
              <div className={styles.uploadRow}>
                <div className={styles.previewBox}>
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className={styles.previewImg} />
                  ) : (
                    <div className={styles.previewPlaceholder}>
                      <FiImage className={styles.placeholderIcon} />
                      <span>No Image</span>
                    </div>
                  )}
                </div>
                <div className={styles.uploadActions}>
                  <input 
                    type="file" 
                    id="deityUpload" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                  <label htmlFor="deityUpload" className={styles.uploadBtn}>
                    Choose File
                  </label>
                  <p className={styles.fileDetails}>
                    {selectedFile ? selectedFile.name : (existingImageUrl ? 'Current image retained.' : 'Select an image file.')}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={handleCloseForm} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Saving...' : <><FiSave className={styles.btnIcon} /> Save Card</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.loading}>Loading Garbhagriha Data...</div>
          ) : deities.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No Deity cards found. Add one to show on the homepage.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {deities.map(deity => (
                <div key={deity.id} className={styles.deityCard}>
                  <div className={styles.cardPriorityBadge}>#{deity.additionalData?.priority || 0}</div>
                  <div className={styles.cardImageWrapper}>
                    <img src={deity.imageUrl} alt={deity.title} />
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{deity.title}</h3>
                    <div className={styles.cardActions}>
                      <button className={styles.iconBtnEdit} onClick={() => handleOpenForm(deity)} title="Edit">
                        <FiEdit2 />
                      </button>
                      <button className={styles.iconBtnDelete} onClick={() => handleDelete(deity.id)} title="Delete">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

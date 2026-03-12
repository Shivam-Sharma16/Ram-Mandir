'use client';

import React, { useState, useEffect } from 'react';
import { SiteContent, createContent, updateContent } from '@/src/lib/cms';
import styles from './ContentForm.module.css';
import { FiSave, FiX } from 'react-icons/fi';

interface ContentFormProps {
  content?: SiteContent | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ContentForm({ content, onClose, onSave }: ContentFormProps) {
  const [formData, setFormData] = useState<Partial<SiteContent>>({
    sectionKey: '',
    title: '',
    description: '',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (content) {
      setFormData({
        sectionKey: content.sectionKey,
        title: content.title,
        description: content.description || '',
        imageUrl: content.imageUrl || '',
      });
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.sectionKey || !formData.title) {
        throw new Error('Section Key and Title are required');
      }

      if (content?.id) {
        await updateContent(content.id, formData);
      } else {
        await createContent(formData as Omit<SiteContent, 'id' | 'createdAt' | 'updatedAt'>);
      }
      onSave();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formWrapper}>
      <div className={styles.formHeader}>
        <h2>{content ? 'Edit Content Block' : 'Create Content Block'}</h2>
        <button className={styles.closeBtn} onClick={onClose} type="button">
          <FiX />
        </button>
      </div>

      {error && <div className={styles.errorAlert}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="sectionKey">
            Section Key <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="sectionKey"
            name="sectionKey"
            value={formData.sectionKey}
            onChange={handleChange}
            placeholder="e.g., home_hero, about_history"
            disabled={!!content} /* Often you don't want to change key after creation */
            required
            className={styles.input}
          />
          <small className={styles.helpText}>
            Identifier used to fetch this content in the code. Must be unique per section format.
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="title">
            Title <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Display Title"
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description or Details (Markdown/Text)</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter the main content or description here..."
            rows={6}
            className={styles.textarea}
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Saving...' : (
              <>
                <FiSave className={styles.btnIcon} />
                {content ? 'Update Content' : 'Save Content'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getContentBySectionKey, createContent, updateContent, deleteContent, SiteContent } from '@/src/lib/cms';
import { uploadGenericImage } from '@/src/lib/storage';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiCheckCircle, FiImage } from 'react-icons/fi';
import styles from './NewsAdmin.module.css';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    [{ align: [] }],
    [{ color: [] }, { background: [] }],
    ['clean'],
  ],
};

const QUILL_FORMATS = [
  'header', 'bold', 'italic', 'underline', 'strike',
  'list', 'blockquote', 'code-block',
  'link', 'image', 'align', 'color', 'background',
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function NewsAdmin() {
  const [articles, setArticles] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<SiteContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState('Update');
  const [content, setContent] = useState('');
  const [publishDate, setPublishDate] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const records = await getContentBySectionKey('news_article');
      records.sort((a, b) => {
        const dA = a.additionalData?.publishTimestamp || 0;
        const dB = b.additionalData?.publishTimestamp || 0;
        return dB - dA; // newest first
      });
      setArticles(records);
    } catch (err) {
      console.error("Failed to load articles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchArticles(); }, []);

  const handleOpenForm = (article?: SiteContent) => {
    if (article) {
      setEditingArticle(article);
      setTitle(article.title);
      setSlug(article.additionalData?.slug || '');
      setExcerpt(article.description || '');
      setCategory(article.additionalData?.category || 'Update');
      setContent(article.additionalData?.content || '');
      setIsFeatured(article.additionalData?.isFeatured || false);
      setExistingImageUrl(article.imageUrl || '');
      setPreviewUrl(article.imageUrl || null);
      const st = article.additionalData?.publishTimestamp;
      if (st) {
        const d = new Date(st);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setPublishDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setPublishDate('');
      }
    } else {
      setEditingArticle(null);
      setTitle('');
      setSlug('');
      setExcerpt('');
      setCategory('Update');
      setContent('');
      setPublishDate(new Date().toISOString().split('T')[0]);
      setExistingImageUrl('');
      setPreviewUrl(null);
      setIsFeatured(false);
    }
    setSelectedFile(null);
    setSuccessMsg('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingArticle) {
      setSlug(generateSlug(val));
    }
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
    if (!title.trim()) return setErrorMsg('Title is required.');
    if (!slug.trim()) return setErrorMsg('Slug is required.');
    if (!publishDate) return setErrorMsg('Publish date is required.');

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      let finalImageUrl = existingImageUrl;
      if (selectedFile) {
        finalImageUrl = await uploadGenericImage(selectedFile, 'news');
      }

      const publishTimestamp = new Date(publishDate).getTime();

      const payload = {
        sectionKey: 'news_article',
        title,
        description: excerpt,
        imageUrl: finalImageUrl,
        additionalData: {
          slug,
          category,
          content,
          publishTimestamp,
          isFeatured,
        },
      };

      if (editingArticle && editingArticle.id) {
        await updateContent(editingArticle.id, payload);
        setSuccessMsg('Article updated successfully!');
      } else {
        await createContent(payload);
        setSuccessMsg('New article published!');
      }

      fetchArticles();
      setTimeout(handleCloseForm, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving article.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to permanently delete this article?")) {
      try {
        await deleteContent(id);
        fetchArticles();
        setSuccessMsg('Article deleted!');
      } catch (err) {
        console.error("Error deleting article", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>News & Updates</h1>
          <p>Manage articles and announcements displayed on the homepage.</p>
        </div>
        {!isFormOpen && (
          <button className={styles.primaryBtn} onClick={() => handleOpenForm()}>
            <FiPlus className={styles.btnIcon} /> New Article
          </button>
        )}
      </header>

      {successMsg && !isFormOpen && (
        <div className={styles.alertSuccess}>
          <FiCheckCircle /> {successMsg}
        </div>
      )}

      {isFormOpen ? (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
            <button className={styles.closeBtn} onClick={handleCloseForm} type="button"><FiX /></button>
          </div>

          {(errorMsg || successMsg) && (
            <div className={successMsg ? styles.alertSuccess : styles.alertError}>
              {successMsg || errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Title <span className={styles.required}>*</span></label>
              <input type="text" value={title} onChange={(e) => handleTitleChange(e.target.value)} placeholder="Article headline" required className={styles.input} />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Slug <span className={styles.required}>*</span></label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="article-url-slug" required className={styles.input} />
                <small className={styles.helpText}>Auto-generated from title. Edit if needed.</small>
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={styles.input}>
                  <option value="Update">Update</option>
                  <option value="Event">Event</option>
                  <option value="Announcement">Announcement</option>
                  <option value="News">News</option>
                  <option value="Seva">Seva</option>
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Publish Date <span className={styles.required}>*</span></label>
                <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} required className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label>Featured Article</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} id="featuredCheck" style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }} />
                  <label htmlFor="featuredCheck" style={{ fontWeight: 'normal', cursor: 'pointer', margin: 0 }}>Show as featured card</label>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Excerpt / Summary</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary of the article..." className={styles.textarea} />
            </div>

            <div className={styles.formGroup}>
              <label>Featured Image</label>
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
                  <input type="file" id="newsImgUpload" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
                  <label htmlFor="newsImgUpload" className={styles.uploadBtn}>Choose File</label>
                  <p className={styles.fileDetails}>
                    {selectedFile ? selectedFile.name : (existingImageUrl ? 'Current image retained.' : 'Optional cover image.')}
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Article Content (Rich Text / HTML)</label>
              <div className={styles.editorWrap}>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={QUILL_MODULES}
                  formats={QUILL_FORMATS}
                  placeholder="Write your article here... (supports HTML)"
                />
              </div>
              <small className={styles.helpText}>Paste or type HTML directly in the source. Use toolbar for formatting.</small>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={handleCloseForm} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Publishing...' : <><FiSave className={styles.btnIcon} /> Publish Article</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.loading}>Loading articles...</div>
          ) : articles.length === 0 ? (
            <div className={styles.emptyState}><p>No articles yet. Create one to show on the homepage.</p></div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(a => (
                    <tr key={a.id}>
                      <td>{a.imageUrl ? <img src={a.imageUrl} alt="" className={styles.thumbImg} /> : '-'}</td>
                      <td><strong>{a.title}</strong>{a.additionalData?.isFeatured && <span style={{ marginLeft: 6, color: '#D4AF37', fontSize: '0.8rem' }}>★ Featured</span>}</td>
                      <td><span className={styles.slugText}>/{a.additionalData?.slug}</span></td>
                      <td>{a.additionalData?.category}</td>
                      <td>{a.additionalData?.publishTimestamp ? new Date(a.additionalData.publishTimestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}</td>
                      <td>
                        <div className={styles.cardActions}>
                          <button className={styles.iconBtnEdit} onClick={() => handleOpenForm(a)} title="Edit"><FiEdit2 /></button>
                          <button className={styles.iconBtnDelete} onClick={() => handleDelete(a.id)} title="Delete"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

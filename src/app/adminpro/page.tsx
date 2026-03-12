'use client';

import React, { useState, useEffect } from 'react';
import { getContentList, SiteContent, deleteContent } from '@/src/lib/cms';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import styles from './AdminDashboard.module.css';
import ContentForm from '@/src/components/adminpro/ContentForm';

export default function AdminDashboard() {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<SiteContent | null>(null);

  const fetchContents = async () => {
    setLoading(true);
    const data = await getContentList();
    setContents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleCreate = () => {
    setEditingContent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (content: SiteContent) => {
    setEditingContent(content);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to delete this content block?")) {
      await deleteContent(id);
      fetchContents();
    }
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingContent(null);
  };

  const handleSaveSuccess = () => {
    fetchContents();
    handleFormClose();
  };

  if (loading) {
    return <div className={styles.loading}>Loading Dashboard Data...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1>Dashboard Overview</h1>
          <p>Manage dynamic contents of your website</p>
        </div>
        <button className={styles.primaryBtn} onClick={handleCreate}>
          <FiPlus className={styles.btnIcon} /> Add Content Block
        </button>
      </header>

      {isFormOpen ? (
        <div className={styles.formContainer}>
          <ContentForm 
            content={editingContent} 
            onClose={handleFormClose} 
            onSave={handleSaveSuccess} 
          />
        </div>
      ) : (
        <div className={styles.contentTable}>
          {contents.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No content blocks found. Start by adding one.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table>
                <thead>
                  <tr>
                    <th>Section Key</th>
                    <th>Title</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.map((item) => (
                    <tr key={item.id}>
                      <td><span className={styles.badge}>{item.sectionKey}</span></td>
                      <td className={styles.titleCell}>{item.title}</td>
                      <td>
                        <div className={styles.actions}>
                          <button 
                            className={styles.iconBtnEdit}
                            onClick={() => handleEdit(item)}
                            title="Edit"
                          >
                            <FiEdit2 />
                          </button>
                          <button 
                            className={styles.iconBtnDelete}
                            onClick={() => handleDelete(item.id)}
                            title="Delete"
                          >
                            <FiTrash2 />
                          </button>
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

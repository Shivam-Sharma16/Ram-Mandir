'use client';

import React, { useState, useEffect } from 'react';
import { getContentBySectionKey, createContent, updateContent, deleteContent, SiteContent } from '@/src/lib/cms';
import { FiPlus, FiEdit2, FiTrash2, FiSave, FiX, FiCheckCircle } from 'react-icons/fi';
import styles from './PanchangAdmin.module.css';

const MONTHS = [
  { id: 'chaitra', label: 'Chaitra' },
  { id: 'vaishakh', label: 'Vaishakh' },
  { id: 'jyeshtha', label: 'Jyeshtha' },
  { id: 'ashadha', label: 'Ashadha' },
  { id: 'shravan', label: 'Shravan' },
  { id: 'bhadra', label: 'Bhadrapada' },
  { id: 'ashwin', label: 'Ashwin' },
  { id: 'kartik', label: 'Kartik' },
  { id: 'margashirsha', label: 'Margashirsha' },
  { id: 'pausha', label: 'Pausha' },
  { id: 'magha', label: 'Magha' },
  { id: 'phalguna', label: 'Phalguna' },
  { id: 'chaitra_krishna', label: 'Chaitra (Krishna Paksh)' },
];

export default function PanchangAdmin() {
  const [entries, setEntries] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<SiteContent | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [monthId, setMonthId] = useState('chaitra');
  const [displayDate, setDisplayDate] = useState('');
  const [tithi, setTithi] = useState('');
  const [festival, setFestival] = useState('');
  const [sortDate, setSortDate] = useState('');
  const [isSpecial, setIsSpecial] = useState(false);

  // Messages
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const records = await getContentBySectionKey('panchang_entry');
      // Sort chronologically by sortDate timestamp
      records.sort((a, b) => {
        const dA = a.additionalData?.sortTimestamp || 0;
        const dB = b.additionalData?.sortTimestamp || 0;
        return dA - dB;
      });
      setEntries(records);
    } catch (err) {
      console.error("Failed to load panchang entries", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleOpenForm = (entry?: SiteContent) => {
    if (entry) {
      setEditingEntry(entry);
      setMonthId(entry.additionalData?.monthId || 'chaitra');
      setDisplayDate(entry.additionalData?.dateStr || '');
      setTithi(entry.additionalData?.tithi || '');
      setFestival(entry.title || '');
      setIsSpecial(entry.additionalData?.isSpecial || false);
      
      const st = entry.additionalData?.sortTimestamp;
      if (st) {
        const d = new Date(st);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        setSortDate(`${yyyy}-${mm}-${dd}`);
      } else {
        setSortDate('');
      }
    } else {
      setEditingEntry(null);
      setMonthId('chaitra');
      setDisplayDate('');
      setTithi('');
      setFestival('');
      setSortDate('');
      setIsSpecial(false);
    }
    setSuccessMsg('');
    setErrorMsg('');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayDate.trim()) return setErrorMsg('Display Date is required.');
    if (!sortDate) return setErrorMsg('Chronological Sorting Date is required.');
    if (!tithi.trim()) return setErrorMsg('Tithi is required.');

    setIsSubmitting(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const sortTimestamp = new Date(sortDate).getTime();

      const payload = {
        sectionKey: 'panchang_entry',
        title: festival,
        additionalData: {
          monthId,
          dateStr: displayDate,
          tithi,
          sortTimestamp,
          isSpecial
        }
      };

      if (editingEntry && editingEntry.id) {
        await updateContent(editingEntry.id, payload);
        setSuccessMsg('Entry updated successfully!');
      } else {
        await createContent(payload);
        setSuccessMsg('New Entry added successfully!');
      }

      fetchEntries();
      setTimeout(handleCloseForm, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred while saving the entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm("Are you sure you want to completely remove this entry?")) {
      try {
        await deleteContent(id);
        fetchEntries();
        setSuccessMsg('Entry removed successfully!');
      } catch (err) {
        console.error("Error deleting entry", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1>Panchang Management</h1>
          <p>Dynamically manage the Hindu calendar entries shown on the homepage.</p>
        </div>
        {!isFormOpen && (
          <button className={styles.primaryBtn} onClick={() => handleOpenForm()}>
            <FiPlus className={styles.btnIcon} /> Add Entry
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
            <h2>{editingEntry ? 'Edit Panchang Entry' : 'Add New Panchang Entry'}</h2>
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
              <label>Hindu Month <span className={styles.required}>*</span></label>
              <select 
                value={monthId} 
                onChange={(e) => setMonthId(e.target.value)} 
                className={styles.input}
                required
              >
                {MONTHS.map(m => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Display Date Text <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                value={displayDate} 
                onChange={(e) => setDisplayDate(e.target.value)} 
                placeholder="e.g., 30 Mar 2025" 
                required 
                className={styles.input}
              />
              <small className={styles.helpText}>This is what visitors will see (e.g. "30 Mar 2025" or "Every Monday").</small>
            </div>

            <div className={styles.formGroup}>
              <label>Chronological Sorting Date <span className={styles.required}>*</span></label>
              <input 
                type="date" 
                value={sortDate} 
                onChange={(e) => setSortDate(e.target.value)} 
                required 
                className={styles.input}
              />
              <small className={styles.helpText}>Used ONLY by the system to sort the entries chronologically.</small>
            </div>

            <div className={styles.formGroup}>
              <label>Tithi / Nakshatra <span className={styles.required}>*</span></label>
              <input 
                type="text" 
                value={tithi} 
                onChange={(e) => setTithi(e.target.value)} 
                placeholder="e.g., Pratipada · Ashwini" 
                required 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Festival / Vrat Name</label>
              <input 
                type="text" 
                value={festival} 
                onChange={(e) => setFestival(e.target.value)} 
                placeholder="e.g., Chaitra Navratri Begins" 
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Special Event (Add ★)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="checkbox" 
                  checked={isSpecial} 
                  onChange={(e) => setIsSpecial(e.target.checked)} 
                  id="isSpecialCheck"
                  style={{ width: '1.2rem', height: '1.2rem', cursor: 'pointer' }}
                />
                <label htmlFor="isSpecialCheck" style={{ fontWeight: 'normal', cursor: 'pointer', margin: 0 }}>
                  Mark this tithi/festival as special
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="button" onClick={handleCloseForm} className={styles.cancelBtn}>Cancel</button>
              <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
                {isSubmitting ? 'Saving...' : <><FiSave className={styles.btnIcon} /> Save Entry</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {loading ? (
            <div className={styles.loading}>Loading Panchang Data...</div>
          ) : entries.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No Panchang entries found. Add one to show on the homepage.</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Display Date</th>
                    <th>Tithi</th>
                    <th>Festival</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(entry => (
                    <tr key={entry.id}>
                      <td>
                        {MONTHS.find(m => m.id === entry.additionalData?.monthId)?.label || entry.additionalData?.monthId}
                      </td>
                      <td>{entry.additionalData?.dateStr}</td>
                      <td>{entry.additionalData?.tithi}</td>
                      <td>{entry.title || '-'}</td>
                      <td>
                        <div className={styles.cardActions}>
                          <button className={styles.iconBtnEdit} onClick={() => handleOpenForm(entry)} title="Edit">
                            <FiEdit2 />
                          </button>
                          <button className={styles.iconBtnDelete} onClick={() => handleDelete(entry.id)} title="Delete">
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

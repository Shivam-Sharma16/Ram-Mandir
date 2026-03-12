import React from 'react';
import AdminSidebar from '@/src/components/adminpro/AdminSidebar';
import styles from './AdminLayout.module.css';

export const metadata = {
  title: 'Admin Pro Dashboard - Ram Mandir',
  description: 'Manage dynamic content for the Ram Mandir website',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}

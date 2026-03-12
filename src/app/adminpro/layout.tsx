'use client';

import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/firebase/config';
import { useRouter, usePathname } from 'next/navigation';
import AdminSidebar from '@/src/components/adminpro/AdminSidebar';
import styles from './AdminLayout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
        // If logged in and trying to access login page, redirect to dashboard
        if (pathname === '/adminpro/login') {
          router.push('/adminpro');
        }
      } else {
        setAuthenticated(false);
        // If not logged in and not on login page, redirect to login
        if (pathname !== '/adminpro/login') {
          router.push('/adminpro/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  if (loading) {
    return <div className={styles.loading}>Verifying Authentication...</div>;
  }

  // If on login page, don't show the sidebar layout
  if (pathname === '/adminpro/login') {
    return <>{children}</>;
  }

  return (
    <div className={styles.adminLayout}>
      <AdminSidebar />
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiFileText, FiSettings, FiLogOut } from 'react-icons/fi';
import styles from './AdminSidebar.module.css';

const AdminSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/adminpro', icon: <FiHome /> },
    { name: 'Hero Banner', path: '/adminpro/hero-banner', icon: <FiFileText /> },
    { name: 'Garbhagriha', path: '/adminpro/garbhagriha', icon: <FiFileText /> },
    { name: 'Panchang', path: '/adminpro/panchang', icon: <FiFileText /> },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h2>Admin Pro</h2>
      </div>
      <nav className={styles.nav}>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`${styles.navLink} ${
                  pathname === item.path ? styles.active : ''
                }`}
              >
                <span className={styles.icon}>{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.bottomNav}>
        <Link href="/" className={styles.navLink}>
          <span className={styles.icon}><FiLogOut /></span>
          Exit to Site
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;

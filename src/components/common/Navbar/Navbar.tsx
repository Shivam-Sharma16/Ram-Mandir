'use client';

/**
 * Navbar.tsx
 * Shree Ram Mandir — Sticky Navigation Bar Component
 *
 * Design Language: Matches HomeContent.tsx
 *   - Colors: #3D0408 (deep maroon), #6B0F1A (maroon), #D4AF37 (gold),
 *             #FF6B1A (saffron), #FDF6E3 (cream), #F0D060 (light gold)
 *   - Fonts: Cinzel Decorative (logo), Cinzel (links), Raleway (labels)
 *   - Animations: Smooth transitions, shimmer, glow
 *
 * Usage:
 *   import Navbar from './Navbar';
 *   <Navbar />
 *
 * Ensure your _document.tsx / layout.tsx includes the Google Fonts link:
 * <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700
 *   &family=Cinzel+Decorative:wght@400;700
 *   &family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet"/>
 */

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Navbar.module.css';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

interface NavLink {
  label: string;
  href: string;
}

// ─────────────────────────────────────────────
// NAV LINKS DATA
// ─────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { label: 'Home',       href: '/'          },
  { label: 'Bookings',   href: '/booking'   },
  { label: 'Gallery',    href: '/#navgraha' },
  { label: 'About Us',   href: '/about'     },
  { label: 'Contact Us', href: '/#news'     },
];

// ─────────────────────────────────────────────
// NAVBAR COMPONENT
// ─────────────────────────────────────────────

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  /** Whether the user has scrolled past the hero — activates glassmorphism */
  const [scrolled, setScrolled] = useState<boolean>(false);

  /** Tracks the currently active section for link highlighting */
  const [activeLink, setActiveLink] = useState<string>('/');

  /** Mobile menu open/close state */
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  /** Ref to close mobile menu on outside click */
  const navRef = useRef<HTMLElement>(null);

  // ── Scroll listener: toggle glass style ──────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      if (pathname === '/') {
        // Update active link based on scroll position on home page
        const sections = NAV_LINKS.filter(l => l.href.startsWith('/#')).map((l) => l.href.replace('/#', ''));
        for (let i = sections.length - 1; i >= 0; i--) {
          const el = document.getElementById(sections[i]);
          if (el && window.scrollY >= el.offsetTop - 120) {
            setActiveLink(`/#${sections[i]}`);
            return;
          }
        }
        setActiveLink('/');
      } else {
        setActiveLink(pathname);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial call to set correct state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // ── Close mobile menu on outside click ───────────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [mobileOpen]);

  // ── Smooth scroll handler ────────────────────────────────────────────────
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    setMobileOpen(false);

    // If it's a hash link on the home page
    if (href.startsWith('/#') && pathname === '/') {
      e.preventDefault();
      const targetId = href.replace('/#', '');
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveLink(href);
      }
    } else if (href === '/' && pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setActiveLink('/');
    }
    // Otherwise, let next/link handle the navigation (default behavior)
  };

  return (
    <nav
      ref={navRef}
      className={`${styles.navbar} ${scrolled ? styles.navbarScrolled : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      {/* ── Top decorative border line ─────────────────────────────────── */}
      {/* <div className={styles.topBorder} aria-hidden="true" /> */}

      <div className={styles.navInner}>

        {/* ══════════════════════════════════════════
             LEFT — Logo / Branding
        ══════════════════════════════════════════ */}
        <Link
          href="/"
          className={styles.logo}
          onClick={(e) => handleNavClick(e, '/')}
          aria-label="Shree Ram Mandir — Home"
        >
          {/* Decorative Om symbol */}
          <span className={styles.logoOm} aria-hidden="true">ॐ</span>

          {/* Temple name text block */}
          <span className={styles.logoTextBlock}>
            <span className={styles.logoMain}>Shree Ram Mandir</span>
      
          </span>
        </Link>

        {/* ══════════════════════════════════════════
             RIGHT — Desktop Navigation Links
        ══════════════════════════════════════════ */}
        <ul className={styles.navLinks} role="list">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className={styles.navItem}>
              <Link
                href={link.href}
                className={`${styles.navLink} ${activeLink === link.href ? styles.navLinkActive : ''}`}
                onClick={(e) => handleNavClick(e, link.href)}
                aria-current={activeLink === link.href ? 'page' : undefined}
              >
                {link.label}
                {/* Animated underline */}
                <span className={styles.linkUnderline} aria-hidden="true" />
              </Link>
            </li>
          ))}

         
        </ul>

        {/* ══════════════════════════════════════════
             Mobile Hamburger Toggle
        ══════════════════════════════════════════ */}
        <button
          className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
          <span className={styles.hamburgerLine} />
        </button>
      </div>

      {/* ══════════════════════════════════════════
           Mobile Dropdown Menu
      ══════════════════════════════════════════ */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!mobileOpen}
      >
        {/* Decorative ornament inside mobile menu */}
        <div className={styles.mobileOrnament} aria-hidden="true">
          <div className={styles.mobileOrnamentLine} />
          <div className={styles.mobileOrnamentDiamond} />
          <div className={styles.mobileOrnamentLineR} />
        </div>

        <ul className={styles.mobileNavLinks} role="list">
          {NAV_LINKS.map((link, i) => (
            <li
              key={link.href}
              className={styles.mobileNavItem}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <Link
                href={link.href}
                className={`${styles.mobileNavLink} ${activeLink === link.href ? styles.mobileNavLinkActive : ''}`}
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        
      </div>
    </nav>
  );
};

export default Navbar;
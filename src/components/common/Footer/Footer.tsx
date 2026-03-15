'use client';

/**
 * Footer.tsx
 * Shree Ram Mandir — Complete Footer Component
 *
 * Design Language: Matches HomeContent.tsx & Navbar.tsx
 *   - Colors: #3D0408, #6B0F1A, #D4AF37, #FF6B1A, #F0D060, #FDF6E3
 *   - Fonts: Cinzel Decorative (logo), Cinzel (headings), Raleway (labels),
 *            Cormorant Garamond (body text)
 *   - Animations: shimmer, float, glowPulse, borderShimmer
 *
 * Usage:
 *   import Footer from './Footer';
 *   <Footer />
 */

import React, { useState } from 'react';
import styles from './Footer.module.css';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

interface ContactItem {
  icon: string;
  label: string;
  value: string;
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Quick Links',
    links: [
      { label: 'Home',              href: '#hero'      },
      { label: 'Darshan Timings',   href: '#info'      },
      { label: 'Special Poojas',    href: '#info'      },
      { label: 'Panchang 2025–26',  href: '#panchang'  },
      { label: 'Gallery',           href: '#navgraha'  },
      { label: 'Latest News',       href: '#news'      },
    ],
  },
  {
    heading: 'Seva & Offerings',
    links: [
      { label: 'Donate Online',         href: '#donation' },
      { label: 'Book Darshan Slot',      href: '#donation' },
      { label: 'Pooja Booking',          href: '#donation' },
      { label: 'Annadaan Seva',          href: '#news'     },
      { label: 'Veda Pathshala',         href: '#news'     },
      { label: 'Dharamshala Booking',    href: '#news'     },
    ],
  },
  {
    heading: 'Pilgrimage',
    links: [
      { label: 'How to Reach',          href: '#' },
      { label: 'Shuttle Service',       href: '#' },
      { label: 'Nearby Temples',        href: '#' },
      { label: 'Jaipur Travel Guide',   href: '#' },
      { label: 'Ram Navami Package',    href: '#' },
      { label: 'Accessibility Info',    href: '#' },
    ],
  },
];

const SOCIAL_LINKS: SocialLink[] = [
  { icon: '📘', label: 'Facebook',  href: '#' },
  { icon: '📸', label: 'Instagram', href: '#' },
  { icon: '🐦', label: 'Twitter',   href: '#' },
  { icon: '▶️',  label: 'YouTube',   href: '#' },
  { icon: '💬', label: 'WhatsApp',  href: '#' },
];

const CONTACT_ITEMS: ContactItem[] = [
  { icon: '📍', label: 'Address',   value: 'Adarsh Nagar, Govind Marg, Jaipur – 302004, Rajasthan' },
  { icon: '📞', label: 'Helpline',  value: '1800-XXX-XXXX (Toll Free)' },
  { icon: '✉️',  label: 'Email',    value: 'info@shreeram.mandir.gov.in' },
  { icon: '🕐', label: 'Darshan',   value: 'Open Daily · 5:00 AM – 10:00 PM' },
];

const BOTTOM_LINKS: FooterLink[] = [
  { label: 'Privacy Policy',    href: '#' },
  { label: 'Terms of Use',      href: '#' },
  { label: 'RTI',               href: '#' },
  { label: 'Accessibility',     href: '#' },
  { label: 'Sitemap',           href: '#' },
];

// ─────────────────────────────────────────────
// HELPER — Ornament divider (reused from HomeContent pattern)
// ─────────────────────────────────────────────

const Ornament: React.FC<{ light?: boolean }> = ({ light = false }) => (
  <div className={styles.ornament}>
    <div className={light ? styles.ornamentLineDark : styles.ornamentLine} />
    <div className={styles.ornamentDiamond} />
    <div className={light ? styles.ornamentLineDarkR : styles.ornamentLineR} />
  </div>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const Footer: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === '#') return;
    e.preventDefault();
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className={styles.footer}>

      {/* ── Top decorative border (matches Navbar & section borders) ─── */}
      <div className={styles.topBorder} aria-hidden="true" />



      {/* ══════════════════════════════════════════
           MAIN FOOTER BODY
      ══════════════════════════════════════════ */}
      <div className={styles.footerBody}>
        <div className={styles.footerGrid}>

          {/* ── Column 0: Brand / About ──────────────────────────────── */}
          <div className={styles.brandCol}>
            {/* Logo — mirrors Navbar logo */}
            <div className={styles.footerLogo}>
              <span className={styles.footerLogoOm}>ॐ</span>
              <span className={styles.footerLogoTextBlock}>
                <span className={styles.footerLogoMain}>Shree Ram Mandir</span>
                <span className={styles.footerLogoSub}>Jaipur · जयपुर</span>
              </span>
            </div>

            <Ornament />

            <p className={styles.brandDesc}>
              Located in Adarsh Nagar, Jaipur, this divine temple stands as
              an eternal beacon of Dharma, devotion, and the timeless
              spirit of Sanatan traditions since its establishment in 1955.
            </p>

            {/* Sanskrit verse */}
            <p className={styles.brandVerse}>
              "रामो विग्रहवान् धर्मः"
            </p>
            <p className={styles.brandVerseEn}>
              — Ram is the embodiment of Dharma
            </p>

            {/* Social icons */}
            <div className={styles.socialRow}>
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={styles.socialIcon}
                  aria-label={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* ── Columns 1–3: Link columns ────────────────────────────── */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading} className={styles.linkCol}>
              <h3 className={styles.colHeading}>{col.heading}</h3>
              <div className={styles.colUnderline} aria-hidden="true" />
              <ul className={styles.linkList}>
                {col.links.map((link) => (
                  <li key={link.label} className={styles.linkItem}>
                    <a
                      href={link.href}
                      className={styles.footerLink}
                      onClick={(e) => handleNavClick(e, link.href)}
                    >
                      <span className={styles.linkArrow} aria-hidden="true">›</span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Column 4: Contact ────────────────────────────────────── */}
          <div className={styles.contactCol}>
            <h3 className={styles.colHeading}>Contact Us</h3>
            <div className={styles.colUnderline} aria-hidden="true" />
            <ul className={styles.contactList}>
              {CONTACT_ITEMS.map((item) => (
                <li key={item.label} className={styles.contactItem}>
                  <span className={styles.contactIcon}>{item.icon}</span>
                  <div>
                    <span className={styles.contactLabel}>{item.label}</span>
                    <p className={styles.contactValue}>{item.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
           BOTTOM BAR
      ══════════════════════════════════════════ */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomBarInner}>

          {/* Copyright */}
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Shree Ram Mandir Pranyas – Shree Sanatan Dharm Sabha.
            All rights reserved.
          </p>

          {/* Bottom links */}
          <nav className={styles.bottomLinks} aria-label="Footer policy links">
            {BOTTOM_LINKS.map((link, i) => (
              <React.Fragment key={link.label}>
                <a href={link.href} className={styles.bottomLink}>
                  {link.label}
                </a>
                {i < BOTTOM_LINKS.length - 1 && (
                  <span className={styles.bottomSep} aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          {/* "Made with devotion" tag */}
          <p className={styles.madWith}>
            🙏 Jai Shree Ram
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;
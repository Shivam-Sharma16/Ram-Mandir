"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaArrowUp } from "react-icons/fa";
import styles from "./Footer.module.css"

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Info Section */}
        <div className={styles.section}>
          <h3>Shree Ram Mandir</h3>
          <p className={styles.description}>Ayodhya, Uttar Pradesh, India</p>
          <div className={styles.socialContainer}>
            <FaFacebook className={styles.socialIcon} />
            <FaInstagram className={styles.socialIcon} />
            <FaYoutube className={styles.socialIcon} />
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.section}>
          <h4>Quick Links</h4>
          <div className={styles.linkList}>
            <Link href="/gallery" className={styles.link}>Gallery</Link>
            <Link href="/about" className={styles.link}>History</Link>
            <Link href="/contact" className={styles.link}>Contact</Link>
          </div>
        </div>

        {/* Action Section */}
        <div className={styles.section}>
          <h4>Support</h4>
          <Link href="/donate" className="btn btn-primary">Donation</Link>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <p className={styles.copyright}>© 2026 Shree Ram Mandir. All Rights Reserved.</p>
        <button onClick={scrollToTop} className={styles.backToTop}>
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
}
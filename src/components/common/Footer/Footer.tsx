"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaFacebook, FaInstagram, FaYoutube, FaArrowUp } from "react-icons/fa";
import styles from "./Footer.module.css"

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Info Section */}
        <div className="footer-section">
          <h3>Shree Ram Mandir</h3>
          <p>Ayodhya, Uttar Pradesh, India</p>
          <div className="social-icons">
            <FaFacebook /> <FaInstagram /> <FaYoutube />
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link href="/gallery">Gallery</Link>
          <Link href="/about">History</Link>
          <Link href="/contact">Contact</Link>
        </div>

        {/* Action Section */}
        <div className="footer-section">
          <h4>Support</h4>
          <Link href="/donate" className="btn btn-primary">Donation</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Shree Ram Mandir. All Rights Reserved.</p>
        <button onClick={scrollToTop} className="back-to-top">
          <FaArrowUp />
        </button>
      </div>
    </footer>
  );
}
'use client';

/**
 * Contact.tsx
 * Shree Ram Mandir — Contact Us Page
 * Two-column layout: contact query form + info cards (phone, email, address, timings)
 */

import React, { useState } from 'react';
import styles from './Contact.module.css';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const Contact: React.FC = () => {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = 'Please enter your name';
    if (!form.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (form.phone && !/^[0-9+\-() ]{7,15}$/.test(form.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!form.subject) newErrors.subject = 'Please select a subject';
    if (!form.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // In production, this would send the form data to a backend API
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setErrors({});
    setSubmitted(false);
  };

  return (
    <div className={styles.wrapper}>

      {/* ══════════════════════════════════════════
           1. HERO BANNER
      ══════════════════════════════════════════ */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroDecor}>
          <div className={`${styles.heroCircle} ${styles.heroCircle1}`} />
          <div className={`${styles.heroCircle} ${styles.heroCircle2}`} />
        </div>
        <div className={styles.heroFade} />

        <div className={styles.heroContent}>
          <span className={styles.heroOm}>🙏</span>
          <p className={styles.heroSuptitle}>We&apos;d Love to Hear From You</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleSpan}>Contact Us</span>
          </h1>
          <div className={styles.heroDivider}>
            <div className={styles.heroDivLine} />
            <div className={styles.heroDivGem} />
            <div className={styles.heroDivGemS} />
            <div className={styles.heroDivGem} />
            <div className={styles.heroDivLineR} />
          </div>
          <p className={styles.heroSubtitle}>
            Reach out for enquiries, bookings, or spiritual guidance — we are here to serve
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
           2. MAIN CONTENT — Form + Info
      ══════════════════════════════════════════ */}
      <section className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTag}>Get in Touch</p>
          <div className={styles.ornament}>
            <div className={styles.ornamentLine} />
            <div className={styles.ornamentDiamond} />
            <div className={styles.ornamentLineR} />
          </div>
          <h2 className={styles.sectionHeading}>Send Us a Message</h2>
          <p className={styles.sectionSubtext}>
            Whether you have a query about temple services, venue bookings, or need spiritual assistance —
            our team is always ready to help.
          </p>
        </div>

        <div className={styles.contentGrid}>

          {/* ── LEFT: Contact Form ────────────────── */}
          <div className={styles.formCard}>
            {submitted ? (
              /* Success state */
              <div className={styles.successMessage}>
                <span className={styles.successIcon}>✅</span>
                <h3 className={styles.successTitle}>Message Sent Successfully!</h3>
                <p className={styles.successText}>
                  Thank you for reaching out, <strong>{form.name}</strong>. Our temple office team
                  will review your message and respond within 24–48 hours. Jai Shree Ram! 🙏
                </p>
                <button className={styles.successBtn} onClick={handleReset}>
                  Send Another Message
                </button>
              </div>
            ) : (
              /* Form */
              <>
                <h3 className={styles.formTitle}>📝 Enquiry Form</h3>
                <p className={styles.formSubtitle}>
                  Fill out the form below and we&apos;ll get back to you at the earliest.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name & Email row */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-name" className={styles.formLabel}>
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Sharma"
                        className={`${styles.formInput} ${errors.name ? styles.formInputError : ''}`}
                      />
                      {errors.name && <p className={styles.formError}>{errors.name}</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-email" className={styles.formLabel}>
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="e.g. name@example.com"
                        className={`${styles.formInput} ${errors.email ? styles.formInputError : ''}`}
                      />
                      {errors.email && <p className={styles.formError}>{errors.email}</p>}
                    </div>
                  </div>

                  {/* Phone & Subject row */}
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-phone" className={styles.formLabel}>
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="e.g. +91 98765 43210"
                        className={`${styles.formInput} ${errors.phone ? styles.formInputError : ''}`}
                      />
                      {errors.phone && <p className={styles.formError}>{errors.phone}</p>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-subject" className={styles.formLabel}>
                        Subject *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`${styles.formSelect} ${errors.subject ? styles.formInputError : ''}`}
                      >
                        <option value="">Select a subject…</option>
                        <option value="general">General Enquiry</option>
                        <option value="booking">Venue Booking</option>
                        <option value="pooja">Pooja / Ritual Booking</option>
                        <option value="donation">Donation / Seva</option>
                        <option value="volunteer">Volunteer / Seva Opportunity</option>
                        <option value="complaint">Complaint / Feedback</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.subject && <p className={styles.formError}>{errors.subject}</p>}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-message" className={styles.formLabel}>
                      Your Message *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Please describe your query, booking request, or any question you have…"
                      className={`${styles.formTextarea} ${errors.message ? styles.formInputError : ''}`}
                      rows={5}
                    />
                    {errors.message && <p className={styles.formError}>{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <button type="submit" className={styles.formSubmit}>
                    <span className={styles.formSubmitText}>Send Message</span>
                    <span className={styles.formSubmitIcon}>→</span>
                  </button>
                </form>
              </>
            )}
          </div>


          {/* ── RIGHT: Info Cards ─────────────────── */}
          <div className={styles.infoPanel}>

            {/* Phone / Helpline */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIconWrap}>
                  <span className={styles.infoIconEmoji}>📞</span>
                </div>
                <div>
                  <h3 className={styles.infoCardTitle}>Phone & Helpline</h3>
                  <p className={styles.infoCardSubtitle}>Speak to Us Directly</p>
                </div>
              </div>
              <div className={styles.infoCardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>📱</span>
                  <div>
                    <span className={styles.infoRowLabel}>Main Office</span>
                    <span className={`${styles.infoRowValue} ${styles.infoRowValueHighlight}`}>
                      +91 98765 43210
                    </span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>☎️</span>
                  <div>
                    <span className={styles.infoRowLabel}>Toll-Free Helpline</span>
                    <span className={`${styles.infoRowValue} ${styles.infoRowValueHighlight}`}>
                      1800-XXX-XXXX
                    </span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>📲</span>
                  <div>
                    <span className={styles.infoRowLabel}>WhatsApp</span>
                    <span className={styles.infoRowValue}>+91 98765 43211</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIconWrap}>
                  <span className={styles.infoIconEmoji}>📧</span>
                </div>
                <div>
                  <h3 className={styles.infoCardTitle}>Email</h3>
                  <p className={styles.infoCardSubtitle}>Write to Us</p>
                </div>
              </div>
              <div className={styles.infoCardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>✉️</span>
                  <div>
                    <span className={styles.infoRowLabel}>General Enquiries</span>
                    <span className={styles.infoRowValue}>info@shreerammandir.org</span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>🏛️</span>
                  <div>
                    <span className={styles.infoRowLabel}>Booking & Reservations</span>
                    <span className={styles.infoRowValue}>booking@shreerammandir.org</span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>🙏</span>
                  <div>
                    <span className={styles.infoRowLabel}>Donation & Seva</span>
                    <span className={styles.infoRowValue}>seva@shreerammandir.org</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Office Timings */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIconWrap}>
                  <span className={styles.infoIconEmoji}>🕐</span>
                </div>
                <div>
                  <h3 className={styles.infoCardTitle}>Office Timings</h3>
                  <p className={styles.infoCardSubtitle}>When to Visit or Call</p>
                </div>
              </div>
              <div className={styles.infoCardBody}>
                <div className={styles.timingsGrid}>
                  <div className={styles.timingSlot}>
                    <span className={styles.timingDay}>Mon – Fri</span>
                    <span className={styles.timingHours}>9:00 AM – 6:00 PM</span>
                  </div>
                  <div className={styles.timingSlot}>
                    <span className={styles.timingDay}>Saturday</span>
                    <span className={styles.timingHours}>9:00 AM – 2:00 PM</span>
                  </div>
                  <div className={styles.timingSlot}>
                    <span className={styles.timingDay}>Sunday</span>
                    <span className={styles.timingHours}>Closed (Temple Open)</span>
                  </div>
                  <div className={styles.timingSlot}>
                    <span className={styles.timingDay}>Festivals</span>
                    <span className={styles.timingHours}>Extended Hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className={styles.infoCard}>
              <div className={styles.infoCardHeader}>
                <div className={styles.infoIconWrap}>
                  <span className={styles.infoIconEmoji}>📍</span>
                </div>
                <div>
                  <h3 className={styles.infoCardTitle}>Temple Address</h3>
                  <p className={styles.infoCardSubtitle}>Visit Us</p>
                </div>
              </div>
              <div className={styles.infoCardBody}>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>🏛️</span>
                  <div>
                    <span className={styles.infoRowLabel}>Address</span>
                    <span className={styles.infoRowValue}>
                      Shree Ram Mandir Complex,<br />
                      Near Saryu Ghat, Ayodhya,<br />
                      Uttar Pradesh – 224123, India
                    </span>
                  </div>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoRowIcon}>🗺️</span>
                  <div>
                    <span className={styles.infoRowLabel}>Nearest Landmark</span>
                    <span className={styles.infoRowValue}>
                      Saryu River Ghat &amp; Hanuman Garhi
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
           3. MAP / LOCATION SECTION
      ══════════════════════════════════════════ */}
      <section className={styles.mapSection}>
        <div className={styles.mapContent}>
          <div className={styles.sectionHeader}>
            <p className={styles.sectionTag}>Find Us</p>
            <div className={styles.ornament}>
              <div className={styles.ornamentLineDark} />
              <div className={styles.ornamentDiamond} />
              <div className={styles.ornamentLineDarkR} />
            </div>
            <h2 className={`${styles.sectionHeading} ${styles.sectionHeadingLight}`}>
              Our Location
            </h2>
            <p className={`${styles.sectionSubtext} ${styles.sectionSubtextLight}`}>
              Located in the sacred city of Ayodhya, on the banks of the holy River Saryu.
            </p>
          </div>

          <div className={styles.mapGrid}>
            {/* Map placeholder */}
            <div className={styles.mapPlaceholder}>
              <span className={styles.mapPlaceholderIcon}>🗺️</span>
              <span className={styles.mapPlaceholderText}>Temple Location Map</span>
            </div>

            {/* Location details */}
            <div className={styles.mapInfo}>
              <h3 className={styles.mapInfoTitle}>How to Reach Shree Ram Mandir</h3>
              <p className={styles.mapInfoText}>
                The temple is situated in the heart of Ayodhya, easily accessible by road, rail,
                and air. The holy city welcomes millions of devotees every year with open arms
                and divine blessings.
              </p>
              <div className={styles.mapDetails}>
                <div className={styles.mapDetailItem}>
                  <span className={styles.mapDetailIcon}>✈️</span>
                  <div>
                    <span className={styles.mapDetailLabel}>By Air</span>
                    <span className={styles.mapDetailValue}>
                      Maharishi Valmiki International Airport, Ayodhya (10 km)
                    </span>
                  </div>
                </div>
                <div className={styles.mapDetailItem}>
                  <span className={styles.mapDetailIcon}>🚂</span>
                  <div>
                    <span className={styles.mapDetailLabel}>By Train</span>
                    <span className={styles.mapDetailValue}>
                      Ayodhya Dham Junction Railway Station (3 km)
                    </span>
                  </div>
                </div>
                <div className={styles.mapDetailItem}>
                  <span className={styles.mapDetailIcon}>🚗</span>
                  <div>
                    <span className={styles.mapDetailLabel}>By Road</span>
                    <span className={styles.mapDetailValue}>
                      Well-connected via NH-27 • Free shuttle from station
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;

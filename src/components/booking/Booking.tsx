'use client';

/**
 * Booking.tsx
 * Shree Ram Mandir — Venue Booking Page
 * Commercial facilities available for booking at the temple complex.
 *
 * 5 Venues:
 *   1. Shiv Har Milap Bhawan (Marriage Garden)
 *   2. Parmanand Bhawan (Event Hall)
 *   3. Satsang Hall
 *   4. Main Mandir Hall
 *   5. Shivalay (Shashtraghat)
 */

import React, { useState, useEffect, useRef } from 'react';
import styles from './Booking.module.css';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

interface Highlight {
  icon: string;
  label: string;
  value: string;
}

interface Venue {
  id: string;
  icon: string;
  name: string;
  tagline: string;
  features: { icon: string; text: string }[];
  description: string;
  highlights: Highlight[];
}

// ─────────────────────────────────────────────
// VENUES DATA
// ─────────────────────────────────────────────

const VENUES: Venue[] = [
  {
    id: 'shiv-har-milap',
    icon: '🏛️',
    name: 'Shiv Har Milap Bhawan',
    tagline: 'Grand marriage garden & banquet complex for weddings and large celebrations',
    features: [
      { icon: '🏠', text: '14 Rooms' },
      { icon: '🌿', text: 'Big Ground' },
      { icon: '🎪', text: 'Banquet Hall' },
      { icon: '💒', text: 'Wedding Venue' },
    ],
    description:
      '<strong>Shiv Har Milap Bhawan</strong> is the premier marriage garden of the temple complex, designed to host grand weddings and large-scale celebrations with divine blessings. The sprawling complex features <strong>14 well-furnished rooms</strong> that provide comfortable accommodation for families and guests. The <strong>expansive open ground</strong> is perfect for traditional wedding ceremonies, baraat processions, and outdoor receptions under the stars. A magnificent <strong>banquet hall</strong> with elegant interiors accommodates large gatherings for reception dinners and family functions. The entire complex is adorned with spiritual motifs, lush greenery, and ambient lighting to create an atmosphere that blends sacred tradition with modern comfort.',
    highlights: [
      { icon: '🏠', label: 'Accommodation', value: '14 fully-furnished rooms with attached washrooms' },
      { icon: '🌳', label: 'Open Ground', value: 'Spacious lawns for baraat, mandap & outdoor events' },
      { icon: '🏰', label: 'Banquet Hall', value: 'AC hall for receptions and indoor gatherings' },
      { icon: '🚗', label: 'Parking', value: 'Dedicated parking area for 100+ vehicles' },
      { icon: '🍽️', label: 'Kitchen', value: 'Fully-equipped community kitchen for bhandara' },
      { icon: '⚡', label: 'Amenities', value: '24/7 power backup, water supply & security' },
    ],
  },
  {
    id: 'parmanand-bhawan',
    icon: '🕌',
    name: 'Parmanand Bhawan',
    tagline: 'Elegant kota stone-floored hall with beautiful dome covering for religious events',
    features: [
      { icon: '🏠', text: '3 Rooms' },
      { icon: '🪨', text: 'Kota Stone' },
      { icon: '🕍', text: 'Dome Covered' },
      { icon: '🙏', text: 'Religious Events' },
    ],
    description:
      '<strong>Parmanand Bhawan</strong> is an elegantly constructed hall that embodies traditional Indian craftsmanship at its finest. Completely floored with premium <strong>Kota stone</strong> — known for its natural cooling properties and timeless beauty — the hall stays naturally cool even during the warmest months. The stunning <strong>dome covering</strong> provides an architectural grandeur reminiscent of classical temple design, creating a spiritually uplifiting ambiance. With <strong>3 well-appointed rooms</strong>, the bhawan is ideal for intimate religious gatherings, family prayer sessions, havan ceremonies, and community events that require a serene and sacred environment.',
    highlights: [
      { icon: '🪨', label: 'Flooring', value: 'Complete premium Kota stone — naturally cool & elegant' },
      { icon: '🕍', label: 'Architecture', value: 'Beautiful dome covering with traditional design' },
      { icon: '🏠', label: 'Rooms', value: '3 attached rooms for preparation & stay' },
      { icon: '🌡️', label: 'Climate', value: 'Naturally cool interiors — comfortable year-round' },
      { icon: '🔊', label: 'Sound System', value: 'Built-in audio setup for katha & bhajans' },
      { icon: '🪔', label: 'Ideal For', value: 'Havans, prayer meets, small weddings & satyanarayan katha' },
    ],
  },
  {
    id: 'satsang-hall',
    icon: '📿',
    name: 'Satsang Hall',
    tagline: 'Dedicated space for spiritual discourses, bhajan sandhyas, and devotional gatherings',
    features: [
      { icon: '🎵', text: 'Bhajan Sandhya' },
      { icon: '📖', text: 'Katha Events' },
      { icon: '🧘', text: 'Meditation' },
      { icon: '👥', text: 'Community' },
    ],
    description:
      'The <strong>Satsang Hall</strong> is a sacred space dedicated to spiritual upliftment through devotional gatherings, bhajan sandhyas, and religious discourses. Designed with spiritual acoustics in mind, the hall provides an immersive experience for <strong>satsang</strong> (holy congregation), where devotees come together to chant the divine names, listen to spiritual teachings, and engage in collective meditation. The hall regularly hosts <strong>Bhagwat Katha</strong>, <strong>Ram Katha</strong>, and various <strong>bhajan sandhya</strong> programs featuring renowned artists and spiritual speakers. It serves as the spiritual heart of the community, fostering devotion and togetherness among all devotees.',
    highlights: [
      { icon: '🎤', label: 'Events', value: 'Bhajan sandhyas, Ram Katha, Bhagwat saptah' },
      { icon: '🧘', label: 'Activities', value: 'Group meditation, chanting & yoga sessions' },
      { icon: '📖', label: 'Discourses', value: 'Regular spiritual talks by visiting saints' },
      { icon: '🔊', label: 'Acoustics', value: 'Purpose-built for devotional music & recitation' },
      { icon: '👥', label: 'Capacity', value: 'Spacious seating for large congregations' },
      { icon: '❄️', label: 'Comfort', value: 'Well-ventilated with fans & cooling arrangement' },
    ],
  },
  {
    id: 'main-mandir-hall',
    icon: '🚩',
    name: 'Main Mandir Hall',
    tagline: 'The principal temple hall for grand religious ceremonies and sacred celebrations',
    features: [
      { icon: '🙏', text: 'Main Pooja' },
      { icon: '🎉', text: 'Festivals' },
      { icon: '🪔', text: 'Aarti' },
      { icon: '📿', text: 'Ceremonies' },
    ],
    description:
      'The <strong>Main Mandir Hall</strong> is the central sanctum of the temple complex where the most sacred and grand religious ceremonies take place. This is the primary worship space where daily <strong>aarti</strong>, festival celebrations, and special poojas are conducted with traditional Vedic rituals. The hall is adorned with beautiful idols of the deities, intricate carvings, and sacred symbolism. During major festivals like <strong>Ram Navami</strong>, <strong>Diwali</strong>, <strong>Navratri</strong>, and <strong>Maha Shivratri</strong>, the hall transforms into a spectacular venue with elaborate decorations, flower arrangements, and divine illumination. It can be reserved for special <strong>satyanarayan katha</strong>, <strong>mundan</strong>, <strong>jaap</strong>, and other sacred ceremonies.',
    highlights: [
      { icon: '🪔', label: 'Daily Worship', value: 'Mangala Aarti, Bhog Aarti, Sandhya & Shayan Aarti' },
      { icon: '🎉', label: 'Festivals', value: 'Ram Navami, Diwali, Navratri & Maha Shivratri' },
      { icon: '🕉️', label: 'Ceremonies', value: 'Satyanarayan Katha, Mundan, Jaap & Havan' },
      { icon: '🏛️', label: 'Architecture', value: 'Traditional Nagara-style with sacred carvings' },
      { icon: '🌸', label: 'Decoration', value: 'Seasonal flower & light decorations for events' },
      { icon: '📿', label: 'Special Poojas', value: 'Rudrabhishek, Sundar Kand Path & Navgraha Shanti' },
    ],
  },
  {
    id: 'shivalay',
    icon: '🔱',
    name: 'Shivalay',
    tagline: 'Sacred Shiva shrine dedicated to Shashtraghat rituals and Shiva worship',
    features: [
      { icon: '🔱', text: 'Shiva Pooja' },
      { icon: '💧', text: 'Abhishek' },
      { icon: '📜', text: 'Shashtraghat' },
      { icon: '🕉️', text: 'Sacred Rites' },
    ],
    description:
      'The <strong>Shivalay</strong> is a revered shrine dedicated to Lord Shiva, specifically designed for <strong>Shashtraghat</strong> rituals and traditional Shiva worship. This sacred space serves as the focal point for devotees seeking the blessings of Mahadev through time-honoured Vedic practices. The Shivalay features a beautiful <strong>Shivling</strong> enshrined in the traditional manner, with proper arrangements for <strong>Rudrabhishek</strong> (sacred bathing of the Shivling), <strong>Jalabhishek</strong> (water offering), and various other forms of Shiva worship. The peaceful atmosphere, combined with the rhythmic chanting of <strong>Om Namah Shivaya</strong>, creates a profoundly meditative experience. It is especially vibrant during <strong>Shravan</strong> month and <strong>Maha Shivratri</strong>.',
    highlights: [
      { icon: '🔱', label: 'Main Deity', value: 'Sacred Shivling with Nandi and Trishul' },
      { icon: '💧', label: 'Abhishek', value: 'Rudrabhishek, Jalabhishek & Panchamrit offerings' },
      { icon: '📜', label: 'Shashtraghat', value: 'Traditional scripturally-guided sacred rituals' },
      { icon: '📿', label: 'Chanting', value: 'Om Namah Shivaya jaap & Shiv Chalisa' },
      { icon: '📅', label: 'Special Days', value: 'Shravan Somvar, Maha Shivratri & Pradosh Vrat' },
      { icon: '🕯️', label: 'Atmosphere', value: 'Serene, meditative environment with incense & bells' },
    ],
  },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const Booking: React.FC = () => {
  const [expandedVenue, setExpandedVenue] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Intersection observer for fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const cards = document.querySelectorAll<HTMLElement>('[data-booking-fadein="true"]');
    cards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const toggleVenue = (id: string) => {
    setExpandedVenue((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.wrapper}>

      {/* ══════════════════════════════════════════
           1. HERO BANNER
      ══════════════════════════════════════════ */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />

        {/* Decorative circles */}
        <div className={styles.heroDecor}>
          <div className={`${styles.heroCircle} ${styles.heroCircle1}`} />
          <div className={`${styles.heroCircle} ${styles.heroCircle2}`} />
          <div className={`${styles.heroCircle} ${styles.heroCircle3}`} />
        </div>

        <div className={styles.heroFade} />

        <div className={styles.heroContent}>
          <span className={styles.heroOm}>ॐ</span>
          <p className={styles.heroSuptitle}>Temple Venue Booking</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleSpan}>Book Our Sacred Venues</span>
          </h1>
          <div className={styles.heroDivider}>
            <div className={styles.heroDivLine} />
            <div className={styles.heroDivGem} />
            <div className={styles.heroDivGemS} />
            <div className={styles.heroDivGem} />
            <div className={styles.heroDivLineR} />
          </div>
          <p className={styles.heroSubtitle}>
            Celebrate life's most sacred moments in our divine venues — where tradition meets grace
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════
           2. INTRO
      ══════════════════════════════════════════ */}
      <section className={styles.introSection}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTag}>Sacred Celebrations</p>
          <div className={styles.ornament}>
            <div className={styles.ornamentLine} />
            <div className={styles.ornamentDiamond} />
            <div className={styles.ornamentLineR} />
          </div>
          <h2 className={styles.sectionHeading}>Our Venues</h2>
          <p className={styles.sectionSubtext}>
            From grand weddings to intimate prayer gatherings — our temple complex offers
            beautifully maintained venues blessed with divine energy and spiritual ambiance.
          </p>
        </div>

        <p className={styles.introText}>
          The temple complex provides a range of <strong>sacred venues</strong> for weddings,
          religious ceremonies, community gatherings, and spiritual events. Each venue is
          maintained with the utmost care and reverence, ensuring every occasion is filled
          with <strong>divine blessings</strong> and spiritual grace. Click on any venue below
          to explore its features and offerings.
        </p>
      </section>


      {/* ══════════════════════════════════════════
           3. VENUES GRID
      ══════════════════════════════════════════ */}
      <section className={styles.venuesSection}>
        <div className={styles.venuesGrid}>
          {VENUES.map((venue) => {
            const isExpanded = expandedVenue === venue.id;
            return (
              <div
                key={venue.id}
                ref={(el) => { cardRefs.current[venue.id] = el; }}
                className={`${styles.venueCard} ${isExpanded ? styles.venueCardActive : ''}`}
                onClick={() => toggleVenue(venue.id)}
                data-booking-fadein="true"
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleVenue(venue.id);
                  }
                }}
              >
                {/* Animated top bar */}
                <div className={styles.venueBar} />

                {/* Card header */}
                <div className={styles.venueHeader}>
                  <div className={styles.venueIconWrap}>
                    <span className={styles.venueIcon}>{venue.icon}</span>
                  </div>
                  <h3 className={styles.venueName}>{venue.name}</h3>
                  <p className={styles.venueTagline}>{venue.tagline}</p>

                  {/* Feature pills */}
                  <div className={styles.venueFeatures}>
                    {venue.features.map((f) => (
                      <span key={f.text} className={styles.featurePill}>
                        <span className={styles.featurePillIcon}>{f.icon}</span>
                        {f.text}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expand hint */}
                <div className={styles.venueExpandHint}>
                  {isExpanded ? 'Close Details' : 'View Details'}
                  <span
                    className={`${styles.expandArrow} ${isExpanded ? styles.expandArrowOpen : ''}`}
                  >
                    ▼
                  </span>
                </div>

                {/* Expanded detail panel */}
                <div
                  className={`${styles.venueDetail} ${isExpanded ? styles.venueDetailOpen : ''}`}
                >
                  <div className={styles.detailDivider} />
                  <div
                    className={styles.detailDescription}
                    dangerouslySetInnerHTML={{ __html: venue.description }}
                  />
                  <div className={styles.highlightsGrid}>
                    {venue.highlights.map((h) => (
                      <div key={h.label} className={styles.highlightItem}>
                        <span className={styles.highlightIcon}>{h.icon}</span>
                        <div>
                          <span className={styles.highlightLabel}>{h.label}</span>
                          <span className={styles.highlightValue}>{h.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>


      {/* ══════════════════════════════════════════
           4. CTA / CONTACT SECTION
      ══════════════════════════════════════════ */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <span className={styles.ctaOm}>🙏</span>
          <h2 className={styles.ctaHeading}>Ready to Book a Venue?</h2>
          <p className={styles.ctaText}>
            For venue availability, booking enquiries, and to arrange a visit to our facilities,
            please contact the temple office. Our team will be happy to assist you in planning
            your sacred celebration.
          </p>
          <div className={styles.ctaContactGrid}>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactIcon}>📞</span>
              <div>
                <span className={styles.ctaContactLabel}>Phone</span>
                <span className={styles.ctaContactValue}>Temple Office: 1800-XXX-XXXX</span>
              </div>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactIcon}>📧</span>
              <div>
                <span className={styles.ctaContactLabel}>Email</span>
                <span className={styles.ctaContactValue}>booking@shreerammandir.org</span>
              </div>
            </div>
            <div className={styles.ctaContactItem}>
              <span className={styles.ctaContactIcon}>🕐</span>
              <div>
                <span className={styles.ctaContactLabel}>Office Hours</span>
                <span className={styles.ctaContactValue}>9:00 AM – 6:00 PM (Mon–Sat)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Booking;

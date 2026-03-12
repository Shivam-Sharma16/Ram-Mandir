'use client';

/**
 * HomeContent.tsx
 * Shree Ram Mandir — Complete Homepage Component
 * Converted from shree-ram-mandir.html to React TSX with CSS Modules
 *
 * Usage: Place HomeContent.tsx and HomeContent.module.css in the same folder.
 * Add the Google Fonts link to your _document.tsx or index.html:
 * <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900
 *   &family=Cinzel+Decorative:wght@400;700
 *   &family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400
 *   &family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet"/>
 */

import React, { useEffect, useRef, useState } from 'react';
import styles from './HomeContent.module.css';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

interface Deity {
  name: string;
  graha: string;
  img: string;
  alt: string;
}

interface TimingEntry {
  label: string;
  time: string;
}

interface PoojaEntry {
  name: string;
  desc: string;
}

type BadgeType = 'major' | 'ekadashi' | 'purnima' | 'amavasya';

interface PanchangRow {
  date: string;
  tithi: string;
  festival: string;
  badge: BadgeType;
  significance: string;
}

interface PanchangMonth {
  id: string;
  label: string;
  rows: PanchangRow[];
}

interface AstroInfo {
  icon: string;
  title: string;
  rows: { key: string; val: string }[];
}

interface NewsItem {
  icon: string;
  title: string;
  desc: string;
  date: string;
}

interface Announcement {
  emoji: string;
  title: string;
  body: string;
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const DEITIES: Deity[] = [
  { name: 'Shree Ram',     graha: 'Surya Graha · Sun',      img: 'https://images.unsplash.com/photo-1609946860441-a51ffcf22208?w=400&q=80', alt: 'Lord Ram' },
  { name: 'Mata Sita',     graha: 'Chandra Graha · Moon',   img: 'https://images.unsplash.com/photo-1600697230015-4a35ee88b392?w=400&q=80', alt: 'Goddess Sita' },
  { name: 'Shree Hanuman', graha: 'Mangal Graha · Mars',    img: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400&q=80', alt: 'Lord Hanuman' },
  { name: 'Shree Ganesh',  graha: 'Budh Graha · Mercury',   img: 'https://images.unsplash.com/photo-1567633052-22a2f65e6c05?w=400&q=80', alt: 'Lord Ganesha' },
  { name: 'Shree Shiva',   graha: 'Guru Graha · Jupiter',   img: 'https://images.unsplash.com/photo-1600697229720-e6ace7ae0fe6?w=400&q=80', alt: 'Lord Shiva' },
  { name: 'Mata Durga',    graha: 'Shukra Graha · Venus',   img: 'https://images.unsplash.com/photo-1585506942812-e72b29cef752?w=400&q=80', alt: 'Goddess Durga' },
  { name: 'Shree Vishnu',  graha: 'Shani Graha · Saturn',   img: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&q=80', alt: 'Lord Vishnu' },
  { name: 'Shree Lakshman',graha: 'Rahu / Ketu Graha',      img: 'https://images.unsplash.com/photo-1563452965085-2e77e5bf2607?w=400&q=80', alt: 'Lord Lakshman' },
];

const TIMINGS: TimingEntry[] = [
  { label: 'Mangala Aarti',     time: '5:00 AM' },
  { label: 'Shringar Darshan',  time: '6:00 – 7:30 AM' },
  { label: 'Morning Darshan',   time: '8:00 – 11:30 AM' },
  { label: 'Bhog Aarti',        time: '12:00 PM' },
  { label: 'Afternoon Darshan', time: '2:00 – 5:00 PM' },
  { label: 'Sandhya Aarti',     time: '6:30 PM' },
  { label: 'Shayan Aarti',      time: '9:00 PM' },
];

const POOJAS: PoojaEntry[] = [
  { name: 'Rudrabhishek',        desc: 'Mondays, dedicated to Lord Shiva Parivar' },
  { name: 'Sundar Kand Path',    desc: 'Tuesdays & Saturdays' },
  { name: 'Ram Navami Mahotsav', desc: 'Grand 9-day celebration' },
  { name: 'Vivah Panchami',      desc: 'Sacred marriage ceremony reenactment' },
  { name: 'Deepotsav',           desc: 'Diwali celebration with 10 lakh+ diyas' },
  { name: 'Satyanarayan Katha',  desc: 'Every Purnima (full moon)' },
  { name: 'Navgraha Shanti Pooja', desc: 'By appointment' },
];

const TODAY_PILLS = [
  { key: 'Tithi',      val: 'Saptami' },
  { key: 'Nakshatra',  val: 'Mrigashira' },
  { key: 'Yoga',       val: 'Shubha' },
  { key: 'Karana',     val: 'Bava' },
  { key: 'Var',        val: 'Shanivaar' },
  { key: 'Rahu Kaal',  val: '9:00 – 10:30 AM' },
];

const PANCHANG_MONTHS: PanchangMonth[] = [
  {
    id: 'chaitra', label: 'Chaitra',
    rows: [
      { date: '30 Mar 2025', tithi: 'Pratipada · Ashwini',     festival: 'Chaitra Navratri Begins',   badge: 'major',    significance: 'Ghatasthapana — 9-day Mata puja commences' },
      { date: '31 Mar 2025', tithi: 'Dwitiya · Bharani',       festival: 'Sindoor Tritiya',            badge: 'ekadashi', significance: 'Saubhagya vrat for married women' },
      { date: '2 Apr 2025',  tithi: 'Panchami · Rohini',       festival: 'Skanda Sashti',              badge: 'ekadashi', significance: 'Dedicated to Lord Kartikeya (Murugan)' },
      { date: '6 Apr 2025',  tithi: 'Navami · Punarvasu',      festival: 'Ram Navami',                 badge: 'major',    significance: 'Birthday of Maryada Purushottam Shree Ram' },
      { date: '8 Apr 2025',  tithi: 'Ekadashi · Pushya',       festival: 'Papamochini Ekadashi',       badge: 'ekadashi', significance: 'Removes all sins; fasting observed' },
      { date: '12 Apr 2025', tithi: 'Purnima · Hasta',         festival: 'Chaitra Purnima · Hanuman Jayanti', badge: 'purnima', significance: 'Full moon; birth of Lord Hanuman' },
      { date: '23 Apr 2025', tithi: 'Ekadashi · Uttara Bhadra',festival: 'Kamada Ekadashi',            badge: 'ekadashi', significance: 'Fulfils desires; Vishnu vrat' },
      { date: '27 Apr 2025', tithi: 'Amavasya · Ashwini',      festival: 'Chaitra Amavasya',           badge: 'amavasya', significance: 'Pitra tarpan; shraddha rituals' },
    ],
  },
  {
    id: 'vaishakh', label: 'Vaishakh',
    rows: [
      { date: '1 May 2025',  tithi: 'Tritiya · Rohini',       festival: 'Akshaya Tritiya',           badge: 'major',    significance: 'Most auspicious day; gold purchase; Parshuram Jayanti' },
      { date: '7 May 2025',  tithi: 'Navami · Magha',         festival: 'Sita Navami',               badge: 'major',    significance: 'Birth anniversary of Mata Sita' },
      { date: '8 May 2025',  tithi: 'Dashami · Purva Phalguni',festival: 'Mohini Ekadashi',          badge: 'ekadashi', significance: 'Ekadashi dedicated to Mohini avatar of Vishnu' },
      { date: '12 May 2025', tithi: 'Purnima · Swati',        festival: 'Vaishakh Purnima / Buddha Purnima', badge: 'purnima', significance: 'Satyanarayan puja; Vishnu worship' },
      { date: '23 May 2025', tithi: 'Ekadashi · Jyeshtha',    festival: 'Apara Ekadashi',            badge: 'ekadashi', significance: 'Bestows merit equivalent to pilgrimages' },
      { date: '26 May 2025', tithi: 'Amavasya · Bharani',     festival: 'Vaishakh Amavasya',         badge: 'amavasya', significance: 'Shani Jayanti; Pitra tarpan' },
    ],
  },
  {
    id: 'jyeshtha', label: 'Jyeshtha',
    rows: [
      { date: '6 Jun 2025',  tithi: 'Ekadashi · Pushya',      festival: 'Nirjala Ekadashi',          badge: 'ekadashi', significance: 'Strictest Ekadashi — waterless fast; grants moksha' },
      { date: '6 Jun 2025',  tithi: 'Dwadashi · Ashlesha',    festival: 'Ganga Dussehra',            badge: 'major',    significance: 'Ganga descended to earth; holy dip; charity' },
      { date: '11 Jun 2025', tithi: 'Purnima · Jyeshtha',     festival: 'Jyeshtha Purnima / Vat Savitri', badge: 'purnima', significance: 'Married women fast for husband\'s long life' },
      { date: '25 Jun 2025', tithi: 'Amavasya · Mrigashira',  festival: 'Jyeshtha Amavasya',         badge: 'amavasya', significance: 'Pitra shraddha; darshan at Prayagraj' },
    ],
  },
  {
    id: 'ashadha', label: 'Ashadha',
    rows: [
      { date: '27 Jun 2025', tithi: 'Dwitiya · Rohini',       festival: 'Jagannath Rath Yatra',      badge: 'major',    significance: 'Grand chariot procession of Lord Jagannath' },
      { date: '6 Jul 2025',  tithi: 'Ekadashi · Purva Ashadha',festival: 'Yogini Ekadashi',          badge: 'ekadashi', significance: 'Purifies soul; removes bodily sins' },
      { date: '10 Jul 2025', tithi: 'Purnima · Uttara Ashadha',festival: 'Ashadha Purnima / Guru Purnima', badge: 'purnima', significance: 'Honour the Guru lineage; Vyasa Puja' },
      { date: '21 Jul 2025', tithi: 'Ekadashi · Ardra',       festival: 'Devshayani Ekadashi',       badge: 'ekadashi', significance: 'Lord Vishnu begins Yoga Nidra — Chaturmas starts' },
      { date: '24 Jul 2025', tithi: 'Amavasya · Punarvasu',   festival: 'Ashadha Amavasya',          badge: 'amavasya', significance: 'Pitra tarpan before Chaturmas begins' },
    ],
  },
  {
    id: 'shravan', label: 'Shravan',
    rows: [
      { date: 'Every Monday', tithi: 'Monday',                festival: 'Shravan Somvar Vrat',       badge: 'major',    significance: 'Four Mondays — Shiva worship, Rudrabhishek' },
      { date: '9 Aug 2025',  tithi: 'Panchami · Hasta',       festival: 'Nag Panchami',              badge: 'major',    significance: 'Serpent deity worship; milk offering' },
      { date: '16 Aug 2025', tithi: 'Ekadashi · Rohini',      festival: 'Putrada Ekadashi',          badge: 'ekadashi', significance: 'Grants progeny blessings' },
      { date: '19 Aug 2025', tithi: 'Purnima · Shravan',      festival: 'Raksha Bandhan / Shravan Purnima', badge: 'purnima', significance: 'Rakhi tied; Hayagriva Jayanti' },
      { date: '23 Aug 2025', tithi: 'Amavasya · Magha',       festival: 'Shravan Amavasya',          badge: 'amavasya', significance: 'Pitra puja; pind daan' },
    ],
  },
  {
    id: 'bhadra', label: 'Bhadrapada',
    rows: [
      { date: '27 Aug 2025', tithi: 'Chaturthi · Hasta',      festival: 'Ganesh Chaturthi',          badge: 'major',    significance: 'Lord Ganesha\'s birthday — 10-day Mahotsav begins' },
      { date: '5 Sep 2025',  tithi: 'Ekadashi · Shravana',    festival: 'Aja Ekadashi',              badge: 'ekadashi', significance: 'Frees from all sins' },
      { date: '7 Sep 2025',  tithi: 'Chaturdashi · Shatabhisha',festival: 'Anant Chaturdashi',       badge: 'major',    significance: 'Immersion of Ganesh idol; Anant Vrat' },
      { date: '2 Oct 2025',  tithi: 'Navami · Hasta',         festival: 'Pitru Paksha Begins',       badge: 'major',    significance: '16-day period of ancestor remembrance' },
    ],
  },
  {
    id: 'ashwin', label: 'Ashwin',
    rows: [
      { date: '22 Sep 2025', tithi: 'Amavasya · Hasta',       festival: 'Mahalaya Amavasya / Pitru Visarjan', badge: 'amavasya', significance: 'Last day of Pitru Paksha; ancestors depart' },
      { date: '23 Sep 2025', tithi: 'Pratipada · Chitra',     festival: 'Shardiya Navratri Begins',  badge: 'major',    significance: '9 forms of Durga worshipped — Ghatasthapana' },
      { date: '2 Oct 2025',  tithi: 'Dashami · Uttara Ashadha',festival: 'Vijayadashami / Dussehra', badge: 'major',    significance: 'Victory of Ram over Ravana; Ramlila culminates' },
      { date: '6 Oct 2025',  tithi: 'Purnima · Ashwini',      festival: 'Sharad Purnima / Kojagiri', badge: 'purnima',  significance: 'Lakshmi descends; kheer kept under moonlight' },
    ],
  },
  {
    id: 'kartik', label: 'Kartik',
    rows: [
      { date: '20 Oct 2025', tithi: 'Trayodashi · Swati',     festival: 'Dhanteras',                 badge: 'major',    significance: 'Worship of Dhanvantari and Lakshmi; gold purchase' },
      { date: '21 Oct 2025', tithi: 'Chaturdashi · Vishakha', festival: 'Narak Chaturdashi / Choti Diwali', badge: 'major', significance: 'Yama deepdaan; oil bath at dawn' },
      { date: '21 Oct 2025', tithi: 'Amavasya · Jyeshtha',    festival: 'Diwali / Deepavali',        badge: 'major',    significance: 'Return of Lord Ram to Ayodhya — lakhs of diyas lit' },
      { date: '23 Oct 2025', tithi: 'Dwitiya · Uttara Ashadha',festival: 'Bhai Dooj',                badge: 'major',    significance: 'Sisters pray for brothers\' long life' },
      { date: '5 Nov 2025',  tithi: 'Ekadashi · Rohini',      festival: 'Devutthana Ekadashi',       badge: 'ekadashi', significance: 'Lord Vishnu awakens from Yoga Nidra — Chaturmas ends' },
      { date: '5 Nov 2025',  tithi: 'Purnima · Krittika',     festival: 'Kartik Purnima / Dev Deepawali', badge: 'purnima', significance: 'Gods celebrate Diwali; Ganga snan; Pushkar fair' },
    ],
  },
  {
    id: 'margashirsha', label: 'Margashirsha',
    rows: [
      { date: '20 Nov 2025', tithi: 'Ekadashi · Anuradha',    festival: 'Utpanna Ekadashi',          badge: 'ekadashi', significance: 'Origin of Ekadashi Devi; first Ekadashi of Margashirsha' },
      { date: '5 Dec 2025',  tithi: 'Purnima · Mrigashira',   festival: 'Margashirsha Purnima',      badge: 'purnima',  significance: 'Dattatreya Jayanti; Satyanarayan puja' },
      { date: '20 Dec 2025', tithi: 'Amavasya · Jyeshtha',    festival: 'Margashirsha Amavasya',     badge: 'amavasya', significance: 'Pitra tarpan; Somvati Amavasya (if Monday)' },
    ],
  },
  {
    id: 'pausha', label: 'Pausha',
    rows: [
      { date: '3 Jan 2026',  tithi: 'Purnima · Punarvasu',    festival: 'Pausha Purnima',            badge: 'purnima',  significance: 'Satyanarayan katha; Prayag Magh Mela begins' },
      { date: '14 Jan 2026', tithi: 'Uttarayana',             festival: 'Makar Sankranti',           badge: 'major',    significance: 'Sun enters Capricorn; sesame-jaggery offerings; kite flying' },
      { date: '18 Jan 2026', tithi: 'Amavasya · Uttara Ashadha',festival: 'Pausha Amavasya',         badge: 'amavasya', significance: 'Pitra tarpan; Mauni Amavasya fasting' },
    ],
  },
  {
    id: 'magha', label: 'Magha',
    rows: [
      { date: '1 Feb 2026',  tithi: 'Purnima · Magha',        festival: 'Magha Purnima',             badge: 'purnima',  significance: 'Snan at Triveni Sangam; lamp donation' },
      { date: '2 Feb 2026',  tithi: 'Panchami · Hasta',       festival: 'Vasant Panchami / Saraswati Puja', badge: 'major', significance: 'Goddess Saraswati worshipped; spring begins; yellow clothes' },
      { date: '14 Feb 2026', tithi: 'Ekadashi · Ashlesha',    festival: 'Jaya Ekadashi',             badge: 'ekadashi', significance: 'Grants victory; frees from ghost afflictions' },
      { date: '17 Feb 2026', tithi: 'Amavasya · Dhanishtha',  festival: 'Magha Amavasya / Mauni Amavasya', badge: 'amavasya', significance: 'Silence vrat; massive Ganga snan at Kumbh' },
    ],
  },
  {
    id: 'phalguna', label: 'Phalguna',
    rows: [
      { date: '26 Feb 2026', tithi: 'Ashtami · Pushya',       festival: 'Maha Shivratri',            badge: 'major',    significance: 'Shiva-Parvati marriage; overnight jagran; Rudrabhishek' },
      { date: '3 Mar 2026',  tithi: 'Purnima · Phalguni',     festival: 'Holika Dahan',              badge: 'purnima',  significance: 'Bonfire to mark victory of devotion over evil' },
      { date: '4 Mar 2026',  tithi: 'Pratipada',              festival: 'Holi',                      badge: 'major',    significance: 'Festival of colours — Braj Holi, Lathmar Holi' },
      { date: '7 Mar 2026',  tithi: 'Saptami · Mrigashira',   festival: "Today's Panchang",          badge: 'major',    significance: 'Auspicious Saturday; Hanuman chalisa path' },
      { date: '14 Mar 2026', tithi: 'Ekadashi · Revati',      festival: 'Amalaki Ekadashi',          badge: 'ekadashi', significance: 'Amla tree worship; Vishnu puja' },
      { date: '18 Mar 2026', tithi: 'Amavasya · Ashwini',     festival: 'Phalguna Amavasya',         badge: 'amavasya', significance: 'Last Amavasya of the year — pitra shanti' },
    ],
  },
];

const ASTRO_CARDS: AstroInfo[] = [
  {
    icon: '☀️',
    title: 'Surya (Sun) — March 2026',
    rows: [
      { key: 'Sunrise', val: '6:28 AM' },
      { key: 'Sunset',  val: '6:22 PM' },
      { key: 'Rashi',   val: 'Kumbha (Aquarius)' },
      { key: 'Ayana',   val: 'Uttarayana' },
      { key: 'Rutu',    val: 'Vasanta (Spring)' },
    ],
  },
  {
    icon: '🌙',
    title: 'Chandra (Moon) — March 2026',
    rows: [
      { key: 'Moonrise',    val: '11:02 AM' },
      { key: 'Moonset',     val: '12:18 AM' },
      { key: 'Rashi',       val: 'Mithuna (Gemini)' },
      { key: 'Paksha',      val: 'Shukla (Waxing)' },
      { key: 'Tithi End',   val: '7:48 PM' },
    ],
  },
  {
    icon: '⚠️',
    title: 'Inauspicious Times — Today',
    rows: [
      { key: 'Rahu Kaal',      val: '9:00 – 10:30 AM' },
      { key: 'Yamaganda',      val: '1:30 – 3:00 PM' },
      { key: 'Gulika Kaal',    val: '6:00 – 7:30 AM' },
      { key: 'Dur Muhurta',    val: '7:02 – 7:50 AM' },
      { key: 'Abhijit Muhurta',val: '12:00 – 12:48 PM ✓' },
    ],
  },
];

const NEWS_ITEMS: NewsItem[] = [
  { icon: '🏗️', title: 'Parikrama Marg Phase II Complete',    desc: 'The 5 km parikrama path around the temple complex is now open for devotees with rest points every 500 metres.',           date: '2 March 2026' },
  { icon: '📱', title: 'Mandir Mobile App Launched',           desc: 'Book darshan slots, receive aarti notifications, and watch live streaming of poojas — now on Android & iOS.',            date: '28 Feb 2026' },
  { icon: '🍽️', title: 'Annadaan Seva Expansion',             desc: 'The Prasad distribution centre now serves 50,000 pilgrims daily. Sponsor a meal for ₹51 per devotee.',                   date: '20 Feb 2026' },
  { icon: '🎓', title: 'Veda Pathshala Admissions Open',       desc: 'The temple\'s Veda Pathshala is accepting students aged 8–14 for traditional Sanskrit and Vedic learning.',              date: '15 Feb 2026' },
  { icon: '🌿', title: 'Tulsi Garden Inaugurated',             desc: 'A 2-acre Tulsi Vatika planted with 1.08 lakh Tulsi plants has been consecrated within the temple premises.',             date: '9 Feb 2026' },
];

const ANNOUNCEMENTS: Announcement[] = [
  { emoji: '🕐', title: 'Extended Darshan Hours',   body: 'During Ram Navami week (Apr 1–6), darshan will be available 24 hours a day with token system.' },
  { emoji: '🚌', title: 'Free Shuttle Service',      body: 'Free buses from Ayodhya Railway Station every 15 minutes. Last shuttle at 10:30 PM daily.' },
  { emoji: '🏨', title: 'Dharamshala Booking',       body: '800 rooms available for pilgrims at subsidised rates. Book via temple website or helpline 1800-XXX-XXXX.' },
];

// ─────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────

/** Shared section header with ornament */
const SectionHeader: React.FC<{
  tag: string;
  heading: string;
  subtext: string;
  dark?: boolean;
}> = ({ tag, heading, subtext, dark = false }) => (
  <div className={styles.sectionHeader}>
    <p className={styles.sectionTag}>{tag}</p>
    <div className={styles.sectionOrnament}>
      <div className={dark ? styles.ornamentLineDark : styles.ornamentLine} />
      <div className={styles.ornamentDiamond} />
      <div className={dark ? styles.ornamentLineDarkReverse : styles.ornamentLineReverse} />
    </div>
    <h2 className={`${styles.sectionHeading} ${dark ? styles.sectionHeadingLight : ''}`}>
      {heading}
    </h2>
    <p className={`${styles.sectionSubtext} ${dark ? styles.sectionSubtextLight : ''}`}>
      {subtext}
    </p>
  </div>
);

/** QR placeholder box with animated scan line */
const QrBox: React.FC<{ variant?: 'gold' | 'maroon' }> = ({ variant = 'gold' }) => {
  const boxClass = variant === 'maroon' ? styles.qrBoxMaroon : styles.qrBox;
  const scanClass = variant === 'maroon' ? styles.qrScanLineMaroon : styles.qrScanLine;
  // 49 cells for 7×7 grid
  const cells = Array.from({ length: 49 });
  return (
    <div className={boxClass}>
      <div className={styles.qrCornerTl} />
      <div className={styles.qrCornerTr} />
      <div className={styles.qrCornerBl} />
      <div className={styles.qrCornerBr} />
      <div className={styles.qrInner}>
        {cells.map((_, i) => (
          <div
            key={i}
            className={styles.qrCell}
            style={{
              opacity:
                (i + 1) % 3 === 1 ? 1
                : (i + 1) % 5 === 2 ? 1
                : (i + 1) % 7 === 0 ? 0.7
                : (i + 1) % 2 === 1 && (i + 1) % 3 !== 1 ? 0.9
                : 0,
            }}
          />
        ))}
      </div>
      <div className={scanClass} />
    </div>
  );
};

/** Badge for panchang festival types */
const FestBadge: React.FC<{ type: BadgeType; text: string }> = ({ type, text }) => {
  const badgeMap: Record<BadgeType, string> = {
    major:    styles.festBadgeMajor,
    ekadashi: styles.festBadgeEkadashi,
    purnima:  styles.festBadgePurnima,
    amavasya: styles.festBadgeAmavasya,
  };
  const prefix: Record<BadgeType, string> = {
    major: '★ ', ekadashi: '', purnima: '', amavasya: '',
  };
  return (
    <span className={`${styles.festBadge} ${badgeMap[type] || ''}`}>
      {prefix[type] ? `${prefix[type]}${text}` : text}
    </span>
  );
};

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────

const HomeContent: React.FC = () => {
  // Hero bg parallax class toggle
  const heroBgRef = useRef<HTMLDivElement>(null);
  const [heroBgLoaded, setHeroBgLoaded] = useState(false);

  // Active panchang month tab
  const [activeMonth, setActiveMonth] = useState<string>('chaitra');

  // Intersection observer for card fade-in
  const cardsObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Trigger hero bg scale animation
    const timer = setTimeout(() => setHeroBgLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Fade-in observer for deity/info/qr cards
    cardsObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            cardsObserverRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    const cards = document.querySelectorAll<HTMLElement>(
      '[data-fadein="true"]'
    );
    cards.forEach((card) => {
      card.style.opacity = '0';
      card.style.transition = 'opacity 0.7s ease, transform 0.4s ease, box-shadow 0.4s ease';
      cardsObserverRef.current?.observe(card);
    });

    return () => cardsObserverRef.current?.disconnect();
  }, []);

  const activeMonthData = PANCHANG_MONTHS.find((m) => m.id === activeMonth);

  return (
    <div className={styles.wrapper}>

      {/* ==========================================
           1. HERO SECTION
      =========================================== */}
      <section className={styles.hero} id="hero">
        {/* Background image */}
        <div
          ref={heroBgRef}
          className={`${styles.heroBg} ${heroBgLoaded ? styles.heroBgLoaded : ''}`}
        />
        {/* Dark gradient overlay */}
        <div className={styles.heroOverlay} />
        {/* Scanline texture */}
        <div className={styles.heroOverlayTexture} />
        {/* Bottom fade */}
        <div className={styles.heroFade} />

        {/* Central content */}
        <div className={styles.heroContent}>
          <span className={styles.heroOm}>ॐ</span>
          <p className={styles.heroSubtitleTop}>Jai Shree Ram </p>

          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleSpan}>Shree Ram Mandir</span>
          </h1>

          {/* Animated gold divider */}
          <div className={styles.heroDivider}>
            <div className={styles.heroDividerLine} />
            <div className={styles.heroDividerGem} />
            <div className={styles.heroDividerGemSaffron} />
            <div className={styles.heroDividerGem} />
            <div className={styles.heroDividerLineR} />
          </div>

          <p className={styles.heroMantra}>
            "रामो विग्रहवान् धर्मः"&nbsp;—&nbsp;Ram is the embodiment of Dharma
          </p>

          <a className={styles.heroCta} href="#navgraha">
            Explore the Temple
          </a>
        </div>

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <span className={styles.scrollIndicatorInner} />
        </div>
      </section>


      {/* ==========================================
           DIVINE QUOTE BANNER
      =========================================== */}
      <div className={styles.quoteBanner}>
        <p className={styles.quoteText}>
          "मर्यादा पुरुषोत्तम{' '}
          <span className={styles.quoteTextEm}>श्री राम</span>
          {' '}— The Supreme Ideal of Virtue"
        </p>
        <p className={styles.quoteAttr}>Valmiki Ramayana · Bal Kanda</p>
      </div>


      {/* ==========================================
           2. NAVGRAHA / DEITY GRID SECTION
      =========================================== */}
      <section className={styles.navgrahaSection} id="navgraha">
        <SectionHeader
          tag="Garbhagriha Shrines"
          heading="Navgraha & Principal Deities"
          subtext="The nine celestial guardians who govern the cosmic order, enshrined within the sacred precincts of the Mandir."
        />
        <div className={styles.deityGrid}>
          {DEITIES.map((deity) => (
            <div key={deity.name} className={styles.deityCard} data-fadein="true">
              <div className={styles.deityImgWrapper}>
                <img src={deity.img} alt={deity.alt} loading="lazy" />
              </div>
              <div className={styles.deityInfo}>
                <p className={styles.deityName}>{deity.name}</p>
                <p className={styles.deityGraha}>{deity.graha}</p>
                <div className={styles.deityDot} />
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* ==========================================
           3. TEMPLE INFORMATION SECTION
      =========================================== */}
      <section className={styles.infoSection} id="info">
        <SectionHeader
          tag="Sacred Precincts"
          heading="Temple Information"
          subtext="A timeless place of peace, devotion, and divine blessings, welcoming pilgrims from across the world."
          dark
        />

        <div className={styles.infoGrid}>

          {/* Card 1: About the Temple */}
          <div className={styles.infoCard} data-fadein="true">
            <span className={styles.infoIcon}>🏛️</span>
            <h3 className={styles.infoCardTitle}>About the Temple</h3>
            <div className={styles.infoCardBody}>
              Shree Ram Mandir stands as a testament to India's ancient spiritual heritage,
              consecrated on the sacred soil of{' '}
              <strong>Ayodhya</strong> — the birthplace of Maryada Purushottam Lord Ram.
              <br /><br />
              Built in the{' '}
              <strong>Nagara architectural style</strong>, the temple complex spans over 70 acres
              and features intricate stone carvings, towering shikharas, and sanctuaries dedicated
              to the entire Ram Parivar.
              <br /><br />
              The sanctum sanctorum houses the divine{' '}
              <strong>Ram Lalla idol</strong>, sculpted in black stone, radiating divine splendour.
            </div>
          </div>

          {/* Card 2: Temple Timings */}
          <div className={styles.infoCard} data-fadein="true">
            <span className={styles.infoIcon}>⏰</span>
            <h3 className={styles.infoCardTitle}>Temple Timings</h3>
            <div className={styles.infoCardBody}>
              {TIMINGS.map((t) => (
                <div key={t.label} className={styles.timingRow}>
                  <span className={styles.timingLabel}>{t.label}</span>
                  <span className={styles.timingTime}>{t.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Special Poojas */}
          <div className={styles.infoCard} data-fadein="true">
            <span className={styles.infoIcon}>🪔</span>
            <h3 className={styles.infoCardTitle}>Special Poojas</h3>
            <div className={styles.infoCardBody}>
              {POOJAS.map((p) => (
                <div key={p.name} className={styles.poojaItem}>
                  <div className={styles.poojaBullet} />
                  <p className={styles.poojaText}>
                    <strong>{p.name}</strong> — {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* ==========================================
           4. QR CODE SCANNER SECTION
      =========================================== */}
      <section className={styles.qrSection} id="donation">
        <SectionHeader
          tag="Sacred Offerings"
          heading="Scan QR for Donations & Temple Info"
          subtext="Your sevā and offerings help sustain the sacred traditions and daily worship at the Mandir."
        />

        <div className={styles.qrWrapper}>

          {/* Donation QR Card */}
          <div className={styles.qrCard} data-fadein="true">
            <p className={styles.qrCardTitle}>Temple Donation</p>
            <p className={styles.qrCardSub}>Sevā — A Path to Punya</p>
            <QrBox variant="gold" />
            <div className={styles.qrAmountBadge}>UPI · BHIM · GPay · PhonePe</div>
            <p className={styles.qrUpi}>shreerammandir@sbi</p>
          </div>

          {/* Temple Info QR Card */}
          <div className={styles.qrCard} data-fadein="true">
            <p className={styles.qrCardTitle}>Temple Information</p>
            <p className={styles.qrCardSub}>Virtual Darshan &amp; Bookings</p>
            <QrBox variant="maroon" />
            <div className={styles.qrAmountBadgeMaroon}>Virtual Darshan · Pooja Booking</div>
            <p className={styles.qrUpi}>shreeram.mandir.ayodhya.gov.in</p>
          </div>

        </div>
      </section>


      {/* ==========================================
           5. PANCHANG SECTION
      =========================================== */}
      <section className={styles.panchangSection} id="panchang">
        <SectionHeader
          tag="Vikram Samvat 2082"
          heading="Complete Year Panchang 2025–26"
          subtext="Sacred calendar of tithis, nakshatras, festivals, vrats, and auspicious muhurtas for the entire Hindu year."
          dark
        />

        {/* Today's Panchang strip */}
        {/* <div className={styles.panchangToday}>
          <div>
            <span className={styles.todayLabel}>Aaj Ka Panchang</span>
            <div className={styles.todayDateHi}>
              फाल्गुन शुक्ल सप्तमी, विक्रम संवत् २०८२
            </div>
            <div className={styles.todayDateEn}>
              Saturday, 7 March 2026 · Phalguna Shukla Saptami
            </div>
          </div>
          <div className={styles.todayPills}>
            {TODAY_PILLS.map((pill) => (
              <div key={pill.key} className={styles.todayPill}>
                <span className={styles.todayPillKey}>{pill.key}</span>
                <span className={styles.todayPillVal}>{pill.val}</span>
              </div>
            ))}
          </div>
        </div> */}

        {/* Month tabs */}
        <div className={styles.panchangTabs}>
          {PANCHANG_MONTHS.map((m) => (
            <button
              key={m.id}
              className={`${styles.pTab} ${activeMonth === m.id ? styles.pTabActive : ''}`}
              onClick={() => setActiveMonth(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Active month table */}
        <div className={styles.panchangPanels}>
          {activeMonthData && (
            <div className={styles.pTableWrap}>
              <table className={styles.pTable}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Tithi / Nakshatra</th>
                    <th>Festival / Vrat</th>
                    <th>Significance</th>
                  </tr>
                </thead>
                <tbody>
                  {activeMonthData.rows.map((row, i) => (
                    <tr key={i}>
                      <td>{row.date}</td>
                      <td>{row.tithi}</td>
                      <td><FestBadge type={row.badge} text={row.festival} /></td>
                      <td>{row.significance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Astro cards: Sun / Moon / Rahu */}
        {/* <div className={styles.panchangAstro}>
          {ASTRO_CARDS.map((card) => (
            <div key={card.title} className={styles.astroCard}>
              <span className={styles.astroIcon}>{card.icon}</span>
              <p className={styles.astroTitle}>{card.title}</p>
              {card.rows.map((row) => (
                <div key={row.key} className={styles.astroRow}>
                  <span className={styles.astroKey}>{row.key}</span>
                  <span className={styles.astroVal}>{row.val}</span>
                </div>
              ))}
            </div>
          ))}
        </div> */}
      </section>


      {/* ==========================================
           6. LATEST INFORMATION / NEWS SECTION
      =========================================== */}
      <section className={styles.newsSection} id="news">
        <SectionHeader
          tag="Mandir Samachar"
          heading="Latest Information & Updates"
          subtext="Stay informed with temple announcements, event updates, seva opportunities, and divine happenings."
        />

        {/* Breaking news ticker */}
        <div className={styles.newsTickerWrap}>
          <div className={styles.tickerLabel}>🔔 Live Updates</div>
          <div className={styles.tickerTrack}>
            <div className={styles.tickerInner}>
              🚩 Ram Navami 2026 grand preparations underway — Special darshan from 4 AM
              <span className={styles.tickerSep}>·</span>
              🪔 Holi Deepotsav on 4 March — 1 Lakh diyas to be lit at Saryu Ghat
              <span className={styles.tickerSep}>·</span>
              📿 Online Pooja Booking now open for Chaitra Navratri 2026
              <span className={styles.tickerSep}>·</span>
              🏛️ New Gopuram construction entering final phase — expected completion Chaitri 2026
              <span className={styles.tickerSep}>·</span>
              🎵 Saptah Bhagwat Katha starts 15 March — Entry free for all devotees
              <span className={styles.tickerSep}>·</span>
              🌸 Phool Bungla Seva open for registration — contact temple office
              <span className={styles.tickerSep}>·</span>
              ✈️ Special pilgrimage package from Delhi, Mumbai &amp; Ahmedabad for Ram Navami
              <span className={styles.tickerSep}>·</span>
            </div>
          </div>
        </div>

        {/* Main news layout: featured + sidebar */}
        <div className={styles.newsLayout}>

          {/* Featured news */}
          <div className={styles.newsFeatured}>
            <img
              src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80"
              alt="Ram Navami 2026 Preparations"
              className={styles.newsFeaturedImg}
            />
            <div className={styles.newsFeaturedBody}>
              <span className={styles.newsCategoryEvent}>Featured Event</span>
              <h3 className={styles.newsFeaturedTitle}>
                Ram Navami Mahotsav 2026 — Grand Celebrations Announced
              </h3>
              <p className={styles.newsFeaturedExcerpt}>
                The Shree Ram Janmabhoomi Teertha Kshetra Trust has announced an unprecedented
                7-day celebration for Ram Navami 2026. The festivities will include continuous
                Akhand Ramayan recitation, Panchamrit Abhishek of Ram Lalla, Phool Bungla
                decoration with 10 tonnes of flowers, Ramlila performances across the city, and
                a grand fireworks display at Saryu Ghat.
              </p>
              <div className={styles.newsMeta}>
                <span className={styles.newsDate}>📅 March 7, 2026 · Temple Committee</span>
                <button className={styles.newsReadMore}>Read Full Announcement →</button>
              </div>
            </div>
          </div>

          {/* Sidebar news items */}
          <div className={styles.newsSidebar}>
            <p className={styles.newsSidebarTitle}>Recent Updates</p>
            {NEWS_ITEMS.map((item) => (
              <div key={item.title} className={styles.newsItem}>
                <span className={styles.newsItemIcon}>{item.icon}</span>
                <div>
                  <p className={styles.newsItemTitle}>{item.title}</p>
                  <p className={styles.newsItemDesc}>{item.desc}</p>
                  <span className={styles.newsItemDate}>📅 {item.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Announcements strip */}
        <div className={styles.announcementsStrip}>
          {ANNOUNCEMENTS.map((a) => (
            <div key={a.title} className={styles.announceItem}>
              <span className={styles.announceEmoji}>{a.emoji}</span>
              <p className={styles.announceTitle}>{a.title}</p>
              <p className={styles.announceBody}>{a.body}</p>
            </div>
          ))}
        </div>

      </section>

    </div> // end .wrapper
  );
};

export default HomeContent;
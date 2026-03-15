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
import { getContentBySectionKey, SiteContent } from '@/src/lib/cms';

// ─────────────────────────────────────────────
// TYPE DEFINITIONS
// ─────────────────────────────────────────────

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

const MONTH_TABS = [
  { id: 'chaitra', label: 'Chaitra' },
  { id: 'vaishakh', label: 'Vaishakh' },
  { id: 'jyeshtha', label: 'Jyeshtha' },
  { id: 'ashadha', label: 'Ashadha' },
  { id: 'shravan', label: 'Shravan' },
  { id: 'bhadra', label: 'Bhadrapada' },
  { id: 'ashwin', label: 'Ashwin' },
  { id: 'kartik', label: 'Kartik' },
  { id: 'margashirsha', label: 'Margashirsha' },
  { id: 'pausha', label: 'Pausha' },
  { id: 'magha', label: 'Magha' },
  { id: 'phalguna', label: 'Phalguna' },
  { id: 'chaitra_krishna', label: 'Chaitra (Krishna Paksh)' },
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
const FestBadge: React.FC<{ type: BadgeType; text: string; isSpecial?: boolean }> = ({ type, text, isSpecial }) => {
  const badgeMap: Record<BadgeType, string> = {
    major:    styles.festBadgeMajor,
    ekadashi: styles.festBadgeEkadashi,
    purnima:  styles.festBadgePurnima,
    amavasya: styles.festBadgeAmavasya,
  };
  const prefix: Record<BadgeType, string> = {
    major: isSpecial ? '★ ' : '', ekadashi: '', purnima: '', amavasya: '',
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
  const [dynamicPanchang, setDynamicPanchang] = useState<SiteContent[]>([]);
  const [dynamicNews, setDynamicNews] = useState<SiteContent[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<SiteContent | null>(null);

  // Dynamic Garbhagriha Deities State
  const [dynamicDeities, setDynamicDeities] = useState<any[]>([]);

  // Intersection observer for card fade-in
  const cardsObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Fetch dynamic hero banner
    const fetchHeroBanner = async () => {
      try {
        const records = await getContentBySectionKey('home_hero');
        if (records.length > 0 && records[0].imageUrl && heroBgRef.current) {
          heroBgRef.current.style.backgroundImage = `url(${records[0].imageUrl})`;
        }
      } catch (error) {
        console.error("Failed to load hero banner", error);
      }
    };
    
    // Fetch dynamic garbha deities
    const fetchDeities = async () => {
      try {
        const records = await getContentBySectionKey('garbhagriha_deity');
        records.sort((a, b) => {
          const pA = a.additionalData?.priority || 0;
          const pB = b.additionalData?.priority || 0;
          return pA - pB;
        });
        setDynamicDeities(records);
      } catch (error) {
        console.error("Failed to load deities", error);
      }
    };

    // Fetch dynamic panchang
    const fetchPanchang = async () => {
      try {
        const records = await getContentBySectionKey('panchang_entry');
        records.sort((a, b) => {
          const dA = a.additionalData?.sortTimestamp || 0;
          const dB = b.additionalData?.sortTimestamp || 0;
          return dA - dB;
        });
        setDynamicPanchang(records);
      } catch (error) {
        console.error("Failed to load panchang", error);
      }
    };

    // Fetch dynamic news
    const fetchNews = async () => {
      try {
        const records = await getContentBySectionKey('news_article');
        records.sort((a, b) => {
          const dA = a.additionalData?.publishTimestamp || 0;
          const dB = b.additionalData?.publishTimestamp || 0;
          return dB - dA;
        });
        setDynamicNews(records);
      } catch (error) {
        console.error("Failed to load news", error);
      }
    };

    fetchHeroBanner();
    fetchDeities();
    fetchPanchang();
    fetchNews();

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

  const activeMonthEntries = dynamicPanchang.filter(
    (p) => p.additionalData?.monthId === activeMonth
  );

  const featuredArticle = dynamicNews.find(a => a.additionalData?.isFeatured);
  const sidebarArticles = dynamicNews.filter(a => a.id !== featuredArticle?.id).slice(0, 5);

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
          {dynamicDeities.length > 0 ? (
            dynamicDeities.map((deity, idx) => (
              <div key={idx} className={styles.deityCard} data-fadein="true">
                <div className={styles.deityImgWrapper}>
                  <img src={deity.imageUrl} alt={deity.title} loading="lazy" />
                </div>
                <div className={styles.deityInfo}>
                  <p className={styles.deityName}>{deity.title}</p>
                  <div className={styles.deityDot} />
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', color: '#718096' }}>No deities configured yet.</p>
          )}
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
              The Shree Ram Mandir, an important place of worship in Jaipur, was initially established on{' '}
              <strong>25th April 1955</strong>, coinciding with the auspicious occasion of Akshaya Tritiya
              under the Mrighashira Nakshatra.
              <br /><br />
              The Pran Pratishtha of Bhagwan Shri Ram was performed under the spiritual guidance
              of Niranjan Dev Tirtha, the revered Shankaracharya of Govardhan Math, Puri.
              <br /><br />
              The main sanctum reveres the sacred idols of{' '}
              <strong>Lord Rama and Hanuman</strong>, with additional expansions enshrining 
              Radha Krishna, Vaishno Devi, Lord Shiva, and Lakshmi Narayana.
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
          heading="Scan QR to Donate"
          subtext="Your sevā and offerings help sustain the sacred traditions and daily worship at the Mandir."
        />

        <div className={styles.qrWrapper}>

          {/* Single Donation QR Card */}
          <div className={styles.qrCard} data-fadein="true" style={{ maxWidth: 400 }}>
            <p className={styles.qrCardTitle}>Temple Donation</p>
            <p className={styles.qrCardSub}>Sevā — A Path to Punya</p>
            <div className={styles.qrRealImgWrap}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/ram-mandir-32b54.firebasestorage.app/o/garbhagriha%2FWhatsApp%20Image%202026-03-12%20at%2011.11.24%20PM.jpeg?alt=media&token=218b85a7-4e96-46e9-a561-0f14c24c461e"
                alt="Donation QR Code"
                className={styles.qrRealImg}
                loading="lazy"
                decoding="async"
              />
              <div className={styles.qrScanLine} />
            </div>
            <div className={styles.qrAmountBadge}>UPI · BHIM · GPay · PhonePe</div>
            <p className={styles.qrUpi}>shreerammandir@sbi</p>
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
          {MONTH_TABS.map((m) => (
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
          <div className={styles.pTableWrap}>
            <table className={styles.pTable}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Tithi</th>
                  <th>Festival / Vrat</th>
                </tr>
              </thead>
              <tbody>
                {activeMonthEntries.length > 0 ? (
                  activeMonthEntries.map((row) => (
                    <tr key={row.id}>
                      <td>{row.additionalData?.dateStr}</td>
                      <td>{row.additionalData?.tithi}</td>
                      <td>
                        {row.title ? (
                          <FestBadge type="major" text={row.title} isSpecial={row.additionalData?.isSpecial} />
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>
                      No entries found for this month.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

        {dynamicNews.length > 0 ? (
          <div className={styles.newsLayout}>

            {/* Featured news */}
            {featuredArticle && (
              <div
                className={styles.newsFeatured}
                onClick={() => setSelectedArticle(featuredArticle)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedArticle(featuredArticle);
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                {featuredArticle.imageUrl && (
                  <img
                    src={featuredArticle.imageUrl}
                    alt={featuredArticle.title}
                    className={styles.newsFeaturedImg}
                    loading="lazy"
                    decoding="async"
                  />
                )}
                <div className={styles.newsFeaturedBody}>
                  <span className={styles.newsCategoryEvent}>{featuredArticle.additionalData?.category || 'Featured'}</span>
                  <h3 className={styles.newsFeaturedTitle}>{featuredArticle.title}</h3>
                  <p className={styles.newsFeaturedExcerpt}>{featuredArticle.description}</p>
                  <div className={styles.newsMeta}>
                    <span className={styles.newsDate}>📅 {featuredArticle.additionalData?.publishTimestamp
                      ? new Date(featuredArticle.additionalData.publishTimestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                      : ''}</span>
                    <button className={styles.newsReadMore}>Read Full Article →</button>
                  </div>
                </div>
              </div>
            )}

            {/* Sidebar news items */}
            {sidebarArticles.length > 0 && (
              <div className={styles.newsSidebar}>
                <p className={styles.newsSidebarTitle}>Recent Updates</p>
                {sidebarArticles.map((item) => (
                  <div
                    key={item.id}
                    className={styles.newsItem}
                    onClick={() => setSelectedArticle(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedArticle(item);
                      }
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className={styles.newsItemIcon}>📰</span>
                    <div>
                      <p className={styles.newsItemTitle}>{item.title}</p>
                      <p className={styles.newsItemDesc}>{item.description}</p>
                      <span className={styles.newsItemDate}>📅 {item.additionalData?.publishTimestamp
                        ? new Date(item.additionalData.publishTimestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : ''}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#718096', padding: '2rem' }}>No news articles published yet.</p>
        )}

      </section>

      {/* Article Popup Modal */}
      {selectedArticle && (
        <div className={styles.articleOverlay} onClick={() => setSelectedArticle(null)}>
          <div className={styles.articleModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.articleClose} onClick={() => setSelectedArticle(null)}>✕</button>
            {selectedArticle.imageUrl && (
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className={styles.articleModalImg}
                loading="lazy"
                decoding="async"
              />
            )}
            <div className={styles.articleModalBody}>
              <span className={styles.articleModalCategory}>{selectedArticle.additionalData?.category || 'Update'}</span>
              <h2 className={styles.articleModalTitle}>{selectedArticle.title}</h2>
              <p className={styles.articleModalDate}>
                📅 {selectedArticle.additionalData?.publishTimestamp
                  ? new Date(selectedArticle.additionalData.publishTimestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
                  : ''}
              </p>
              <div
                className={styles.articleModalContent}
                dangerouslySetInnerHTML={{ __html: selectedArticle.additionalData?.content || selectedArticle.description || '' }}
              />
            </div>
          </div>
        </div>
      )}

    </div> // end .wrapper
  );
};

export default HomeContent;
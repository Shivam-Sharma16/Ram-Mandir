'use client';

/**
 * About.tsx
 * Shree Ram Mandir — About Page Component
 *
 * Sections:
 *   1. Hero Banner        — Page title with ornamental divider
 *   2. History            — Temple history with timeline milestones
 *   3. Priests            — Head Priest & Priest cards
 *   4. Trust Details      — Shree Ram Mandir Pranyas Sanatan Dharam Sabha
 *   5. Trust Members      — Custom CSS carousel (zero external dependencies)
 *
 * No Swiper or carousel library needed — built with plain divs + React state.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import styles from './About.module.css';

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface Milestone  { year: string; title: string; desc: string; }
interface Priest     { name: string; role: string; qualification: string; experience: string; speciality: string; avatar: string; isHead?: boolean; quote: string; }
interface TrustMember{ name: string; role: string; since: string; avatar: string; department: string; }

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const MILESTONES: Milestone[] = [
  { year: '1528', title: 'Original Mandir',    desc: 'Ancient temple marking the birthplace of Lord Ram stood at this sacred site, revered by millions of devotees across Bharatvarsha.' },
  { year: '1853', title: 'First Legal Claim',  desc: 'The first recorded legal claim for the sacred land was filed, beginning a long spiritual and judicial journey spanning generations.' },
  { year: '1949', title: 'Divine Manifestation', desc: 'The idol of Ram Lalla miraculously appeared within the disputed structure, intensifying the faith of crores of devotees.' },
  { year: '1986', title: 'Shilanyas Ceremony', desc: 'Shilanyas ceremony was performed on the 9th of November in the presence of saints and lakhs of devotees from across India.' },
  { year: '2019', title: 'Historic Verdict',   desc: 'The Supreme Court delivered its landmark unanimous verdict, paving the divine path for the construction of the temple.' },
  { year: '2020', title: 'Bhoomi Pujan',       desc: 'Prime Minister Narendra Modi performed the sacred Bhoomi Pujan on 5th August, marking the formal beginning of construction.' },
  { year: '2024', title: 'Pran Pratishtha',    desc: 'The grand consecration, Pran Pratishtha, was performed on 22nd January 2024 — a moment of eternal glory for Bharat.' },
];

const PRIESTS: Priest[] = [
  {
    name: 'Pandit Banwari Lal Sharma',
    role: 'Head Priest',
    qualification: 'Vedacharya · Kashi Vidyapith',
    experience: '35+ Years of Seva',
    speciality: 'Vedic Rituals, Rudrabhishek, Pran Pratishtha',
    avatar: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?w=400&q=80',
    isHead: true,
    quote: '"Serving Lord Ram at this sacred birthplace is not merely a duty — it is the fulfilment of a thousand lifetimes of devotion and prayer."',
  },
  {
    name: 'Pandit Krishnapal Sharma',
    role: 'Priest',
    qualification: 'Shastracharya · Sampurnanand Sanskrit University',
    experience: '18+ Years of Seva',
    speciality: 'Sundar Kand, Satyanarayan Katha, Navgraha Pooja',
    avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80',
    isHead: false,
    quote: '"Every mantra recited in this sanctum carries the divine vibration of Ram Naam, purifying the souls of all who receive its grace."',
  },
];

const TRUST_MEMBERS: TrustMember[] = [
  { name: 'Shri Mahant Nrityagopal Das Ji', role: 'President',          since: 'Since 2020', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80', department: 'Spiritual Governance'       },
  { name: 'Shri Champat Rai',               role: 'General Secretary',  since: 'Since 2020', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', department: 'Administration & Legal'     },
  { name: 'Shri Anil Mishra',               role: 'Treasurer',          since: 'Since 2020', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80', department: 'Finance & Accounts'         },
  { name: 'Swami Govind Dev Giri Ji',       role: 'Trustee',            since: 'Since 2020', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&q=80', department: 'Vedic & Cultural Affairs'   },
  { name: 'Dr. Aniruddha Kumar',            role: 'Trustee',            since: 'Since 2021', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80', department: 'Infrastructure & Development'},
  { name: 'Shri Kameshwar Chaupal',         role: 'Trustee',            since: 'Since 2020', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&q=80', department: 'Community Outreach'         },
  { name: 'Shri Virender Kumar Dikshit',    role: 'Trustee',            since: 'Since 2022', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&q=80', department: 'Security & Pilgrim Services'},
  { name: 'Dr. Sadhvi Rituambhara',         role: 'Honorary Trustee',   since: 'Since 2020', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80', department: 'Dharmic Education'          },
];

// ─────────────────────────────────────────────
// SHARED UI HELPERS
// ─────────────────────────────────────────────

const Ornament: React.FC<{ dark?: boolean }> = ({ dark = false }) => (
  <div className={styles.ornament}>
    <div className={dark ? styles.ornamentLineDark  : styles.ornamentLine } />
    <div className={styles.ornamentDiamond} />
    <div className={dark ? styles.ornamentLineDarkR : styles.ornamentLineR} />
  </div>
);

const SectionHeader: React.FC<{ tag: string; heading: string; subtext: string; dark?: boolean }> = ({ tag, heading, subtext, dark = false }) => (
  <div className={styles.sectionHeader}>
    <p className={styles.sectionTag}>{tag}</p>
    <Ornament dark={dark} />
    <h2 className={`${styles.sectionHeading} ${dark ? styles.sectionHeadingLight : ''}`}>{heading}</h2>
    <p  className={`${styles.sectionSubtext}  ${dark ? styles.sectionSubtextLight  : ''}`}>{subtext}</p>
  </div>
);

// ─────────────────────────────────────────────
// CUSTOM CAROUSEL
// Plain divs, CSS transitions, auto-play, responsive
// ─────────────────────────────────────────────

const MembersCarousel: React.FC<{ members: TrustMember[] }> = ({ members }) => {
  const [index,        setIndex]        = useState(0);
  const [perView,      setPerView]      = useState(4);
  const [transitioning,setTransitioning]= useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── responsive perView ─────────────────── */
  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w < 560 ? 1 : w < 900 ? 2 : w < 1200 ? 3 : 4);
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, []);

  const total    = members.length;
  const maxIndex = Math.max(0, total - perView);

  /* ── auto-advance ───────────────────────── */
  const startTimer = useCallback(() => {
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 3200);
  }, [maxIndex]);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [startTimer]);

  const stopTimer  = () => { if (timerRef.current) clearInterval(timerRef.current); };
  const resetTimer = () => { stopTimer(); startTimer(); };

  /* ── navigate ───────────────────────────── */
  const goTo = (next: number) => {
    if (transitioning) return;
    setTransitioning(true);
    setIndex(Math.max(0, Math.min(next, maxIndex)));
    resetTimer();
    setTimeout(() => setTransitioning(false), 420);
  };

  const goPrev = () => goTo(index <= 0 ? maxIndex : index - 1);
  const goNext = () => goTo(index >= maxIndex ? 0 : index + 1);

  /* ── layout math ────────────────────────── */
  // Each card width = (100% - gaps) / perView
  // translateX = index * (cardWidth + gap)
  const GAP = 24; // px — matches CSS gap

  return (
    <div
      className={styles.carousel}
      onMouseEnter={stopTimer}
      onMouseLeave={resetTimer}
    >
      {/* ── Viewport (overflow hidden) ─────── */}
      <div className={styles.carouselViewport}>

        {/* ── Sliding track ───────────────── */}
        <div
          className={styles.carouselTrack}
          style={{
            /* move track left by index * (one card slot width) */
            transform: `translateX(calc(-${index} * (${100 / perView}% + ${GAP / perView}px)))`,
            /* each card occupies equal fraction minus shared gaps */
            gridTemplateColumns: `repeat(${total}, calc(${100 / perView}% - ${GAP * (perView - 1) / perView}px))`,
            gap: `${GAP}px`,
          }}
        >
          {members.map((m) => (
            <div key={m.name} className={styles.memberCard}>

              {/* Animated gold bar */}
              <div className={styles.memberCardBar} />

              {/* Avatar */}
              <div className={styles.memberAvatarWrap}>
                <img
                  src={m.avatar}
                  alt={m.name}
                  className={styles.memberAvatar}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name)}&background=6B0F1A&color=F0D060&size=300&bold=true`;
                  }}
                />
                <div className={styles.memberAvatarShade} />
              </div>

              {/* Info block */}
              <div className={styles.memberInfo}>
                <h4 className={styles.memberName}>{m.name}</h4>
                <p  className={styles.memberRole}>{m.role}</p>
                <div className={styles.memberRuleLine} />
                <p  className={styles.memberDept}>{m.department}</p>
                <span className={styles.memberSince}>{m.since}</span>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ── Prev / Next buttons ─────────────── */}
      <button className={`${styles.carouselBtn} ${styles.carouselBtnL}`} onClick={goPrev} aria-label="Previous">‹</button>
      <button className={`${styles.carouselBtn} ${styles.carouselBtnR}`} onClick={goNext} aria-label="Next">›</button>

      {/* ── Dot indicators ──────────────────── */}
      <div className={styles.carouselDots}>
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────

const About: React.FC = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity   = '1';
            el.style.transform = 'translateY(0)';
            observerRef.current?.unobserve(el);
          }
        });
      },
      { threshold: 0.08 }
    );
    document.querySelectorAll<HTMLElement>('[data-fadein]').forEach((el) => {
      el.style.opacity    = '0';
      el.style.transform  = 'translateY(28px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.6s ease';
      observerRef.current?.observe(el);
    });
    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className={styles.wrapper}>

      {/* ─── 1. HERO ─────────────────────────────────── */}
      <section className={styles.heroBanner}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroFade} />
        <div className={styles.heroContent}>
          <span className={styles.heroOm}>ॐ</span>
          <p className={styles.heroSuptitle}>Shree Ram Mandir · Ayodhya</p>
          <h1 className={styles.heroTitle}>
            <span className={styles.heroTitleSpan}>About the Mandir</span>
          </h1>
          <div className={styles.heroDivider}>
            <div className={styles.heroDivLine}  />
            <div className={styles.heroDivGem}   />
            <div className={styles.heroDivGemS}  />
            <div className={styles.heroDivGem}   />
            <div className={styles.heroDivLineR} />
          </div>
          <p className={styles.heroMantra}>"जहाँ राम वहाँ धर्म" — Where Ram abides, Dharma prevails</p>
        </div>
      </section>

      {/* ─── 2. HISTORY ──────────────────────────────── */}
      <section className={styles.historySection} id="about-history">
        <SectionHeader
          tag="Itihas · इतिहास"
          heading="History of the Sacred Mandir"
          subtext="A journey spanning centuries — from ancient glory through trials of time, to the triumphant Pran Pratishtha of 2024."
        />

        <div className={styles.historyIntro} data-fadein>
          <div className={styles.historyText}>
            <p>Ayodhya, on the banks of the sacred Saryu river, is among the seven holiest cities of Bharat — the birthplace of <strong>Maryada Purushottam Shree Ram</strong>, the seventh avatar of Lord Vishnu and the embodiment of Dharma, righteousness, and compassion.</p>
            <p>The Shree Ram Mandir marks the culmination of a journey of faith spanning over five centuries — from ancient temples to legal battles, from courtroom verdicts to the grandest Bhoomi Pujan in independent India's history, written with the devotion of hundreds of millions of Ramabhaktas.</p>
            <p>Today, the Mandir stands as a <strong>symbol of cultural renaissance, spiritual unity, and eternal Dharma</strong> — welcoming pilgrims from every corner of Bharat and the world, offering darshan, solace, and the divine blessings of Ram Lalla.</p>
          </div>
          <div className={styles.historyStats}>
            {[
              { num: '70+',      label: 'Acres of Temple Complex' },
              { num: '161 ft',   label: 'Height of Main Shikhara'  },
              { num: '392',      label: 'Pillars in the Mandir'    },
              { num: '5 Crore+', label: 'Devotees Annually'        },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statNum}>{s.num}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          <div className={styles.timelineSpine} />
          {MILESTONES.map((m, i) => (
            <div key={m.year} className={`${styles.tlRow} ${i % 2 === 0 ? styles.tlRowLeft : styles.tlRowRight}`} data-fadein>
              <div className={styles.tlDot}><div className={styles.tlDotCore} /></div>
              <div className={styles.tlCard}>
                <span className={styles.tlYear}>{m.year}</span>
                <h3   className={styles.tlTitle}>{m.title}</h3>
                <p    className={styles.tlDesc}>{m.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3. PRIESTS ──────────────────────────────── */}
      <section className={styles.priestsSection} id="about-priests">
        <SectionHeader
          tag="Pujari Parichay · पुजारी परिचय"
          heading="The Sacred Custodians"
          subtext="Our revered priests carry forward the unbroken Vedic tradition, performing daily rituals and sacred ceremonies with complete devotion."
          dark
        />
        <div className={styles.priestsGrid}>
          {PRIESTS.map((p) => (
            <div key={p.name} className={`${styles.priestCard} ${p.isHead ? styles.priestCardHead : ''}`} data-fadein>
              <div className={styles.priestBar} />
              {p.isHead && <div className={styles.priestBadge}>✦ Head Priest</div>}
              <div className={styles.priestImgWrap}>
                <div className={styles.priestRing} />
                <img src={p.avatar} alt={p.name} className={styles.priestImg} loading="lazy" />
                <div className={styles.priestImgShade} />
              </div>
              <div className={styles.priestBody}>
                <h3 className={styles.priestName}>{p.name}</h3>
                <p  className={styles.priestRole}>{p.role}</p>
                <Ornament dark />
                <div className={styles.priestMeta}>
                  {[
                    { k: '🎓 Qualification', v: p.qualification },
                    { k: '🕐 Experience',    v: p.experience    },
                    { k: '🪔 Speciality',    v: p.speciality    },
                  ].map((r) => (
                    <div key={r.k} className={styles.priestRow}>
                      <span className={styles.priestKey}>{r.k}</span>
                      <span className={styles.priestVal}>{r.v}</span>
                    </div>
                  ))}
                </div>
                <blockquote className={styles.priestQuote}>{p.quote}</blockquote>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. TRUST DETAILS ────────────────────────── */}
      <section className={styles.trustSection} id="about-trust">
        <SectionHeader
          tag="Pranyas Parichay · प्रन्यास परिचय"
          heading="Shree Ram Mandir Pranyas"
          subtext="The governing body entrusted with the sacred responsibility of constructing, managing, and preserving the divine temple complex."
        />
        <div className={styles.trustGrid} data-fadein>

          {/* Emblem */}
          <div className={styles.trustEmblem}>
            <div className={styles.trustRing}>
              <span className={styles.trustOm}>ॐ</span>
            </div>
            <p className={styles.trustEmblemTitle}>श्री राम मन्दिर प्रन्यास</p>
            <p className={styles.trustEmblemSub}>Sanatan Dharam Sabha</p>
          </div>

          {/* Detail card */}
          <div className={styles.trustCard}>
            <h3 className={styles.trustName}>
              Shree Ram Mandir Pranyas
              <br /><span className={styles.trustNameHi}>सनातन धर्म सभा</span>
            </h3>
            <p className={styles.trustDesc}>The <strong>Shree Ram Mandir Pranyas Sanatan Dharam Sabha</strong> is the official trust body constituted under the Government of India's notification to oversee the construction and perpetual management of the Shree Ram Janmabhoomi Mandir at Ayodhya.</p>
            <p className={styles.trustDesc}>Established in February 2020, the Trust is empowered to acquire movable and immovable properties, raise funds, and undertake all activities related to the construction, management, and maintenance of the temple and allied infrastructure across the 67.703 acres of land.</p>
            <p className={styles.trustDesc}>The Sabha remains committed to upholding <strong>Sanatana Dharma</strong>, promoting Vedic education through the Veda Pathshala, running daily Annadaan seva, and maintaining the temple as a living centre of culture, spirituality, and divine service.</p>
            <div className={styles.trustFacts}>
              {[
                { icon: '📅', k: 'Established',   v: 'February 5, 2020'                      },
                { icon: '⚖️', k: 'Authority',      v: 'Govt. of India Gazette Notification'   },
                { icon: '🏛️', k: 'Registered As', v: 'Public Charitable Trust'               },
                { icon: '📍', k: 'Headquarters',   v: 'Ayodhya, Uttar Pradesh'                },
                { icon: '🌐', k: 'Website',        v: 'shreeram.mandir.gov.in'                },
                { icon: '📞', k: 'Contact',        v: '1800-XXX-XXXX (Toll Free)'             },
              ].map((f) => (
                <div key={f.k} className={styles.factItem}>
                  <span className={styles.factIcon}>{f.icon}</span>
                  <div>
                    <span className={styles.factKey}>{f.k}</span>
                    <p    className={styles.factVal}>{f.v}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. TRUST MEMBERS CAROUSEL ───────────────── */}
      <section className={styles.membersSection} id="about-members">
        <SectionHeader
          tag="Sadasya Parichay · सदस्य परिचय"
          heading="Trust Members"
          subtext="Distinguished individuals entrusted with the divine responsibility of guiding the Pranyas with wisdom, devotion, and service."
          dark
        />
        <div data-fadein>
          <MembersCarousel members={TRUST_MEMBERS} />
        </div>
      </section>

    </div>
  );
};

export default About;
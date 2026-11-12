'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { institute, navigationItems } from '../../data/home';
import { getCourseArtwork } from '../../data/course-assets';
import Icon from '../public/Icon';
import styles from './home-page.module.css';
import refinement from './home-refinement.module.css';

const popularCourses = [
  ['Basic Computer', 'basic-computer'], ['Advance Basic', 'advance-basic'], ['Office Automation', 'office-automation'], ['DCA', 'dca'], ['ADCA', 'adca'], ['MDCA', 'mdca'], ['Accounts', 'accounts'], ['Tally / GST', 'tally-gst'],
  ['Punjabi Typing', 'punjabi-typing'], ['Hindi Typing', 'hindi-typing'], ['Graphic Designing', 'graphic-designing'], ['Web Designing', 'web-designing'], ['AutoCAD', 'autocad'], ['HTML', 'html'], ['Programming', 'programming'], ['Python', 'python'], ['Networking', 'networking'], ['Hardware', 'hardware'],
];

const courseRows = [popularCourses.slice(0, 8), popularCourses.slice(8)];

const skills = ['MS Word', 'Excel', 'PowerPoint', 'Tally', 'GST', 'Photoshop', 'Web Design', 'Python', 'C++', 'Java', 'Hardware', 'Networking', 'AutoCAD'];
const benefits = [
  ['practice', 'Practical Training', 'Hands-on learning with real-world projects.'],
  ['certificate', 'Updated Curriculum', 'Industry-relevant tools and software.'],
  ['faculty', 'Individual Attention', 'Personal guidance to help you learn better.'],
  ['online', 'Online Learning Available', 'Study from home with live classes.'],
  ['support', 'Career Support', 'Resume help, interview prep and placement assistance.'],
];
const journey = [
  ['book', 'Choose Your Course', 'Pick the course that matches your goals.'],
  ['faculty', 'Learn Practical Skills', 'Attend classes and learn from expert trainers.'],
  ['practice', 'Practice on Real Tasks', 'Work on projects and improve your skills.'],
  ['certificate', 'Build Your Future', 'Gain confidence and take the next step.'],
];

export default function HomePage() {
  const [counts, setCounts] = useState([0, 0, 0, 0]);
  const carouselRefs = useRef([]);
  const pauseUntil = useRef([]);
  const dragState = useRef([]);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const reducedMotionFrame = requestAnimationFrame(() => setCounts([5000, 20, 100, 100]));
      return () => cancelAnimationFrame(reducedMotionFrame);
    }
    const targets = [5000, 20, 100, 100];
    const duration = 3000;
    let frame;
    const started = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCounts(targets.map((target) => Math.round(target * eased)));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const autoplay = window.setInterval(() => {
      carouselRefs.current.forEach((row, index) => {
        if (!row || Date.now() < (pauseUntil.current[index] || 0)) return;
        const direction = index === 0 ? 1 : -1;
        const amount = Math.max(220, row.clientWidth / 4) * direction;
        const atEnd = direction > 0 ? row.scrollLeft + row.clientWidth >= row.scrollWidth - 4 : row.scrollLeft <= 4;
        if (atEnd) row.scrollTo({ left: direction > 0 ? 0 : row.scrollWidth, behavior: 'smooth' });
        else row.scrollBy({ left: amount, behavior: 'smooth' });
      });
    }, 4200);
    return () => window.clearInterval(autoplay);
  }, []);

  const pauseCarousel = useCallback((index) => { pauseUntil.current[index] = Date.now() + 8000; }, []);
  const moveCarousel = useCallback((index, direction) => {
    const row = carouselRefs.current[index];
    if (!row) return;
    pauseCarousel(index);
    row.scrollBy({ left: direction * Math.max(230, row.clientWidth / 3.8), behavior: 'smooth' });
  }, [pauseCarousel]);
  const beginDrag = useCallback((event, index) => {
    const row = carouselRefs.current[index];
    if (!row) return;
    dragState.current[index] = { x: event.clientX, scrollLeft: row.scrollLeft };
    row.setPointerCapture?.(event.pointerId);
    pauseCarousel(index);
  }, [pauseCarousel]);
  const drag = useCallback((event, index) => {
    const row = carouselRefs.current[index];
    const state = dragState.current[index];
    if (!row || !state) return;
    row.scrollLeft = state.scrollLeft - (event.clientX - state.x);
  }, []);
  const endDrag = useCallback((index) => { dragState.current[index] = null; }, []);

  return (
    <div className={styles.page} id="home">
      <header className={`${styles.header} ${refinement.header}`}>
        <Link href="/" className={`${styles.brand} ${refinement.brand}`} aria-label="VCCI home">
          <Image src="/images/logo/vcci-logo.jpg" width={1129} height={1129} alt="VCCI logo" priority />
          <span><b>VISION</b><strong>COMPUTER &amp; COACHING INSTITUTE</strong><small>Input Student, Output Success</small></span>
        </Link>
        <nav aria-label="Main navigation">
          {navigationItems.map((item) => <Link key={item.pageHref} href={item.pageHref} className={item.pageHref === '/' ? styles.active : ''}>{item.label}</Link>)}
        </nav>
        <Link className={styles.enquire} href="/enquiry">Enquire Now <span aria-hidden="true">↗</span></Link>
      </header>

      <main>
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Shape your future with technology</p>
            <h1 id="hero-title">Learn Today,<br /><em>Lead Tomorrow.</em></h1>
            <p className={styles.heroText}>Practical computer education that builds real skills and opens the door to endless opportunities.</p>
            <div className={styles.heroActions}>
              <Link href="/courses">Explore Courses <span aria-hidden="true">→</span></Link>
              <Link href="/enquiry">Enquire Now <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className={styles.heroArt}>
            <Image src="/images/home/hero/photo_1_2026-08-11_18-59-44.jpg" fill priority sizes="(max-width: 900px) 100vw, 58vw" alt="Two students walking toward a technology-focused future" />
          </div>
        </section>

        <section className={styles.stats} aria-label="VCCI highlights">
          {[
            ['faculty', '+', 'Students Trained'],
            ['certificate', '+', 'Expert Trainers'],
            ['practice', '%', 'Practical Learning'],
            ['briefcase', '%', 'Placement Support'],
          ].map(([icon, suffix, label], index) => <div key={label}><Icon name={icon} /><span><b>{counts[index]}{suffix}</b><small>{label}</small></span></div>)}
        </section>

        <section className={styles.courses} aria-labelledby="courses-heading">
          <div className={styles.sectionHeading}><p>Explore focused learning paths</p><h2 id="courses-heading">Popular Courses</h2></div>
          <div className={styles.carouselGroup}>
            {courseRows.map((courses, rowIndex) => <div className={styles.carousel} key={`course-row-${rowIndex}`}>
              <div className={styles.carouselControls} aria-label={`Course carousel row ${rowIndex + 1} controls`}><button type="button" onClick={() => moveCarousel(rowIndex, -1)} aria-label="Previous courses">←</button><button type="button" onClick={() => moveCarousel(rowIndex, 1)} aria-label="Next courses">→</button></div>
              <div className={styles.courseTrack} ref={(element) => { carouselRefs.current[rowIndex] = element; }} onPointerDown={(event) => beginDrag(event, rowIndex)} onPointerMove={(event) => drag(event, rowIndex)} onPointerUp={() => endDrag(rowIndex)} onPointerCancel={() => endDrag(rowIndex)} onWheel={() => pauseCarousel(rowIndex)}>
                {courses.map(([title]) => <article className={refinement.courseCard} key={title}>
                  <div className={`${styles.courseVisual} ${refinement.courseVisual}`}>{getCourseArtwork(title) ? <Image src={getCourseArtwork(title)} width={600} height={400} sizes="(max-width: 600px) 44vw, (max-width: 900px) 29vw, 280px" alt={`${title} course visual`} /> : <Icon name={title === 'Accounts' ? 'briefcase' : title === 'Graphic Designing' ? 'certificate' : title === 'AutoCAD' ? 'infrastructure' : 'online'} />}</div>
                  <div className={refinement.courseBody}><h3>{title}</h3></div>
                </article>)}
              </div>
            </div>)}
          </div>
          <Link className={styles.allCourses} href="/courses">View All Courses <span aria-hidden="true">→</span></Link>
        </section>

        <section className={styles.skills} aria-label="Skills you can learn">
          <b>Skills you<br />can learn</b>
          <div>{skills.map((skill, index) => <span key={skill}><i aria-hidden="true">{index === 8 ? 'C+' : skill.slice(0, 1)}</i>{skill}</span>)}</div>
        </section>

        <section className={styles.why} aria-labelledby="why-heading">
          <div className={styles.sectionHeading}><p>Learning built around your progress</p><h2 id="why-heading">Why Choose VCCI?</h2></div>
          <div className={styles.benefitGrid}>{benefits.map(([icon, title, description]) => <article key={title}><Icon name={icon} /><div><h3>{title}</h3><p>{description}</p></div></article>)}</div>
        </section>

        <section className={styles.journey} aria-labelledby="journey-heading">
          <div className={styles.sectionHeading}><p>A clear path from learning to confidence</p><h2 id="journey-heading">Your Journey at VCCI</h2></div>
          <div className={styles.journeyGrid}>{journey.map(([icon, title, description], index) => <article key={title}><Icon name={icon} /><div><h3>{title}</h3><p>{description}</p></div>{index < journey.length - 1 && <span className={styles.arrow} aria-hidden="true">→</span>}</article>)}</div>
        </section>

        <section className={styles.guidance} aria-labelledby="guidance-heading">
          <div><p>Course guidance</p><h2 id="guidance-heading">Not sure which <em>course is right for you?</em></h2><span>Tell us your interest and we will help you choose the perfect course.</span></div>
          <Link href="/enquiry">Get Course Guidance <span aria-hidden="true">→</span></Link>
        </section>

        <section className={styles.cta} aria-labelledby="cta-heading">
          <div><p>Start your learning journey</p><h2 id="cta-heading">Ready to Build Your Future?</h2><span>Join VCCI today and take the first step towards a successful career.</span></div>
          <div><Link href="/student-zone">Student Zone <span aria-hidden="true">→</span></Link><a href={institute.mapsUrl} target="_blank" rel="noreferrer">Get Directions <span aria-hidden="true">↗</span></a></div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerBrand}><Image src="/images/logo/vcci-logo.jpg" width={1129} height={1129} alt="VCCI logo" /><span><b>Vision Computer &amp; Coaching Institute</b><small>Input Student, Output Success.</small></span></div>
        <div><b>Quick Links</b><Link href="/about">About Us</Link><Link href="/courses">Courses</Link><Link href="/student-zone">Student Zone</Link><Link href="/gallery">Gallery</Link></div>
        <div><b>Contact Information</b><a href="tel:+917710638292">+91 77106-38292</a><a href="tel:+916280878187">+91 62808-78187</a><a href={`mailto:${institute.email}`}>{institute.email}</a><a href={institute.mapsUrl} target="_blank" rel="noreferrer">{institute.location} ↗</a></div>
      </footer>
    </div>
  );
}

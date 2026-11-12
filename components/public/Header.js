'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { institute, navigationItems } from '../../data/home';
import styles from './header.module.css';

export default function Header() {
  const [activeSection, setActiveSection] = useState('#home');
  const pathname = usePathname();

  useEffect(() => {
    const sections = navigationItems
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visibleSection = entries.find((entry) => entry.isIntersecting);
      if (visibleSection) setActiveSection(`#${visibleSection.target.id}`);
    }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleNavigation = (href) => {
    setActiveSection(href);
  };

  return (
    <header className={styles.header}>
      <div className={styles.topbar}>
        <div className={styles.topbarInner}>
          <div className={styles.topbarContact}>
            <a href="tel:+917710638292">+91 77106-38292</a><span aria-hidden="true">•</span><a href="tel:+916280878187">+91 62808-78187</a>
          </div>
          <a href={`mailto:${institute.email}`}>{institute.email}</a>
        </div>
      </div>
      <div className={styles.navbar}>
        <Link className={styles.brand} href="/" aria-label={`${institute.name} home`} onClick={() => handleNavigation('#home')}>
          <Image className={styles.brandLogo} src="/images/logo/vcci-logo.jpg" width={1129} height={1129} sizes="48px" priority alt="VCCI logo" />
          <span><strong>VCCI</strong><small>Computer &amp; Coaching</small></span>
        </Link>
        <nav className={styles.nav} id="primary-navigation" aria-label="Primary navigation">
          {navigationItems.map((item) => {
            const isCurrent = pathname === '/' ? activeSection === item.href : pathname === item.pageHref;
            return <a className={isCurrent ? styles.active : ''} key={item.href} href={item.pageHref} aria-current={isCurrent ? 'page' : undefined} onClick={() => handleNavigation(item.href)}>{item.label}</a>;
          })}
        </nav>
        <a className={styles.desktopCta} href="/enquiry">Enquire Now</a>
      </div>
    </header>
  );
}

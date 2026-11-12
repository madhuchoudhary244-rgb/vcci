import { institute, navigationItems } from '../../data/home';
import Image from 'next/image';
import styles from './footer.module.css';

export default function Footer() {
  return <footer className={styles.footer}>
    <div className={styles.inner}>
      <div className={styles.brand}><Image className={styles.logo} src="/images/logo/vcci-logo.jpg" width={1129} height={1129} sizes="70px" alt="VCCI logo" /><div><p className={styles.mark}>VCCI</p><h2>{institute.name}</h2><p>{institute.tagline}</p></div></div>
      <div><h3>Quick Links</h3><nav aria-label="Footer navigation">{navigationItems.slice(1).map((item) => <a key={item.href} href={item.pageHref}>{item.label}</a>)}<a href="/enquiry">Enquire Now</a></nav></div>
      <address><h3>Contact</h3><a href="tel:+917710638292">+91 77106-38292</a><a href="tel:+916280878187">+91 62808-78187</a><a href={`mailto:${institute.email}`}>{institute.email}</a><p>{institute.location}</p><a className={styles.mapsLink} href={institute.mapsUrl} target="_blank" rel="noopener noreferrer">Get Directions</a></address>
    </div>
    <div className={styles.bottom}><p>© {new Date().getFullYear()} VCCI. All rights reserved.</p><span>Privacy Policy</span><span>Terms &amp; Conditions</span></div>
  </footer>;
}

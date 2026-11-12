import PageIntro from '../../components/public/PageIntro';
import PublicPage from '../../components/public/PublicPage';
import { branches, institute } from '../../data/home';
import styles from '../../components/public/public-page.module.css';

export const metadata = { title: 'Contact & Location | VCCI Ludhiana', description: 'Contact Vision Computer & Coaching Institute in Ludhiana or open the institute location in Google Maps.' };

export default function ContactPage() {
  return <PublicPage><main><PageIntro eyebrow="Contact & location" title="Connect with VCCI." text="Contact the institute for course information, admissions, and other enquiries." />
    <section className={styles.page}><div className={styles.container}><div className={styles.contactGrid}><section className={styles.contactCard}><h2>Contact details</h2><a href="tel:+917710638292">+91 77106-38292</a><a href="tel:+916280878187">+91 62808-78187</a><a href={`mailto:${institute.email}`}>{institute.email}</a><p>For course information, admissions, or an institute visit, contact VCCI directly.</p></section><section className={styles.branchCard}><p className={styles.branchTag}>Location</p><h2>{branches[0].name}</h2><p>{branches[0].location}</p><a className={styles.directions} href={branches[0].mapsUrl} target="_blank" rel="noreferrer">Open in Google Maps</a></section></div></div></section>
  </main></PublicPage>;
}

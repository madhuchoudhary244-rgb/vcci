import PageIntro from '../../components/public/PageIntro';
import PublicPage from '../../components/public/PublicPage';
import StudentZoneForm from '../../components/public/StudentZoneForm';
import styles from '../../components/public/public-page.module.css';

export const metadata = { title: 'Student Zone | VCCI', description: 'VCCI Student Zone for published result lookup using Roll Number and Date of Birth.' };

export default function StudentZonePage() {
  return <PublicPage><main><PageIntro eyebrow="Student Zone" title="Access published results when the service is available." text="Use your Roll Number and Date of Birth to view your published result." />
    <section className={styles.page}><div className={styles.container}><div className={styles.studentPanel}><div><p className={styles.eyebrow}>Result lookup</p><h2>Simple result access.</h2><p>Enter your Roll Number and Date of Birth to view results that have been published by VCCI.</p></div><div className={styles.formWrap}><p>Enter your details</p><StudentZoneForm /></div></div></div></section>
  </main></PublicPage>;
}

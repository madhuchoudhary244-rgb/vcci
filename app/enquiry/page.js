import EnquiryForm from '../../components/public/EnquiryForm';
import PageIntro from '../../components/public/PageIntro';
import PublicPage from '../../components/public/PublicPage';
import styles from '../../components/public/public-page.module.css';

export const metadata = { title: 'Enquire Now | VCCI Ludhiana', description: 'Send a course enquiry to Vision Computer & Coaching Institute, Ludhiana.' };

export default async function EnquiryPage({ searchParams }) {
  const { course = '' } = await searchParams;
  return <PublicPage><main><PageIntro eyebrow="Enquire Now" title="Start your conversation with VCCI." text="Share a few details and the institute will contact you." /><section className={styles.page}><div className={styles.container}><div className={styles.enquiryLayout}><div><p className={styles.sectionLabel}>Course enquiry</p><h2>Tell us how we can help.</h2><p>Student name, guardian name, and mobile number are all that is required.</p></div><EnquiryForm selectedCourse={course} /></div></div></section></main></PublicPage>;
}

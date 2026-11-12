import Link from 'next/link';
import PageIntro from '../../components/public/PageIntro';
import PublicPage from '../../components/public/PublicPage';
import CoursesCatalog from '../../components/courses/CoursesCatalog';
import styles from '../../components/public/public-page.module.css';

export const metadata = { title: 'Computer Courses | VCCI Ludhiana', description: 'Explore VCCI computer, typing, design, programming, networking and hardware course options in Ludhiana.' };

export default function CoursesPage() {
  return <PublicPage><main><PageIntro eyebrow="VCCI courses" title="Course options for practical technology learning." text="Explore each course area, then enquire with VCCI for course-specific information." />
    <section className={styles.page}><div className={styles.container}><CoursesCatalog /><p className={styles.courseNote}>Course duration, fees, eligibility, syllabus and other course-specific details are available directly from the institute.</p></div></section>
  </main></PublicPage>;
}

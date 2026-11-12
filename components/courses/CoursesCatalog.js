import Link from 'next/link';
import Icon from '../public/Icon';
import { courseGroups } from '../../data/home';
import { getCourseDetail, getCourseSlug } from '../../data/course-details';
import { getCourseArtwork } from '../../data/course-assets';
import styles from './courses-catalog.module.css';

const accents = { DCA: 'blue', ADCA: 'teal', MDCA: 'violet', 'Punjabi Typing': 'gurmukhi', 'Hindi Typing': 'devanagari', Accounts: 'accounts' };

export default function CoursesCatalog() {
  return <div className={styles.groups}>{courseGroups.map((group) => <section className={styles.group} key={group.title}><div className={styles.groupHeading}><p>VCCI learning pathways</p><h2>{group.title}</h2></div><div className={styles.grid}>{group.courses.map((title) => {
    const course = getCourseDetail(getCourseSlug(title));
    const image = getCourseArtwork(title);
    return <article className={`${styles.card} ${styles[accents[title] || 'navy']}`} style={image ? { '--course-art': `url("${image}")` } : undefined} key={title}>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.cardContent}><span className={styles.icon}><Icon name={course.visual} /></span><h3>{course.title}</h3><p>{course.overview}</p><Link href={`/courses/${course.slug}`}>View Details <Icon name="arrow" /></Link></div>
    </article>;
  })}</div></section>)}</div>;
}

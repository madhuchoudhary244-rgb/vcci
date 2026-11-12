import Link from 'next/link';
import { notFound } from 'next/navigation';
import Icon from '../../../components/public/Icon';
import PageIntro from '../../../components/public/PageIntro';
import PublicPage from '../../../components/public/PublicPage';
import { courseDetails, getCourseDetail } from '../../../data/course-details';
import styles from '../../../components/public/public-page.module.css';

export const dynamicParams = false;

export function generateStaticParams() {
  return courseDetails.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const course = getCourseDetail(slug);
  return course ? { title: `${course.title} Course | VCCI`, description: course.overview } : {};
}

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;
  const course = getCourseDetail(slug);
  if (!course) notFound();
  return <PublicPage><main><PageIntro eyebrow="VCCI course" title={course.title} text={course.overview} /><section className={styles.page}><div className={styles.container}><article className={styles.courseDetail}><div className={styles.detailVisual}><Icon name={course.visual} /></div><div><p className={styles.sectionLabel}>What you can explore</p><h2>Build practical understanding.</h2><ul>{course.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul></div><div className={styles.courseDetailCopy}><p><strong>Practical relevance</strong>{course.relevance}</p><p><strong>Who it may suit</strong>{course.suitableFor}</p><Link className="button buttonPrimary" href={`/enquiry?course=${encodeURIComponent(course.title)}`}>Enquire About This Course <Icon name="arrow" /></Link><Link className={styles.backLink} href="/courses">Back to Courses</Link></div></article></div></section></main></PublicPage>;
}

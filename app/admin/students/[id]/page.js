import Link from 'next/link';
import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import StudentDetails from '../../../../components/admin/StudentDetails';
import styles from '../../../../components/admin/admin.module.css';

export const metadata = { title: 'Student Details | VCCI Admin', robots: { index: false, follow: false } };

export default async function StudentDetailsPage({ params }) {
  const { id } = await params;
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Student Details" action={<Link className={styles.secondaryLink} href="/admin/students">Back to Students</Link>} /><section className={styles.dashboardCard}><StudentDetails studentId={id} /></section></section></main></AdminAuthGuard>;
}

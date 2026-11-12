import Link from 'next/link';
import AdminAuthGuard from '../../../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../../../components/admin/AdminPageHeader';
import StudentForm from '../../../../../components/admin/StudentForm';
import styles from '../../../../../components/admin/admin.module.css';

export const metadata = { title: 'Edit Student | VCCI Admin', robots: { index: false, follow: false } };

export default async function EditStudentPage({ params }) {
  const { id } = await params;
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Edit Student" action={<Link className={styles.secondaryLink} href={`/admin/students/${id}`}>Back to Details</Link>} /><section className={styles.dashboardCard}><StudentForm studentId={id} /></section></section></main></AdminAuthGuard>;
}

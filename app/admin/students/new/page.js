import Link from 'next/link';
import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import StudentForm from '../../../../components/admin/StudentForm';
import styles from '../../../../components/admin/admin.module.css';

export const metadata = { title: 'Add Student | VCCI Admin', robots: { index: false, follow: false } };

export default function NewStudentPage() {
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Add Student" description="Create a private student record." action={<Link className={styles.secondaryLink} href="/admin/students">Back to Students</Link>} /><section className={styles.dashboardCard}><StudentForm /></section></section></main></AdminAuthGuard>;
}

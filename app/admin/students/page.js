import Link from 'next/link';
import AdminAuthGuard from '../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import StudentsList from '../../../components/admin/StudentsList';
import styles from '../../../components/admin/admin.module.css';

export const metadata = { title: 'Student Management | VCCI Admin', robots: { index: false, follow: false } };

export default function StudentsPage() {
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Student Management" description="Private student records are available only to authorized administrators." action={<><Link className={styles.secondaryLink} href="/admin/dashboard">Dashboard</Link><Link className={styles.primaryLink} href="/admin/students/new">Add Student</Link></>} /><StudentsList /></section></main></AdminAuthGuard>;
}

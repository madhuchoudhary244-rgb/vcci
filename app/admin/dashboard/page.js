import AdminAuthGuard from '../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import Link from 'next/link';
import styles from '../../../components/admin/admin.module.css';

export const metadata = { title: 'Admin Dashboard | VCCI', robots: { index: false, follow: false } };

export default function AdminDashboardPage() {
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Admin Dashboard" /><div className={styles.dashboardGrid}><section className={styles.dashboardCard}><h2>Student Management</h2><p>Create and maintain private student records with Firestore-rule authorization and roll-number protection.</p><Link className={styles.primaryLink} href="/admin/students">Open Student Management</Link></section><section className={styles.dashboardCard}><h2>Result Management</h2><p>Create, publish, and maintain private student result records.</p><Link className={styles.primaryLink} href="/admin/results">Open Result Management</Link></section><section className={styles.dashboardCard}><h2>Gallery</h2><p>Create and manage official event galleries and photographs.</p><Link className={styles.primaryLink} href="/admin/gallery">Open Gallery Management</Link></section><section className={styles.dashboardCard}><h2>Enquiries</h2><p>Review and manage private website enquiries from prospective students.</p><Link className={styles.primaryLink} href="/admin/enquiries">Open Enquiries</Link></section></div></section></main></AdminAuthGuard>;
}

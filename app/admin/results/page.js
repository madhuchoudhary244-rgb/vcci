import Link from 'next/link';
import AdminAuthGuard from '../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import ResultsList from '../../../components/admin/ResultsList';
import styles from '../../../components/admin/admin.module.css';

export const metadata = { title: 'Result Management | VCCI Admin', robots: { index: false, follow: false } };

export default function ResultsPage() {
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Result Management" description="Create and maintain private student result records." action={<><Link className={styles.secondaryLink} href="/admin/dashboard">Dashboard</Link><Link className={styles.primaryLink} href="/admin/results/new">Add Result</Link></>} /><ResultsList /></section></main></AdminAuthGuard>;
}

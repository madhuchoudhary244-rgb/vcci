import Link from 'next/link';
import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import ResultForm from '../../../../components/admin/ResultForm';
import styles from '../../../../components/admin/admin.module.css';

export const metadata = { title: 'Add Result | VCCI Admin', robots: { index: false, follow: false } };

export default function NewResultPage() {
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Add Result" description="Create a private result for an existing student." action={<Link className={styles.secondaryLink} href="/admin/results">Back to Results</Link>} /><section className={styles.dashboardCard}><ResultForm /></section></section></main></AdminAuthGuard>;
}

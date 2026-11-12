import Link from 'next/link';
import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import ResultDetails from '../../../../components/admin/ResultDetails';
import styles from '../../../../components/admin/admin.module.css';

export const metadata = { title: 'Result Details | VCCI Admin', robots: { index: false, follow: false } };

export default async function ResultDetailsPage({ params }) {
  const { id } = await params;
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Result Details" action={<Link className={styles.secondaryLink} href="/admin/results">Back to Results</Link>} /><section className={styles.dashboardCard}><ResultDetails resultId={id} /></section></section></main></AdminAuthGuard>;
}

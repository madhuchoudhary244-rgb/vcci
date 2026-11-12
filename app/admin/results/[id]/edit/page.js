import Link from 'next/link';
import AdminAuthGuard from '../../../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../../../components/admin/AdminPageHeader';
import ResultForm from '../../../../../components/admin/ResultForm';
import styles from '../../../../../components/admin/admin.module.css';

export const metadata = { title: 'Edit Result | VCCI Admin', robots: { index: false, follow: false } };

export default async function EditResultPage({ params }) {
  const { id } = await params;
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Edit Result" action={<Link className={styles.secondaryLink} href={`/admin/results/${id}`}>Back to Details</Link>} /><section className={styles.dashboardCard}><ResultForm resultId={id} /></section></section></main></AdminAuthGuard>;
}

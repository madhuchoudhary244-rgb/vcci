import AdminAuthGuard from '../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import EnquiriesList from '../../../components/admin/EnquiriesList';
import Link from 'next/link';
import styles from '../../../components/admin/admin.module.css';

export const metadata = { title: 'Enquiries | VCCI Admin', robots: { index: false, follow: false } };

export default function EnquiriesPage() {
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Enquiries" description="Private website enquiries submitted through the public VCCI form." action={<Link className={styles.secondaryLink} href="/admin/dashboard">Dashboard</Link>} /><EnquiriesList /></section></main></AdminAuthGuard>;
}

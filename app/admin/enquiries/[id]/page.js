import AdminAuthGuard from '../../../../components/admin/AdminAuthGuard';
import EnquiryDetails from '../../../../components/admin/EnquiryDetails';
import AdminPageHeader from '../../../../components/admin/AdminPageHeader';
import Link from 'next/link';
import styles from '../../../../components/admin/admin.module.css';

export const metadata = { title: 'Enquiry Details | VCCI Admin', robots: { index: false, follow: false } };

export default async function EnquiryDetailsPage({ params }) {
  const { id } = await params;
  return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Enquiry Details" action={<Link className={styles.secondaryLink} href="/admin/enquiries">Back to Enquiries</Link>} /><section className={styles.dashboardCard}><EnquiryDetails enquiryId={id} /></section></section></main></AdminAuthGuard>;
}

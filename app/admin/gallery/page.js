import AdminAuthGuard from '../../../components/admin/AdminAuthGuard';
import AdminPageHeader from '../../../components/admin/AdminPageHeader';
import GalleryManager from '../../../components/admin/GalleryManager';
import styles from '../../../components/admin/admin.module.css';
export const metadata = { title: 'Gallery Management | VCCI Admin', robots: { index: false, follow: false } };
export default function AdminGalleryPage() { return <AdminAuthGuard><main className={styles.page}><section className={styles.dashboard}><AdminPageHeader title="Gallery Management" description="Create official VCCI event galleries and add up to six photos per event." /><section className={styles.dashboardCard}><GalleryManager /></section></section></main></AdminAuthGuard>; }

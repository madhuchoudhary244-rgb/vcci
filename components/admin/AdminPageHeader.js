import Link from 'next/link';
import AdminLogoutButton from './AdminLogoutButton';
import styles from './admin.module.css';

export default function AdminPageHeader({ title, description, action }) {
  return <header className={styles.dashboardHeader}><div><p className={styles.eyebrow}>VCCI administration</p><h1>{title}</h1>{description && <p className={styles.pageDescription}>{description}</p>}</div><div className={styles.headerActions}>{action}<AdminLogoutButton /></div></header>;
}

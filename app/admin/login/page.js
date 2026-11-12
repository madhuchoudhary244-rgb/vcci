import AdminLoginForm from '../../../components/admin/AdminLoginForm';
import styles from '../../../components/admin/admin.module.css';

export const metadata = { title: 'Admin Sign In | VCCI', robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return <main className={styles.page}><section className={styles.card} aria-labelledby="admin-login-title"><p className={styles.eyebrow}>VCCI administration</p><h1 id="admin-login-title">Sign in</h1><p>Use your approved administrator account to continue.</p><AdminLoginForm /></section></main>;
}

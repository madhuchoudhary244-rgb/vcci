'use client';

import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { firebaseAuth } from '../../services/firebase';
import styles from './admin.module.css';

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(firebaseAuth);
    router.replace('/admin/login');
  }

  return <button className={styles.logout} type="button" onClick={handleLogout}>Sign out</button>;
}

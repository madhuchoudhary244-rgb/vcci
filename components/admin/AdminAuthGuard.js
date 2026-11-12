'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { hasFirestoreAdminAccess } from '../../services/admin-auth';
import { firebaseAuth } from '../../services/firebase';
import styles from './admin.module.css';

export default function AdminAuthGuard({ children }) {
  const router = useRouter();
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        router.replace('/admin/login');
        return;
      }
      try {
        if (await hasFirestoreAdminAccess(user.uid)) setStatus('authorized');
        else {
          await signOut(firebaseAuth);
          router.replace('/admin/login');
        }
      } catch {
        await signOut(firebaseAuth);
        router.replace('/admin/login');
      }
    });
    return unsubscribe;
  }, [router]);

  if (status !== 'authorized') return <main className={styles.status}>Checking admin access…</main>;
  return children;
}

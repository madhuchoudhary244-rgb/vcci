'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { hasFirestoreAdminAccess } from '../../services/admin-auth';
import { firebaseAuth } from '../../services/firebase';
import styles from './admin.module.css';

export default function AdminLoginForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) return;
      try {
        if (await hasFirestoreAdminAccess(user.uid)) router.replace('/admin/dashboard');
        else await signOut(firebaseAuth);
      } catch {
        setMessage('Unable to verify admin access. Please try again.');
      }
    });
    return unsubscribe;
  }, [router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    try {
      const credential = await signInWithEmailAndPassword(
        firebaseAuth,
        formData.get('email'),
        formData.get('password'),
      );
      if (!(await hasFirestoreAdminAccess(credential.user.uid))) {
        await signOut(firebaseAuth);
        setMessage('This account is not authorized for admin access.');
        return;
      }
      router.replace('/admin/dashboard');
    } catch {
      setMessage('Unable to sign in. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className={styles.form} onSubmit={handleSubmit}>
    <div className={styles.field}><label htmlFor="admin-email">Email address</label><input id="admin-email" name="email" type="email" autoComplete="email" required /></div>
    <div className={styles.field}><label htmlFor="admin-password">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required /></div>
    <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button>
    <p className={styles.message} role="status">{message}</p>
  </form>;
}

import 'server-only';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

function getAdminConfig() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!projectId || !clientEmail || !privateKey) return null;
  return { projectId, clientEmail, privateKey };
}

function getAdminApp() {
  const config = getAdminConfig();
  if (!config) {
    const error = new Error('firebase-admin-not-configured');
    error.code = 'firebase-admin-not-configured';
    throw error;
  }
  return getApps().length ? getApp() : initializeApp({ credential: cert(config) });
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminStorage() {
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    const error = new Error('firebase-storage-not-configured');
    error.code = 'firebase-storage-not-configured';
    throw error;
  }
  return getStorage(getAdminApp()).bucket(bucketName);
}

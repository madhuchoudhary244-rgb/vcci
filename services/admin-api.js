import { firebaseAuth } from './firebase';

export async function adminFetch(url, options = {}) {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error('unauthorized');
  const token = await user.getIdToken();
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const response = await fetch(url, {
    ...options,
    headers: { ...(isFormData ? {} : { 'Content-Type': 'application/json' }), Authorization: `Bearer ${token}`, ...options.headers },
  });
  const payload = await response.json();
  if (!response.ok) {
    const error = new Error(payload.message || 'request-failed');
    error.code = response.status === 401 ? 'unauthorized' : 'request-failed';
    throw error;
  }
  return payload;
}

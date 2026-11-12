import { doc, getDoc } from 'firebase/firestore';
import { firestore } from './firebase';

// A successful read proves that the published Firestore rules allow this UID.
// The app never treats Firebase Authentication alone as admin authorization.
export async function hasFirestoreAdminAccess(userId) {
  try {
    await getDoc(doc(firestore, 'adminAccess', userId));
    return true;
  } catch (error) {
    if (error.code === 'permission-denied') return false;
    throw error;
  }
}

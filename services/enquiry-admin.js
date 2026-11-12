import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { getAdminAuth, getAdminFirestore } from './firebase-admin';

export const enquiryStatuses = ['New', 'Contacted', 'Follow-up', 'Closed'];

export function validateEnquiryInput(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  const allowedKeys = ['studentName', 'guardianName', 'mobileNumber', 'courseInterest', 'message', 'website'];
  const keys = Object.keys(body);
  if (!keys.every((key) => allowedKeys.includes(key))) return null;
  const studentName = typeof body.studentName === 'string' ? body.studentName.trim() : '';
  const guardianName = typeof body.guardianName === 'string' ? body.guardianName.trim() : '';
  const rawMobileNumber = typeof body.mobileNumber === 'string' ? body.mobileNumber.trim() : '';
  const courseInterest = typeof body.courseInterest === 'string' ? body.courseInterest.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const website = typeof body.website === 'string' ? body.website.trim() : '';
  const rawDigits = rawMobileNumber.replace(/\D/g, '');
  const digits = rawDigits.length === 12 && rawDigits.startsWith('91') ? rawDigits.slice(2) : rawDigits;

  if (website || !studentName || !guardianName || !/^[6-9]\d{9}$/.test(digits)
    || studentName.length > 80 || guardianName.length > 80 || courseInterest.length > 100 || message.length > 500) return null;

  return { studentName, guardianName, mobileNumber: `+91 ${digits}`, courseInterest, message };
}

export async function requireAdmin(request) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Bearer ')) return null;
  try {
    const database = getAdminFirestore();
    const token = await getAdminAuth().verifyIdToken(authorization.slice(7));
    const access = await database.collection('adminAccess').doc(token.uid).get();
    return access.exists ? token : null;
  } catch {
    return null;
  }
}

export function enquiryTimestamps() {
  return { createdAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() };
}

export function enquiryUpdatedTimestamp() {
  return FieldValue.serverTimestamp();
}

export function serializeEnquiry(snapshot) {
  const enquiry = snapshot.data() || {};
  return {
    id: snapshot.id,
    studentName: typeof enquiry.studentName === 'string' ? enquiry.studentName : '',
    guardianName: typeof enquiry.guardianName === 'string' ? enquiry.guardianName : '',
    mobileNumber: typeof enquiry.mobileNumber === 'string' ? enquiry.mobileNumber : '',
    courseInterest: enquiry.courseInterest || '',
    message: enquiry.message || '',
    status: enquiryStatuses.includes(enquiry.status) ? enquiry.status : 'New',
    createdAt: enquiry.createdAt?.toDate?.().toISOString() || null,
  };
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';
import { firestore } from './firebase';
import { normalizeRollNumber } from '../utils/roll-number';

const studentsCollection = collection(firestore, 'students');
const rollNumbersCollection = collection(firestore, 'studentRollNumbers');

export { normalizeRollNumber } from '../utils/roll-number';

function cleanStudent(student) {
  return {
    fullName: student.fullName.trim(),
    rollNumber: student.rollNumber.trim(),
    dateOfBirth: student.dateOfBirth,
    course: student.course.trim(),
    phone: student.phone.trim(),
    email: student.email.trim(),
    admissionDate: student.admissionDate,
    status: student.status,
    address: student.address.trim(),
  };
}

function serviceError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

export function readableStudentError(error) {
  if (error.code === 'duplicate-roll-number') return 'That roll number is already assigned to another student.';
  if (error.code === 'permission-denied') return 'You are not authorized to manage student records.';
  if (error.code === 'student-not-found') return 'The requested student record was not found.';
  if (error.code === 'unavailable') return 'The service is temporarily unavailable. Please try again.';
  return 'Unable to complete the request. Please try again.';
}

export async function getStudents() {
  const snapshot = await getDocs(query(studentsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((student) => ({ id: student.id, ...student.data() }));
}

export async function getStudentById(studentId) {
  const snapshot = await getDoc(doc(studentsCollection, studentId));
  if (!snapshot.exists()) throw serviceError('student-not-found');
  return { id: snapshot.id, ...snapshot.data() };
}

export async function createStudent(student) {
  const cleaned = cleanStudent(student);
  const normalizedRollNumber = normalizeRollNumber(cleaned.rollNumber);
  const studentRef = doc(studentsCollection);
  const rollNumberRef = doc(rollNumbersCollection, normalizedRollNumber);

  await runTransaction(firestore, async (transaction) => {
    const rollNumberSnapshot = await transaction.get(rollNumberRef);
    if (rollNumberSnapshot.exists()) throw serviceError('duplicate-roll-number');

    transaction.set(studentRef, {
      ...cleaned,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    transaction.set(rollNumberRef, { studentId: studentRef.id });
  });

  return studentRef.id;
}

export async function updateStudent(studentId, student) {
  const cleaned = cleanStudent(student);
  const studentRef = doc(studentsCollection, studentId);
  const nextRollNumber = normalizeRollNumber(cleaned.rollNumber);

  await runTransaction(firestore, async (transaction) => {
    const currentStudentSnapshot = await transaction.get(studentRef);
    if (!currentStudentSnapshot.exists()) throw serviceError('student-not-found');

    const previousRollNumber = normalizeRollNumber(currentStudentSnapshot.data().rollNumber);
    const nextRollNumberRef = doc(rollNumbersCollection, nextRollNumber);

    if (previousRollNumber !== nextRollNumber) {
      const nextRollNumberSnapshot = await transaction.get(nextRollNumberRef);
      if (nextRollNumberSnapshot.exists()) throw serviceError('duplicate-roll-number');
      transaction.set(nextRollNumberRef, { studentId });
      transaction.delete(doc(rollNumbersCollection, previousRollNumber));
    }

    transaction.update(studentRef, { ...cleaned, updatedAt: serverTimestamp() });
  });
}

export async function deleteStudent(studentId) {
  const studentRef = doc(studentsCollection, studentId);

  await runTransaction(firestore, async (transaction) => {
    const studentSnapshot = await transaction.get(studentRef);
    if (!studentSnapshot.exists()) throw serviceError('student-not-found');

    const rollNumber = normalizeRollNumber(studentSnapshot.data().rollNumber);
    transaction.delete(studentRef);
    transaction.delete(doc(rollNumbersCollection, rollNumber));
  });
}

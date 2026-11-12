import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { firestore } from './firebase';

const resultsCollection = collection(firestore, 'results');
const studentsCollection = collection(firestore, 'students');

function serviceError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

function cleanSubject(subject) {
  const maximumMarks = Number(subject.maximumMarks);
  const obtainedMarks = Number(subject.obtainedMarks);
  if (!subject.subjectName.trim() || !Number.isFinite(maximumMarks) || !Number.isFinite(obtainedMarks)
    || maximumMarks <= 0 || obtainedMarks < 0 || obtainedMarks > maximumMarks) {
    throw serviceError('invalid-result');
  }
  return { subjectName: subject.subjectName.trim(), maximumMarks, obtainedMarks };
}

function calculateResult(subjects) {
  const totalMaximumMarks = subjects.reduce((total, subject) => total + subject.maximumMarks, 0);
  const totalObtainedMarks = subjects.reduce((total, subject) => total + subject.obtainedMarks, 0);
  return {
    totalMaximumMarks,
    totalObtainedMarks,
    percentage: Number(((totalObtainedMarks / totalMaximumMarks) * 100).toFixed(2)),
  };
}

function cleanResult(result) {
  if (!result.studentId || !result.resultTitle.trim() || !result.session.trim() || !Array.isArray(result.subjects) || result.subjects.length === 0) throw serviceError('invalid-result');
  const subjects = result.subjects.map(cleanSubject);
  return {
    studentId: result.studentId,
    resultTitle: result.resultTitle.trim(),
    session: result.session.trim(),
    subjects,
    ...calculateResult(subjects),
    grade: result.grade.trim(),
    resultStatus: result.resultStatus.trim(),
    published: Boolean(result.published),
  };
}

function studentSnapshot(student) {
  return {
    rollNumber: student.rollNumber,
    studentName: student.fullName,
    course: student.course,
  };
}

export function readableResultError(error) {
  if (error.code === 'permission-denied') return 'You are not authorized to manage results.';
  if (error.code === 'student-not-found') return 'The selected student record was not found.';
  if (error.code === 'result-not-found') return 'The requested result record was not found.';
  if (error.code === 'invalid-result') return 'Enter a valid student, result title, session, and subject marks.';
  if (error.code === 'unavailable') return 'The service is temporarily unavailable. Please try again.';
  return 'Unable to complete the request. Please try again.';
}

export async function getResults() {
  const snapshot = await getDocs(query(resultsCollection, orderBy('createdAt', 'desc')));
  return snapshot.docs.map((result) => ({ id: result.id, ...result.data() }));
}

export async function getResultsForStudent(studentId) {
  const snapshot = await getDocs(query(resultsCollection, where('studentId', '==', studentId)));
  return snapshot.docs.map((result) => ({ id: result.id, ...result.data() }));
}

export async function getResultById(resultId) {
  const snapshot = await getDoc(doc(resultsCollection, resultId));
  if (!snapshot.exists()) throw serviceError('result-not-found');
  return { id: snapshot.id, ...snapshot.data() };
}

export async function createResult(result) {
  const cleaned = cleanResult(result);
  const resultRef = doc(resultsCollection);

  await runTransaction(firestore, async (transaction) => {
    const studentRef = doc(studentsCollection, cleaned.studentId);
    const student = await transaction.get(studentRef);
    if (!student.exists()) throw serviceError('student-not-found');
    transaction.set(resultRef, {
      ...cleaned,
      ...studentSnapshot(student.data()),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });
  return resultRef.id;
}

export async function updateResult(resultId, result) {
  const cleaned = cleanResult(result);
  const resultRef = doc(resultsCollection, resultId);

  await runTransaction(firestore, async (transaction) => {
    const currentResult = await transaction.get(resultRef);
    if (!currentResult.exists()) throw serviceError('result-not-found');
    const studentRef = doc(studentsCollection, cleaned.studentId);
    const student = await transaction.get(studentRef);
    if (!student.exists()) throw serviceError('student-not-found');
    transaction.update(resultRef, {
      ...cleaned,
      ...studentSnapshot(student.data()),
      updatedAt: serverTimestamp(),
    });
  });
}

export async function deleteResult(resultId) {
  const resultRef = doc(resultsCollection, resultId);
  const existing = await getDoc(resultRef);
  if (!existing.exists()) throw serviceError('result-not-found');
  await deleteDoc(resultRef);
}

export async function setResultPublished(resultId, published) {
  await updateDoc(doc(resultsCollection, resultId), { published: Boolean(published), updatedAt: serverTimestamp() });
}

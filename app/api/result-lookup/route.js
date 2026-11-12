import { getAdminFirestore } from '../../../services/firebase-admin';
import { normalizeRollNumber } from '../../../utils/roll-number';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const unavailableMessage = 'Result not found or currently unavailable. Please check your details or contact VCCI.';

function isDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  return new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) === value;
}

function dateOnly(value) {
  if (typeof value === 'string' && isDateOnly(value)) return value;
  if (value?.toDate) return value.toDate().toISOString().slice(0, 10);
  return '';
}

function safeResult(result) {
  return {
    studentName: typeof result.studentName === 'string' ? result.studentName : '',
    rollNumber: typeof result.rollNumber === 'string' ? result.rollNumber : '',
    course: typeof result.course === 'string' ? result.course : '',
    resultTitle: typeof result.resultTitle === 'string' ? result.resultTitle : '',
    session: typeof result.session === 'string' ? result.session : '',
    subjects: Array.isArray(result.subjects) ? result.subjects.map((subject) => ({
      subjectName: subject.subjectName,
      maximumMarks: subject.maximumMarks,
      obtainedMarks: subject.obtainedMarks,
    })) : [],
    totalMaximumMarks: result.totalMaximumMarks,
    totalObtainedMarks: result.totalObtainedMarks,
    percentage: result.percentage,
    grade: typeof result.grade === 'string' ? result.grade : '',
    resultStatus: typeof result.resultStatus === 'string' ? result.resultStatus : '',
  };
}

export async function POST(request) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ message: unavailableMessage }, { status: 400 });
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({ message: unavailableMessage }, { status: 400 });
    const keys = Object.keys(body || {});
    if (keys.length !== 2 || !keys.every((key) => key === 'rollNumber' || key === 'dateOfBirth')) return Response.json({ message: unavailableMessage }, { status: 400 });

    const rollNumber = typeof body.rollNumber === 'string' ? body.rollNumber.trim() : '';
    const dateOfBirth = body.dateOfBirth;
    if (rollNumber.length < 6 || rollNumber.length > 32 || !isDateOnly(dateOfBirth)) return Response.json({ message: unavailableMessage }, { status: 400 });

    const database = getAdminFirestore();
    const normalizedRollNumber = normalizeRollNumber(rollNumber);
    const rollIndex = await database.collection('studentRollNumbers').doc(normalizedRollNumber).get();
    if (!rollIndex.exists || typeof rollIndex.data().studentId !== 'string') return Response.json({ message: unavailableMessage }, { status: 404 });

    const student = await database.collection('students').doc(rollIndex.data().studentId).get();
    if (!student.exists || normalizeRollNumber(student.data().rollNumber) !== normalizedRollNumber || dateOnly(student.data().dateOfBirth) !== dateOfBirth) return Response.json({ message: unavailableMessage }, { status: 404 });

    const resultSnapshot = await database.collection('results').where('studentId', '==', student.id).get();
    const results = resultSnapshot.docs
      .map((result) => result.data())
      .filter((result) => result.published === true)
      .map(safeResult);
    if (results.length === 0) return Response.json({ message: unavailableMessage }, { status: 404 });

    return Response.json({ results });
  } catch {
    return Response.json({ message: unavailableMessage }, { status: 500 });
  }
}

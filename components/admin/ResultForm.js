'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createResult, getResultById, readableResultError, updateResult } from '../../services/result-service';
import { getStudents, readableStudentError } from '../../services/student-service';
import styles from './admin.module.css';

const blankSubject = { subjectName: '', maximumMarks: '', obtainedMarks: '' };
const blankResult = { studentId: '', resultTitle: '', session: '', subjects: [blankSubject], grade: '', resultStatus: '', published: false };

function validate(result) {
  if (!result.studentId || !result.resultTitle.trim() || !result.session.trim() || result.subjects.length === 0) return 'Complete the student, title, session, and subject details.';
  for (const subject of result.subjects) {
    const maximumMarks = Number(subject.maximumMarks);
    const obtainedMarks = Number(subject.obtainedMarks);
    if (!subject.subjectName.trim() || !Number.isFinite(maximumMarks) || !Number.isFinite(obtainedMarks) || maximumMarks <= 0 || obtainedMarks < 0 || obtainedMarks > maximumMarks) return 'Enter valid subject names and marks.';
  }
  return '';
}

export default function ResultForm({ resultId }) {
  const router = useRouter();
  const [result, setResult] = useState(blankResult);
  const [students, setStudents] = useState([]);
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let isCurrent = true;
    const resultRequest = resultId ? getResultById(resultId) : Promise.resolve(blankResult);
    Promise.all([getStudents(), resultRequest])
      .then(([studentRecords, resultRecord]) => {
        if (!isCurrent) return;
        setStudents(studentRecords);
        setResult({ ...blankResult, ...resultRecord, subjects: resultRecord.subjects || [blankSubject] });
        setState('ready');
      })
      .catch((error) => {
        if (!isCurrent) return;
        setMessage(readableResultError(error) === 'Unable to complete the request. Please try again.' ? readableStudentError(error) : readableResultError(error));
        setState('error');
      });
    return () => { isCurrent = false; };
  }, [resultId]);

  function changeField(event) { const { name, value, checked, type } = event.target; setResult((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })); }
  function changeSubject(index, event) { const { name, value } = event.target; setResult((current) => ({ ...current, subjects: current.subjects.map((subject, subjectIndex) => subjectIndex === index ? { ...subject, [name]: value } : subject) })); }
  function addSubject() { setResult((current) => ({ ...current, subjects: [...current.subjects, { ...blankSubject }] })); }
  function removeSubject(index) { setResult((current) => ({ ...current, subjects: current.subjects.filter((_, subjectIndex) => subjectIndex !== index) })); }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validate(result);
    if (validationMessage) { setMessage(validationMessage); return; }
    setState('saving');
    setMessage('');
    try {
      if (resultId) {
        await updateResult(resultId, result);
        router.replace(`/admin/results/${resultId}`);
      } else {
        const createdResultId = await createResult(result);
        router.replace(`/admin/results/${createdResultId}`);
      }
    } catch (error) {
      setMessage(readableResultError(error));
      setState('ready');
    }
  }

  if (state === 'loading') return <p className={styles.state}>Loading result form…</p>;
  if (state === 'error') return <p className={styles.state}>{message}</p>;

  return <form className={styles.studentForm} onSubmit={handleSubmit}><div className={styles.formGrid}><label>Student *<select name="studentId" value={result.studentId} onChange={changeField} required><option value="">Select student</option>{students.map((student) => <option key={student.id} value={student.id}>{student.fullName} — {student.rollNumber}</option>)}</select></label><label>Result Title *<input name="resultTitle" value={result.resultTitle} onChange={changeField} placeholder="e.g. Final Examination" required /></label><label>Session / Year *<input name="session" value={result.session} onChange={changeField} placeholder="e.g. 2025–26" required /></label><label>Grade <input name="grade" value={result.grade} onChange={changeField} placeholder="Optional" /></label><label>Result Status <input name="resultStatus" value={result.resultStatus} onChange={changeField} placeholder="Optional" /></label><label className={styles.checkField}><input name="published" type="checkbox" checked={result.published} onChange={changeField} />Publish result</label></div><section className={styles.subjectSection}><div className={styles.subjectHeader}><div><h2>Subjects &amp; Marks</h2><p>Totals and percentage are calculated automatically.</p></div><button className={styles.secondaryButton} type="button" onClick={addSubject}>Add Subject</button></div>{result.subjects.map((subject, index) => <div className={styles.subjectRow} key={index}><label>Subject Name<input name="subjectName" value={subject.subjectName} onChange={(event) => changeSubject(index, event)} required /></label><label>Maximum Marks<input name="maximumMarks" value={subject.maximumMarks} onChange={(event) => changeSubject(index, event)} type="number" min="0" step="any" required /></label><label>Obtained Marks<input name="obtainedMarks" value={subject.obtainedMarks} onChange={(event) => changeSubject(index, event)} type="number" min="0" step="any" required /></label><button className={styles.removeSubject} type="button" onClick={() => removeSubject(index)} disabled={result.subjects.length === 1}>Remove</button></div>)}</section><button className={styles.primaryButton} type="submit" disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save Result'}</button>{message && <p className={styles.listMessage} role="status">{message}</p>}</form>;
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { deleteResult, getResults, readableResultError, setResultPublished } from '../../services/result-service';
import { getStudents, readableStudentError } from '../../services/student-service';
import styles from './admin.module.css';

export default function ResultsList() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentId, setStudentId] = useState(searchParams.get('studentId') || 'All');
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    let isCurrent = true;
    Promise.all([getResults(), getStudents()])
      .then(([records, studentRecords]) => {
        if (!isCurrent) return;
        setResults(records);
        setStudents(studentRecords);
        setState('ready');
      })
      .catch((error) => {
        if (!isCurrent) return;
        setMessage(readableResultError(error) === 'Unable to complete the request. Please try again.' ? readableStudentError(error) : readableResultError(error));
        setState('error');
      });
    return () => { isCurrent = false; };
  }, []);

  const filteredResults = useMemo(() => results.filter((result) => studentId === 'All' || result.studentId === studentId), [results, studentId]);

  async function togglePublished(result) {
    setBusyId(result.id);
    setMessage('');
    try {
      const published = !result.published;
      await setResultPublished(result.id, published);
      setResults((current) => current.map((item) => item.id === result.id ? { ...item, published } : item));
    } catch (error) {
      setMessage(readableResultError(error));
    } finally { setBusyId(''); }
  }

  async function removeResult(result) {
    if (!window.confirm(`Delete ${result.resultTitle} for ${result.studentName}? This cannot be undone.`)) return;
    setBusyId(result.id);
    setMessage('');
    try {
      await deleteResult(result.id);
      setResults((current) => current.filter((item) => item.id !== result.id));
    } catch (error) {
      setMessage(readableResultError(error));
    } finally { setBusyId(''); }
  }

  if (state === 'loading') return <p className={styles.state}>Loading results…</p>;
  if (state === 'error') return <p className={styles.state}>{message}</p>;

  return <><div className={styles.listControls}><label><span>Student</span><select value={studentId} onChange={(event) => setStudentId(event.target.value)}><option value="All">All students</option>{students.map((student) => <option key={student.id} value={student.id}>{student.fullName} — {student.rollNumber}</option>)}</select></label></div>{message && <p className={styles.listMessage} role="status">{message}</p>}{filteredResults.length === 0 ? <div className={styles.emptyState}><h2>No results found</h2><p>Create a result for an existing student to begin Result Management.</p></div> : <div className={styles.tableWrap}><table className={styles.studentTable}><thead><tr><th>Student</th><th>Result</th><th>Session</th><th>Percentage</th><th>Publish Status</th><th><span className="srOnly">Actions</span></th></tr></thead><tbody>{filteredResults.map((result) => <tr key={result.id}><td><strong>{result.studentName}</strong><br /><span className={styles.mutedText}>{result.rollNumber}</span></td><td>{result.resultTitle}</td><td>{result.session}</td><td>{result.percentage}%</td><td><span className={result.published ? styles.publishedBadge : styles.statusBadge}>{result.published ? 'Published' : 'Draft'}</span></td><td><div className={styles.rowActions}><Link className={styles.viewAction} href={`/admin/results/${result.id}`}>View</Link><Link className={styles.editAction} href={`/admin/results/${result.id}/edit`}>Edit</Link><button className={styles.publishAction} type="button" onClick={() => togglePublished(result)} disabled={busyId === result.id}>{busyId === result.id ? 'Saving…' : result.published ? 'Unpublish' : 'Publish'}</button><button className={styles.deleteAction} type="button" onClick={() => removeResult(result)} disabled={busyId === result.id}>Delete</button></div></td></tr>)}</tbody></table></div>}</>;
}

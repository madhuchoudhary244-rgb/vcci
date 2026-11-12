'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { deleteStudent, getStudents, readableStudentError } from '../../services/student-service';
import styles from './admin.module.css';

const statuses = ['All', 'Active', 'Completed', 'Inactive'];

export default function StudentsList() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  const [deletingId, setDeletingId] = useState('');

  async function loadStudents() {
    setState('loading');
    setMessage('');
    try {
      setStudents(await getStudents());
      setState('ready');
    } catch (error) {
      setMessage(readableStudentError(error));
      setState('error');
    }
  }

  useEffect(() => {
    let isCurrent = true;
    getStudents()
      .then((records) => {
        if (!isCurrent) return;
        setStudents(records);
        setState('ready');
      })
      .catch((error) => {
        if (!isCurrent) return;
        setMessage(readableStudentError(error));
        setState('error');
      });
    return () => { isCurrent = false; };
  }, []);

  const filteredStudents = useMemo(() => {
    const search = query.trim().toLowerCase();
    return students.filter((student) => (status === 'All' || student.status === status)
      && (!search || student.fullName.toLowerCase().includes(search) || student.rollNumber.toLowerCase().includes(search)));
  }, [query, status, students]);

  async function handleDelete(student) {
    if (!window.confirm(`Delete ${student.fullName} (Roll Number: ${student.rollNumber})? This cannot be undone.`)) return;
    setDeletingId(student.id);
    setMessage('');
    try {
      await deleteStudent(student.id);
      setStudents((current) => current.filter((item) => item.id !== student.id));
    } catch (error) {
      setMessage(readableStudentError(error));
    } finally {
      setDeletingId('');
    }
  }

  if (state === 'loading') return <p className={styles.state}>Loading student records…</p>;
  if (state === 'error') return <div className={styles.state}><p>{message}</p><button className={styles.secondaryButton} type="button" onClick={loadStudents}>Try again</button></div>;

  return <>
    <div className={styles.listControls}><label><span>Search students</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name or roll number" /></label><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    {message && <p className={styles.listMessage} role="status">{message}</p>}
    {filteredStudents.length === 0 ? <div className={styles.emptyState}><h2>No students found</h2><p>{students.length === 0 ? 'Add the first student record to begin Student Management.' : 'Try changing the search or status filter.'}</p></div> : <div className={styles.tableWrap}><table className={styles.studentTable}><thead><tr><th>Roll Number</th><th>Student Name</th><th>Course</th><th>Phone</th><th>Status</th><th><span className="srOnly">Actions</span></th></tr></thead><tbody>{filteredStudents.map((student) => <tr key={student.id}><td>{student.rollNumber}</td><td>{student.fullName}</td><td>{student.course}</td><td>{student.phone}</td><td><span className={styles.statusBadge}>{student.status}</span></td><td><div className={styles.rowActions}><Link className={styles.viewAction} href={`/admin/students/${student.id}`}>View</Link><Link className={styles.editAction} href={`/admin/students/${student.id}/edit`}>Edit</Link><Link className={styles.resultsAction} href={`/admin/results?studentId=${student.id}`}>Results</Link><button className={styles.deleteAction} type="button" onClick={() => handleDelete(student)} disabled={deletingId === student.id}>{deletingId === student.id ? 'Deleting…' : 'Delete'}</button></div></td></tr>)}</tbody></table></div>}
  </>;
}

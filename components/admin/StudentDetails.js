'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getStudentById, readableStudentError } from '../../services/student-service';
import styles from './admin.module.css';

export default function StudentDetails({ studentId }) {
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getStudentById(studentId).then(setStudent).catch((error) => setMessage(readableStudentError(error)));
  }, [studentId]);

  if (message) return <p className={styles.state}>{message}</p>;
  if (!student) return <p className={styles.state}>Loading student record…</p>;
  const details = [['Roll Number', student.rollNumber], ['Course', student.course], ['Phone', student.phone], ['Email', student.email || 'Not provided'], ['Date of Birth', student.dateOfBirth], ['Admission Date', student.admissionDate], ['Status', student.status], ['Address', student.address || 'Not provided']];
  return <><dl className={styles.detailGrid}>{details.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className={styles.detailActions}><Link className={styles.primaryLink} href={`/admin/students/${studentId}/edit`}>Edit Student</Link><Link className={styles.secondaryLink} href="/admin/students">Back to Students</Link></div></>;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createStudent, getStudentById, readableStudentError, updateStudent } from '../../services/student-service';
import styles from './admin.module.css';

const statuses = ['Active', 'Completed', 'Inactive'];
const blankStudent = { fullName: '', rollNumber: '', dateOfBirth: '', course: '', phone: '', email: '', admissionDate: '', status: 'Active', address: '' };

function toDateInputValue(value) {
  if (typeof value === 'string') return value;
  if (value?.toDate) return value.toDate().toISOString().slice(0, 10);
  return '';
}

function validate(student) {
  if (!student.fullName.trim() || !student.rollNumber.trim() || !student.course.trim() || !student.phone.trim() || !student.admissionDate || !student.dateOfBirth) return 'Complete all required fields.';
  if (!/^\+?[0-9\s-]{7,20}$/.test(student.phone.trim())) return 'Enter a valid phone number.';
  if (student.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email.trim())) return 'Enter a valid email address.';
  if (!statuses.includes(student.status)) return 'Select a valid status.';
  const today = new Date().toISOString().slice(0, 10);
  if (student.dateOfBirth >= today) return 'Enter a valid date of birth.';
  if (student.admissionDate > today) return 'Admission date cannot be in the future.';
  if (student.admissionDate <= student.dateOfBirth) return 'Admission date must be after the date of birth.';
  return '';
}

export default function StudentForm({ studentId }) {
  const router = useRouter();
  const [student, setStudent] = useState(blankStudent);
  const [state, setState] = useState(studentId ? 'loading' : 'ready');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!studentId) return;
    async function loadStudent() {
      try {
        const record = await getStudentById(studentId);
        setStudent({
          ...blankStudent,
          ...record,
          dateOfBirth: toDateInputValue(record.dateOfBirth),
          admissionDate: toDateInputValue(record.admissionDate),
        });
        setState('ready');
      } catch (error) {
        setMessage(readableStudentError(error));
        setState('error');
      }
    }
    loadStudent();
  }, [studentId]);

  function changeField(event) { setStudent((current) => ({ ...current, [event.target.name]: event.target.value })); }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationMessage = validate(student);
    if (validationMessage) { setMessage(validationMessage); return; }
    setState('saving');
    setMessage('');
    try {
      if (studentId) {
        await updateStudent(studentId, student);
        router.replace(`/admin/students/${studentId}`);
      } else {
        const createdStudentId = await createStudent(student);
        router.replace(`/admin/students/${createdStudentId}`);
      }
    } catch (error) {
      setMessage(readableStudentError(error));
      setState('ready');
    }
  }

  if (state === 'loading') return <p className={styles.state}>Loading student record…</p>;
  if (state === 'error') return <p className={styles.state}>{message}</p>;

  return <form className={styles.studentForm} onSubmit={handleSubmit}>
    <div className={styles.formGrid}><label>Full Name *<input name="fullName" value={student.fullName} onChange={changeField} autoComplete="name" required /></label><label>Roll Number *<input name="rollNumber" value={student.rollNumber} onChange={changeField} inputMode="numeric" minLength="6" required /></label><label>Date of Birth *<input name="dateOfBirth" value={student.dateOfBirth} onChange={changeField} type="date" required /></label><label>Course *<input name="course" value={student.course} onChange={changeField} required /></label><label>Phone *<input name="phone" value={student.phone} onChange={changeField} type="tel" autoComplete="tel" required /></label><label>Email <input name="email" value={student.email} onChange={changeField} type="email" autoComplete="email" /></label><label>Admission Date *<input name="admissionDate" value={student.admissionDate} onChange={changeField} type="date" required /></label><label>Status *<select name="status" value={student.status} onChange={changeField}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div><label className={styles.fullField}>Address <textarea name="address" value={student.address} onChange={changeField} rows="4" /></label><button className={styles.primaryButton} type="submit" disabled={state === 'saving'}>{state === 'saving' ? 'Saving…' : 'Save Student'}</button>{message && <p className={styles.listMessage} role="status">{message}</p>}</form>;
}

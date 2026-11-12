'use client';

import { useState } from 'react';
import { courses } from '../../data/home';
import styles from './public-page.module.css';

const initialValues = { studentName: '', guardianName: '', mobileNumber: '', courseInterest: '', message: '', website: '' };

export default function EnquiryForm({ selectedCourse = '' }) {
  const [values, setValues] = useState(() => ({ ...initialValues, courseInterest: courses.includes(selectedCourse) ? selectedCourse : '' }));
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function changeValue(event) {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    const mobileDigits = values.mobileNumber.replace(/\D/g, '').replace(/^91(?=\d{10}$)/, '');
    if (!values.studentName.trim() || !values.guardianName.trim() || !/^[6-9]\d{9}$/.test(mobileDigits)) {
      setMessage('Enter your name, guardian name, and a valid 10-digit Indian mobile number.');
      return;
    }
    setIsSubmitting(true);
    setMessage('');
    try {
      const response = await fetch('/api/enquiries', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const payload = await response.json();
      if (!response.ok) throw new Error('submit-failed');
      setValues(initialValues);
      setMessage(payload.message);
    } catch {
      setMessage('Unable to submit your enquiry right now. Please try again or contact VCCI directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form className={styles.enquiryForm} onSubmit={submit}>
    <label>Student Name *<input name="studentName" value={values.studentName} onChange={changeValue} maxLength="80" autoComplete="name" required /></label>
    <label>Father / Mother / Guardian Name *<input name="guardianName" value={values.guardianName} onChange={changeValue} maxLength="80" required /></label>
    <label>Mobile Number *<input name="mobileNumber" value={values.mobileNumber} onChange={changeValue} maxLength="16" inputMode="numeric" autoComplete="tel" placeholder="10-digit mobile number" required /></label>
    <label>Course Interested In <select name="courseInterest" value={values.courseInterest} onChange={changeValue}><option value="">Select a course (optional)</option>{courses.map((course) => <option key={course}>{course}</option>)}</select></label>
    <label className={styles.fullEnquiryField}>Message / Query <textarea name="message" value={values.message} onChange={changeValue} maxLength="500" rows="4" /></label>
    <label className={styles.honeypot} aria-hidden="true">Website<input name="website" value={values.website} onChange={changeValue} tabIndex="-1" autoComplete="off" /></label>
    <button className="button buttonPrimary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting…' : 'Submit Enquiry'}</button>
    <p className={styles.enquiryMessage} role="status">{message}</p>
  </form>;
}

'use client';

import { useState } from 'react';
import styles from './home.module.css';

const unavailableMessage = 'Result not found or currently unavailable. Please check your details or contact VCCI.';

export default function StudentZoneForm() {
  const [message, setMessage] = useState('');
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setResults([]);
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/result-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rollNumber: formData.get('rollNumber'), dateOfBirth: formData.get('dateOfBirth') }),
      });
      const payload = await response.json();
      if (!response.ok || !Array.isArray(payload.results)) throw new Error('result-unavailable');
      setResults(payload.results);
      setSelectedResult(0);
    } catch {
      setMessage(unavailableMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const result = results[selectedResult];

  return <>
    <form className={styles.resultForm} onSubmit={handleSubmit}>
      <div className={styles.field}><label htmlFor="roll-number">Roll Number</label><input id="roll-number" name="rollNumber" type="text" inputMode="numeric" minLength="6" placeholder="Enter your roll number" required /></div>
      <div className={styles.field}><label htmlFor="date-of-birth">Date of Birth</label><input id="date-of-birth" name="dateOfBirth" type="date" required /></div>
      <button className="button buttonPrimary" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Checking…' : 'View Result'}</button>
      <p className={styles.formMessage} aria-live="polite">{message}</p>
    </form>
    {result && <section className={`${styles.publicResult} resultSheet`} aria-live="polite">
      {results.length > 1 && <label className={styles.resultSelector}>Available Results<select value={selectedResult} onChange={(event) => setSelectedResult(Number(event.target.value))}>{results.map((item, index) => <option key={`${item.resultTitle}-${item.session}-${index}`} value={index}>{item.resultTitle} — {item.session}</option>)}</select></label>}
      <header><p>{result.resultTitle}</p><h3>{result.studentName}</h3><span>Roll Number: {result.rollNumber}</span><span>Course: {result.course}</span><span>Session: {result.session}</span></header>
      <div className={styles.publicTableWrap}><table><thead><tr><th>Subject</th><th>Maximum</th><th>Obtained</th></tr></thead><tbody>{result.subjects.map((subject, index) => <tr key={`${subject.subjectName}-${index}`}><td>{subject.subjectName}</td><td>{subject.maximumMarks}</td><td>{subject.obtainedMarks}</td></tr>)}</tbody><tfoot><tr><th>Total</th><th>{result.totalMaximumMarks}</th><th>{result.totalObtainedMarks}</th></tr></tfoot></table></div>
      <div className={styles.resultMetrics}><span>Percentage<strong>{result.percentage}%</strong></span>{result.grade && <span>Grade<strong>{result.grade}</strong></span>}{result.resultStatus && <span>Status<strong>{result.resultStatus}</strong></span>}</div>
      <button className={`button buttonSecondary ${styles.printButton}`} type="button" onClick={() => window.print()}>Print Result</button>
    </section>}
  </>;
}

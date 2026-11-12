'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getResultById, readableResultError } from '../../services/result-service';
import styles from './admin.module.css';

export default function ResultDetails({ resultId }) {
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  useEffect(() => { getResultById(resultId).then(setResult).catch((error) => setMessage(readableResultError(error))); }, [resultId]);
  if (message) return <p className={styles.state}>{message}</p>;
  if (!result) return <p className={styles.state}>Loading result…</p>;
  return <><div className={styles.resultSummary}><div><span>Student</span><strong>{result.studentName}</strong><small>{result.rollNumber} · {result.course}</small></div><div><span>Result</span><strong>{result.resultTitle}</strong><small>{result.session}</small></div><div><span>Percentage</span><strong>{result.percentage}%</strong><small>{result.published ? 'Published' : 'Draft'}</small></div></div><div className={styles.tableWrap}><table className={styles.studentTable}><thead><tr><th>Subject</th><th>Maximum Marks</th><th>Obtained Marks</th></tr></thead><tbody>{result.subjects.map((subject) => <tr key={subject.subjectName}><td>{subject.subjectName}</td><td>{subject.maximumMarks}</td><td>{subject.obtainedMarks}</td></tr>)}</tbody><tfoot><tr><th>Total</th><th>{result.totalMaximumMarks}</th><th>{result.totalObtainedMarks}</th></tr></tfoot></table></div>{(result.grade || result.resultStatus) && <p className={styles.resultMeta}>{result.grade && `Grade: ${result.grade}`}{result.grade && result.resultStatus && ' · '}{result.resultStatus && `Status: ${result.resultStatus}`}</p>}<div className={styles.detailActions}><Link className={styles.primaryLink} href={`/admin/results/${resultId}/edit`}>Edit Result</Link><Link className={styles.secondaryLink} href="/admin/results">Back to Results</Link></div></>;
}

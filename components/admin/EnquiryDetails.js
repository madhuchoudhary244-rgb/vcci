'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '../../services/admin-api';
import styles from './admin.module.css';

export default function EnquiryDetails({ enquiryId }) {
  const [enquiry, setEnquiry] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminFetch(`/api/enquiries/${enquiryId}`).then(({ enquiry: record }) => setEnquiry(record)).catch(() => setMessage('Unable to load enquiry. Please try again.'));
  }, [enquiryId]);

  if (message) return <p className={styles.state}>{message}</p>;
  if (!enquiry) return <p className={styles.state}>Loading enquiry…</p>;

  return <><dl className={styles.detailGrid}><div><dt>Student Name</dt><dd>{enquiry.studentName}</dd></div><div><dt>Guardian Name</dt><dd>{enquiry.guardianName}</dd></div><div><dt>Mobile Number</dt><dd><a className={styles.phoneAction} href={`tel:${enquiry.mobileNumber.replace(/\s/g, '')}`}>{enquiry.mobileNumber}</a></dd></div><div><dt>Course Interest</dt><dd>{enquiry.courseInterest || '—'}</dd></div><div><dt>Status</dt><dd>{enquiry.status}</dd></div><div><dt>Submitted</dt><dd>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : '—'}</dd></div><div className={styles.fullDetail}><dt>Message / Query</dt><dd>{enquiry.message || '—'}</dd></div></dl><div className={styles.detailActions}><a className={styles.primaryLink} href={`tel:${enquiry.mobileNumber.replace(/\s/g, '')}`}>Call Student</a><Link className={styles.secondaryLink} href="/admin/enquiries">Back to Enquiries</Link></div></>;
}

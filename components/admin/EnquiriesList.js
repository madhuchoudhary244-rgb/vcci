'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { adminFetch } from '../../services/admin-api';
import styles from './admin.module.css';

const statuses = ['All', 'New', 'Contacted', 'Follow-up', 'Closed'];

export default function EnquiriesList() {
  const [enquiries, setEnquiries] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [state, setState] = useState('loading');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState('');

  useEffect(() => {
    let isCurrent = true;
    adminFetch('/api/enquiries').then(({ enquiries: records }) => {
      if (!isCurrent) return;
      setEnquiries(records);
      setState('ready');
    }).catch(() => {
      if (!isCurrent) return;
      setMessage('Unable to load enquiries. Please try again.');
      setState('error');
    });
    return () => { isCurrent = false; };
  }, []);

  const filteredEnquiries = useMemo(() => {
    const search = query.trim().toLowerCase();
    return enquiries.filter((enquiry) => (status === 'All' || enquiry.status === status)
      && (!search || [enquiry.studentName, enquiry.guardianName, enquiry.mobileNumber].some((value) => value.toLowerCase().includes(search))));
  }, [enquiries, query, status]);

  async function changeStatus(enquiry, nextStatus) {
    setBusyId(enquiry.id);
    setMessage('');
    try {
      await adminFetch(`/api/enquiries/${enquiry.id}`, { method: 'PATCH', body: JSON.stringify({ status: nextStatus }) });
      setEnquiries((current) => current.map((item) => item.id === enquiry.id ? { ...item, status: nextStatus } : item));
    } catch {
      setMessage('Unable to update enquiry status. Please try again.');
    } finally { setBusyId(''); }
  }

  async function removeEnquiry(enquiry) {
    if (!window.confirm(`Delete the enquiry from ${enquiry.studentName}? This cannot be undone.`)) return;
    setBusyId(enquiry.id);
    setMessage('');
    try {
      await adminFetch(`/api/enquiries/${enquiry.id}`, { method: 'DELETE' });
      setEnquiries((current) => current.filter((item) => item.id !== enquiry.id));
    } catch {
      setMessage('Unable to delete enquiry. Please try again.');
    } finally { setBusyId(''); }
  }

  if (state === 'loading') return <p className={styles.state}>Loading enquiries…</p>;
  if (state === 'error') return <p className={styles.state}>{message}</p>;

  return <><div className={styles.listControls}><label><span>Search enquiries</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Student, guardian, or mobile" /></label><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></label></div>{message && <p className={styles.listMessage} role="status">{message}</p>}{filteredEnquiries.length === 0 ? <div className={styles.emptyState}><h2>No enquiries found</h2><p>{enquiries.length === 0 ? 'New website enquiries will appear here.' : 'Try changing the search or status filter.'}</p></div> : <div className={styles.tableWrap}><table className={styles.studentTable}><thead><tr><th>Student</th><th>Guardian</th><th>Mobile</th><th>Course</th><th>Submitted</th><th>Status</th><th><span className="srOnly">Actions</span></th></tr></thead><tbody>{filteredEnquiries.map((enquiry) => <tr key={enquiry.id}><td>{enquiry.studentName}</td><td>{enquiry.guardianName}</td><td><a className={styles.phoneAction} href={`tel:${enquiry.mobileNumber.replace(/\s/g, '')}`}>{enquiry.mobileNumber}</a></td><td>{enquiry.courseInterest || '—'}</td><td>{enquiry.createdAt ? new Date(enquiry.createdAt).toLocaleString() : '—'}</td><td><select className={styles.statusSelect} value={enquiry.status} aria-label={`Status for ${enquiry.studentName}`} disabled={busyId === enquiry.id} onChange={(event) => changeStatus(enquiry, event.target.value)}>{statuses.slice(1).map((item) => <option key={item}>{item}</option>)}</select></td><td><div className={styles.rowActions}><Link className={styles.viewAction} href={`/admin/enquiries/${enquiry.id}`}>View</Link><a className={styles.resultsAction} href={`tel:${enquiry.mobileNumber.replace(/\s/g, '')}`}>Call</a><button className={styles.deleteAction} type="button" disabled={busyId === enquiry.id} onClick={() => removeEnquiry(enquiry)}>{busyId === enquiry.id ? 'Saving…' : 'Delete'}</button></div></td></tr>)}</tbody></table></div>}</>;
}

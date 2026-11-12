'use client';
/* eslint-disable @next/next/no-img-element -- Firebase Storage URLs are dynamic and tokenized. */
import { useState } from 'react';
import styles from './public-page.module.css';
const formatDate = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : 'Official VCCI visual';
export default function GalleryBrowser({ events = [] }) {
  const [selected, setSelected] = useState(null);
  if (!events.length) return <div className={styles.galleryEmpty}><h2>Gallery updates are on the way.</h2><p>Official VCCI event photographs will appear here as they are added.</p></div>;
  return <><div className={styles.eventGrid}>{events.map((event) => <article className={styles.eventCard} key={event.id}><button type="button" onClick={() => setSelected(event)}><span className={styles.eventImage}>{event.images[0] ? <img src={event.images[0].url} alt="" /> : <span>VCCI Event</span>}</span><span className={styles.eventCopy}><small>{formatDate(event.eventDate)}</small><strong>{event.title}</strong>{event.description && <em>{event.description}</em>}<b>View photos →</b></span></button></article>)}</div>{selected && <div className={styles.galleryDialog} role="dialog" aria-modal="true" aria-labelledby="gallery-event-title"><button className={styles.dialogBackdrop} type="button" aria-label="Close gallery" onClick={() => setSelected(null)} /><div className={styles.dialogPanel}><button className={styles.dialogClose} type="button" aria-label="Close" onClick={() => setSelected(null)}>×</button><p>{formatDate(selected.eventDate)}</p><h2 id="gallery-event-title">{selected.title}</h2>{selected.description && <span>{selected.description}</span>}<div className={styles.photoGrid}>{selected.images.map((image, index) => <img key={image.path || image.url} src={image.url} alt={`${selected.title} photograph ${index + 1}`} loading="lazy" />)}</div></div></div>}</>;
}

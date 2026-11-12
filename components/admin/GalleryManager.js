'use client';
import styles from './admin.module.css';
export default function GalleryManager() {
  return <section className={styles.galleryDeferred}><h2>Static Gallery in use</h2><p>The public Gallery currently uses approved local website assets. Cloud-based event uploads are intentionally deferred until a Storage provider is configured.</p><p>No upload controls are available in this release, so administrators will not encounter a non-working upload flow.</p></section>;
}

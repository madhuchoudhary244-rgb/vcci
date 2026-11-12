import PageIntro from '../../components/public/PageIntro';
import PublicPage from '../../components/public/PublicPage';
import GalleryBrowser from '../../components/public/GalleryBrowser';
import { galleryEvents } from '../../data/gallery';
import styles from '../../components/public/public-page.module.css';

export const metadata = { title: 'Gallery | VCCI Ludhiana', description: 'Official visual updates from Vision Computer & Coaching Institute, Ludhiana.' };

export default function GalleryPage() {
  return <PublicPage><main><PageIntro eyebrow="VCCI gallery" title="Moments from the VCCI learning community." text="Official institute events, student activities, and classroom moments." />
    <section className={styles.page}><div className={styles.container}><GalleryBrowser events={galleryEvents} /></div></section>
  </main></PublicPage>;
}

import styles from './home.module.css';

export default function SectionHeading({ eyebrow, title, text, align = 'left' }) {
  return (
    <div className={`${styles.sectionHeading} ${align === 'center' ? styles.centered : ''}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h2>{title}</h2>
      {text && <p className={styles.sectionText}>{text}</p>}
    </div>
  );
}

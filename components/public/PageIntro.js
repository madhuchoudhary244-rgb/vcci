import styles from './public-page.module.css';

export default function PageIntro({ eyebrow, title, text }) {
  return <section className={styles.pageIntro}><div><p>{eyebrow}</p><h1>{title}</h1>{text && <span>{text}</span>}</div></section>;
}

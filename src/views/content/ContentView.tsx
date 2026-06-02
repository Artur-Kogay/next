import styles from './ContentView.module.scss';
import { type ContentViewProps } from './ContentView.types';

export const ContentView = ({ page }: ContentViewProps) => {
  return (
    <div className={styles.root}>
      {page.title ? <h1 className={styles.title}>{page.title}</h1> : null}
      <div className={styles.content} dangerouslySetInnerHTML={{ __html: page.content ?? '' }} />
    </div>
  );
};

import { ImageWithFallback } from '../imageWithFallback';
import styles from './index.module.less';

export function SeltopiaLogo() {
  return (
    <div className={styles.container}>
      <ImageWithFallback
        src="/logo_width_text.png"
        alt="Seltopia - The Book of Answers"
        className={styles.logo}
      />
    </div>
  );
}

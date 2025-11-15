import { ImageWithFallback } from '../imageWithFallback';
import logoImage from '@/assets/logos/logo_width_text.png';
import styles from './index.module.less';

export function SeltopiaLogo() {
  return (
    <div className={styles.container}>
      <ImageWithFallback
        src={logoImage}
        alt="Seltopia - The Book of Answers"
        className={styles.logo}
      />
    </div>
  );
}

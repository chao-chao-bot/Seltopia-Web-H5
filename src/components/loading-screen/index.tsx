import { SeltopiaLogo } from '../seltopia-logo';
import { LoadingOrb } from '../loading-orb';
import { StarryBackground } from '../starry-background';
import { MusicControl } from '../music-control';
import styles from './index.module.less';

interface LoadingScreenProps {
  isMusicPlaying?: boolean;
  onMusicToggle?: () => void;
}

export function LoadingScreen({ isMusicPlaying = false, onMusicToggle }: LoadingScreenProps) {
  return (
    <div className={styles.container}>
      {/* Starry Background */}
      <StarryBackground />
      
      {/* Music Control - Top Right */}
      {onMusicToggle && (
        <div className={styles.musicControlWrapper}>
          <MusicControl isPlaying={isMusicPlaying} onToggle={onMusicToggle} />
        </div>
      )}
      
      {/* Header with Logo */}
      <div className={styles.header}>
        <SeltopiaLogo />
      </div>
      
      {/* Loading message */}
      <div className={styles.loadingMessage}>
        <p>Focus mind on your question</p>
        <p>The universe is aligning your answer...</p>
      </div>
      
      {/* Loading orb - centered in remaining space */}
      <div className={styles.orbContainer}>
        <LoadingOrb />
      </div>
    </div>
  );
}

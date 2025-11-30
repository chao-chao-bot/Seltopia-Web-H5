import { motion } from 'framer-motion';
import { MusicControl } from '../music-control';
import { DownloadIcon, ShareIcon } from '../ui/icon';
import styles from './index.module.less';

interface ActionButtonsProps {
  isMusicPlaying: boolean;
  onMusicToggle: () => void;
  onDownload: () => void;
  onShare: () => void;
}

export function ActionButtons({
  isMusicPlaying,
  onMusicToggle,
  onDownload,
  onShare
}: ActionButtonsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, x: '-50%' }}  // ✅ 添加 x: '-50%'
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className={styles.actionButtons}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className={styles.actionButton}
        aria-label="Download image"
        onClick={onDownload}
      >
        <DownloadIcon />
      </button>
      <button
        className={styles.actionButton}
        aria-label="Share to Facebook"
        onClick={onShare}
      >
        <ShareIcon />
      </button>
      <MusicControl
        isPlaying={isMusicPlaying}
        onToggle={onMusicToggle}
      />
    </motion.div>
  );
}


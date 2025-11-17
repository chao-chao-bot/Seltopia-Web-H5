import { motion } from 'framer-motion';
import { SeltopiaLogo } from "../seltopia-logo";
import { MusicControl } from "../music-control";

import styles from './index.module.less';

// 简单的 SVG 图标组件
const DownloadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/>
    <circle cx="6" cy="12" r="3"/>
    <circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);



interface RevelationScreenProps {
  onBack: () => void;
  isMusicPlaying: boolean;
  onMusicToggle: () => void;
}

export function RevelationScreen({ onBack, isMusicPlaying, onMusicToggle }: RevelationScreenProps) {
  // 随机选择背景图片（1-52）
  const getRandomBackgroundImage = () => {
    const imageNumber = Math.floor(Math.random() * 52) + 1;
    return `/src/assets/images/背景图片/赋能-53/高清有字/赋能-高清有字/${1}.png`;
  };

  const backgroundStyle = {
    backgroundImage: `url(${getRandomBackgroundImage()})`
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={styles.container}
      style={backgroundStyle}
      onClick={onBack}
    >
      {/* Main Content - The Revealed Wisdom */}
      <div className={styles.mainContent}>
        {/* Action Buttons - Below the text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className={styles.actionButtons}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            // onClick={handleDownload}
            className={styles.actionButton}
            aria-label="Download image"
          >
            <DownloadIcon />
          </button>
          <button
            // onClick={handleShare}
            className={styles.actionButton}
            aria-label="Share to Facebook"
          >
            <ShareIcon />
          </button>
          <div className={styles.musicControlWrapper} onClick={(e) => e.stopPropagation()}>
            <MusicControl isPlaying={isMusicPlaying} onToggle={onMusicToggle} />
          </div>
        </motion.div>
      </div>
 
    </motion.div>
  );
}
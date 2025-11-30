import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { SeltopiaLogo } from '../seltopia-logo';
import { LoadingOrb } from '../loading-orb';
import { StarryBackground } from '../starry-background';
import { MusicControl } from '../music-control';
import { Toast } from '../toast';
import { ActionButtons } from '../action-buttons';
import { useImageManager } from '../../hooks/useImageManager';
import { useModeSwitcher } from '../../hooks/useModeSwitcher';
import { useToast } from '../../hooks/useToast';
import { useShareManager } from '../../hooks/useShareManager';
import styles from './index.module.less';

interface UnifiedScreenProps {
  isMusicPlaying: boolean;
  onMusicToggle: () => void;
}

export function UnifiedScreenSanity({
  isMusicPlaying,
  onMusicToggle
}: UnifiedScreenProps) {
  const [cycleKey, setCycleKey] = useState(0);

  // 使用自定义 hooks
  const imageManager = useImageManager(cycleKey);
  
  const { showToast, showGlobalToast } = useToast();
  const { mode, resetToLoading } = useModeSwitcher(
    imageManager.imageReady, 
    imageManager.markFallbackUsed
  );
  const shareManager = useShareManager(showGlobalToast);

  // 处理返回点击：从 revelation 回到 loading
  const handleBack = () => {
    resetToLoading();
    setCycleKey(prev => prev + 1); // 触发新图片生成
  };

  // 处理分享按钮点击
  const handleShare = async () => {
     shareManager.copyToClipboard();
     shareManager.shareContent(imageManager.backgroundImage);
  };

  // 根据模式设置容器样式
  const containerClassName = mode === 'loading' ? styles.loadingContainer : styles.revelationContainer;

  const handleContainerClick = () => {
    if (mode === 'revelation') {
      handleBack();
    }
  };


  // 背景图片样式（始终存在，只是透明度不同）
  const bgImageUrl = useMemo(() => 
    `url(${imageManager.backgroundImage})`,
    [imageManager.backgroundImage]
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: mode === 'revelation' ? 1.2 : 0.8, ease: "easeOut" }}
      className={containerClassName}
      onClick={handleContainerClick}
    >
      {/* 全局提示 Toast */}
      <Toast visible={showToast} />

      {/* 🔥 预渲染背景图层 - 始终存在，loading时隐藏，revelation时显示 */}
      <div
        className={styles.prerenderedBackground}
        style={{
          backgroundImage: bgImageUrl,
          opacity: mode === 'revelation' ? 1 : 0
        }}
      />

      {/* Starry Background - only show in loading mode */}
      {mode === 'loading' && <StarryBackground />}

      {/* Music Control - Only Top Right in Loading Mode */}
      {mode === 'loading' && (
        <div className={styles.musicControlWrapper} onClick={(e) => e.stopPropagation()}>
          <MusicControl isPlaying={isMusicPlaying} onToggle={onMusicToggle} />
        </div>
      )}

      {/* Content based on mode */}
      {mode === 'loading' ? (
        <>
          {/* Header with Logo - only in loading mode */}
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
        </>
      ) : (
        <>
          {/* Revelation content */}
          <motion.div
            className={styles.mainContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <ActionButtons
              isMusicPlaying={isMusicPlaying}
              onMusicToggle={onMusicToggle}
              onDownload={() => shareManager.downloadImage(imageManager.backgroundImage)}
              onShare={handleShare}
            />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}


export default UnifiedScreenSanity;
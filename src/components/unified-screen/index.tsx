import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { SeltopiaLogo } from '../seltopia-logo';
import { LoadingOrb } from '../loading-orb';
import { StarryBackground } from '../starry-background';
import { MusicControl } from '../music-control';
import { THEMES_MAP } from '../../const';
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

type ScreenMode = 'loading' | 'revelation';

interface UnifiedScreenProps {
  mode: ScreenMode;
  isMusicPlaying: boolean;
  onMusicToggle: () => void;
  onBack?: () => void;
}


export function UnifiedScreen({ 
  mode, 
  isMusicPlaying, 
  onMusicToggle, 
  onBack 
}: UnifiedScreenProps) {
  // 使用 useMemo 缓存随机背景图片，避免重复执行
  const backgroundImage = useMemo(() => {
    if (mode === 'revelation') {
      // 从 THEMES_MAP 中随机选取主题
      const themeNames = Object.keys(THEMES_MAP) as (keyof typeof THEMES_MAP)[];
      const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)];
      const maxImageCount = THEMES_MAP[randomThemeName];
      
      // 根据选择的主题生成随机图片编号
      const imageNumber = Math.floor(Math.random() * maxImageCount) + 1;
      
      return `/src/assets/images/背景图片/${randomThemeName}/高清有字/${imageNumber}.png`;
    }
    return '';
  }, [mode]); // 只有当 mode 改变时才重新计算

  // 下载当前背景图片的函数
  const downloadCurrentImage = async () => {
    if (!backgroundImage) {
      console.error('没有背景图片可下载');
      return;
    }

    try {
      // 获取图片
      const response = await fetch(backgroundImage);
      if (!response.ok) {
        throw new Error(`获取图片失败: ${response.status}`);
      }
      
      // 转换为 blob
      const blob = await response.blob();
      
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 生成文件名
      const fileName = `seltopia-wisdom-${Date.now()}.png`;
      link.download = fileName;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      
      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('图片下载成功:', fileName);
    } catch (error) {
      console.error('下载失败:', error);
      // 可以在这里添加用户提示
    }
  };

  // 分享到Twitter的函数
  const shareToTwitter = () => {
    const shareText = 'Discover your wisdom with Seltopia - The Book of Answers 🔮✨';
    const shareUrl = window.location.href;
  
    const tweetText = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
  
    const twitterAppUrl = `twitter://post?message=${tweetText}`;
    const twitterWebUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
  
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
    // 桌面端直接跳网页
    if (!isMobile) {
      window.open(twitterWebUrl, "_blank", "noopener,noreferrer");
      return;
    }
  
    let didLeavePage = false;
  
    // 监听页面是否进入后台（即 App 被唤起）
    const handleVisibility = () => {
      if (document.hidden) {
        didLeavePage = true;
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
  
    // 尝试唤醒 Twitter App
    window.location.href = twitterAppUrl;
  
    // 回退逻辑（App 未唤起就执行）
    setTimeout(() => {
      document.removeEventListener("visibilitychange", handleVisibility);
  
      if (!didLeavePage) {
        alert('Twitter 分享已触发');
        // App 未被打开 → 回退至网页版
        window.open(twitterWebUrl, "_blank", "noopener,noreferrer");
      }
    }, 1200); // 1200ms 是移动深链的最佳实践时间（太长影响体验）
  
    console.log("Twitter 分享已触发");
  };

  // 根据模式设置容器样式
  const containerClassName = mode === 'loading' ? styles.loadingContainer : styles.revelationContainer;
  const backgroundStyle = mode === 'revelation' ? {
    backgroundImage: `url(${backgroundImage})`
  } : {};

  const handleContainerClick = () => {
    if (mode === 'revelation' && onBack) {
      onBack();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: mode === 'revelation' ? 1.2 : 0.8, ease: "easeOut" }}
      className={containerClassName}
      style={backgroundStyle}
      onClick={handleContainerClick}
    >
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
                className={styles.actionButton}
                aria-label="Download image"
                onClick={downloadCurrentImage}
              >
                <DownloadIcon />
              </button>
              <button
                className={styles.actionButton}
                aria-label="Share to Twitter"
                onClick={shareToTwitter}
              >
                <ShareIcon />
              </button>
              <div className={styles.musicControlInline}>
                <MusicControl 
                  isPlaying={isMusicPlaying} 
                  onToggle={onMusicToggle}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </motion.div>
  );
}

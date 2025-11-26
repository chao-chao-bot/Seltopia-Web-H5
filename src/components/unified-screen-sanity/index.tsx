import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SeltopiaLogo } from '../seltopia-logo';
import { LoadingOrb } from '../loading-orb';
import { StarryBackground } from '../starry-background';
import { MusicControl } from '../music-control';
import { THEMES_MAP } from '../../const';
import styles from './index.module.less';
import { getRandomImageByThemeAndTitle, urlFor } from './builder';

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


export function UnifiedScreenSanity({ 
  mode, 
  isMusicPlaying, 
  onMusicToggle, 
  onBack 
}: UnifiedScreenProps) {
  const [imageError, setImageError] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string>('');
  
  // 随机选择的主题（只在组件挂载时选择一次）
  const selectedThemeRef = useRef<string>('');
  
  // 只在第一次渲染时选择主题
  if (!selectedThemeRef.current) {
    const themeNames = Object.keys(THEMES_MAP) as (keyof typeof THEMES_MAP)[];
    const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)];
    selectedThemeRef.current = randomThemeName;
    console.log('🎲 随机选择主题:', randomThemeName);
  }

  // 从 Sanity 获取随机背景图片
  useEffect(() => {
    const fetchRandomImage = async () => {
      try {
        const maxImageCount = THEMES_MAP[selectedThemeRef.current as keyof typeof THEMES_MAP];
        // 根据选择的主题生成随机图片编号
        const imageNumber = Math.floor(Math.random() * maxImageCount) + 1;
        const title = `${selectedThemeRef.current}-${imageNumber}`;
        const randomImage = await getRandomImageByThemeAndTitle(selectedThemeRef.current, title);
        
        if (randomImage && randomImage.image) {
          const imageUrl = urlFor(randomImage.image)
            .width(1920)
            .quality(90)
            .url();
          
          setBackgroundImage(imageUrl);
          console.log('✅ 获取到背景图片:', randomImage.title, imageUrl);
        } else {
          console.warn('⚠️  未找到图片，使用默认图片');
          setImageError(true);
        }
      } catch (error) {
        console.error('❌ 获取背景图片失败:', error)        
        setImageError(true);
      }
    };

    fetchRandomImage();
  }, []);

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
      const fileName = `seltopia-${Date.now()}.png`;
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

  //TODO: 分享到Facebook的函数
  const shareToFacebook = async () => {
    const title = "Seltopia - The Book of Answers";
    const text = window.location.href;
    const url = window.location.href;
  
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
        return;
      } catch (err) {
        console.log("Share cancelled", err);
      }
    }
  
    // 回退到 Facebook Web 分享
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  // 根据模式设置容器样式
  const containerClassName = mode === 'loading' ? styles.loadingContainer : styles.revelationContainer;

  const handleContainerClick = () => {
    if (mode === 'revelation' && onBack) {
      onBack();
    }
  };

  // 背景图片样式（始终存在，只是透明度不同）
  const bgImageUrl = imageError 
    ? `url(/images/背景图片/default.webp)`
    : `url(${backgroundImage})`;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: mode === 'revelation' ? 1.2 : 0.8, ease: "easeOut" }}
      className={containerClassName}
      onClick={handleContainerClick}
    >
      {/* 🔥 预渲染背景图层 - 始终存在，loading时隐藏，revelation时显示 */}
      {backgroundImage && (
        <div 
          className={styles.prerenderedBackground}
          style={{ 
            backgroundImage: bgImageUrl,
            opacity: mode === 'revelation' ? 1 : 0
          }}
        />
      )}
      
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
          {/* Revelation content - 只在图片加载完成后显示 */}
          <motion.div 
            className={styles.mainContent}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
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
                aria-label="Share to Facebook"
                onClick={shareToFacebook}
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
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

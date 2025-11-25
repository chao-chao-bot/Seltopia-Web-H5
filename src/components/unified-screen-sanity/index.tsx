import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SeltopiaLogo } from '../seltopia-logo';
import { LoadingOrb } from '../loading-orb';
import { StarryBackground } from '../starry-background';
import { MusicControl } from '../music-control';
import { THEMES_MAP } from '../../const';
import styles from './index.module.less';
import { loader, urlFor } from './builder';
import type { SanityDocument } from '@sanity/client';
import { img } from 'framer-motion/client';

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const [images, setImages] = useState<string[]>([])

  console.log('images====',images);
  

  useEffect(() => {
    loader().then((data) => {
      setImages(data.map((item: SanityDocument) => urlFor(item.imageRef).url()))
    })
  }, []);

  // 
  const backgroundImageRef = useRef<string>('');
  
  // 只在第一次渲染时生成图片路径
  if (!backgroundImageRef.current) {
    // 从 THEMES_MAP 中随机选取主题
    // const themeNames = Object.keys(THEMES_MAP) as (keyof typeof THEMES_MAP)[];
    // const randomThemeName = themeNames[Math.floor(Math.random() * themeNames.length)];
    const randomThemeName = '禅宗';
    const maxImageCount = THEMES_MAP[randomThemeName];
    
    // 根据选择的主题生成随机图片编号
    const imageNumber = Math.floor(Math.random() * maxImageCount) + 1;
    backgroundImageRef.current = `/images/背景图片-webp/${randomThemeName}/高清有字/${imageNumber}.webp`;
    
    
  }
  
  const backgroundImage = backgroundImageRef.current;
  
  

  // 🔥 图片预加载 - 组件挂载后立即开始下载（在 loading 阶段）
  useEffect(() => {
    if (backgroundImage) {
      setImageLoaded(false);
      setImageError(false);
      
      // 创建内存中的图片对象用于预加载
      const img = new Image();
      
      img.onload = () => {
        // alert('图片预加载成功');
        console.log('✅ 图片预加载成功:', backgroundImage);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        console.error('❌ 图片预加载失败:', backgroundImage);
        setImageError(true);
        setImageLoaded(true);
      };
      
      // 🔥 设置 src 后浏览器立即开始下载并缓存图片
      // 即使这个 img 对象不在 DOM 中，图片也会被下载到浏览器缓存
      img.src = backgroundImage;
      
      console.log('🚀 开始预加载图片:', backgroundImage);
    }
  }, [backgroundImage]);

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

  // 分享到Facebook的函数
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
  const backgroundStyle = mode === 'revelation' ? {
    backgroundImage: imageError 
      ? `url(/images/背景图片/default.png)`
      : `url(${backgroundImage})`
  } : {};

  const handleContainerClick = () => {
    if (mode === 'revelation' && onBack) {
      onBack();
    }
  };

  return <img src={images[0]}></img>
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

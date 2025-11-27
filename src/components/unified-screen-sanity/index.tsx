import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { SeltopiaLogo } from '../seltopia-logo';
import { LoadingOrb } from '../loading-orb';
import { StarryBackground } from '../starry-background';
import { MusicControl } from '../music-control';
import { THEMES_MAP, WEBSITE_URL } from '../../const';
import styles from './index.module.less';
import { getRandomImageByThemeAndTitle, urlFor } from './builder';
import { DownloadIcon, ShareIcon } from '../ui/icon';



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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
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
          const imageUrl = urlFor(randomImage.image).url();
          
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

  // 显示全局提示
  const showGlobalToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // 复制链接到剪贴板
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(WEBSITE_URL);
      showGlobalToast(`已复制 ${WEBSITE_URL}`);
      console.log('✅ 链接已复制到剪贴板');
      return true;
    } catch (err) {
      console.error('❌ 复制失败:', err);
      // 回退方案：使用旧的 execCommand 方法
      try {
        const textArea = document.createElement('textarea');
        textArea.value = WEBSITE_URL;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showGlobalToast(`已复制 ${WEBSITE_URL}`);
        return true;
      } catch (fallbackErr) {
        console.error('❌ 回退复制方案也失败:', fallbackErr);
        showGlobalToast('复制失败，请手动复制');
        return false;
      }
    }
  };

  // 分享功能：优先尝试分享图片，回退到分享链接
  const shareToFacebook = async () => {
    const title = "Seltopia";
    // 检查是否支持 Web Share API
    if (navigator.share) {
      try {
        // 优先尝试分享图片（移动端）
        if (backgroundImage && navigator.canShare) {
          const response = await fetch(backgroundImage);
          const blob = await response.blob();
          const file = new File([blob], `seltopia-${Date.now()}.png`, { type: 'image/png' });
          
          // 检查是否可以分享文件
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              files: [file]
            });
            console.log('✅ 图片分享成功');
            return;
          }
        }
        
        // 回退：只分享链接
        await navigator.share({
          title,
          text: WEBSITE_URL,
          url: WEBSITE_URL,
        });
        console.log('✅ 链接分享成功');
        return;
      } catch (err) {
        console.log("分享取消或失败", err);
      }
    }
    // 最终回退：直接打开 Facebook 分享对话框
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(WEBSITE_URL)}`,
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
      {/* 全局提示 Toast */}
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={styles.toast}
        >
          {toastMessage}
        </motion.div>
      )}

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
                onClick={async () => {
                  await copyToClipboard();
                  await shareToFacebook();
                }}
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

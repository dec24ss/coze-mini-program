import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import { soundManager } from '@/utils/sound'
import './index.css'

const TOTAL_IMAGES = 10

// 装饰星星组件
const StarDecoration = ({ delay = 0, top, left, size = 'small' }: { delay?: number; top: string; left: string; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClass = size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'
  const delayClass = delay === 0 ? '' : delay === 1 ? 'delay-300' : 'delay-700'

  return (
    <View
      className={`absolute rounded-full bg-amber-200 animate-twinkle ${sizeClass} ${delayClass}`}
      style={{ top, left, boxShadow: '0 0 10px rgba(232, 184, 109, 0.8)' }}
    />
  )
}

export default function LoadingPage() {
  const { preloadImages, imagesLoaded, imageList } = useGameStore()
  const [totalImages] = useState(TOTAL_IMAGES)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 初始化音效系统
    soundManager.init()
    soundManager.loadSettings()

    // 延迟显示内容，产生淡入效果
    setTimeout(() => setShowContent(true), 300)

    // 预加载图片
    preloadImages().then(() => {
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 800)
    })
  }, [preloadImages])

  const progressPercent = totalImages > 0
    ? Math.round((imagesLoaded / totalImages) * 100)
    : 0

  return (
    <View className={`loading-page ${showContent ? 'loading-page-active' : ''}`}>
      {/* 背景装饰星星 */}
      <StarDecoration top="10%" left="15%" delay={0} size="small" />
      <StarDecoration top="20%" left="80%" delay={1} size="medium" />
      <StarDecoration top="35%" left="10%" delay={2} size="small" />
      <StarDecoration top="60%" left="85%" delay={0} size="large" />
      <StarDecoration top="75%" left="20%" delay={1} size="medium" />
      <StarDecoration top="85%" left="70%" delay={2} size="small" />
      <StarDecoration top="15%" left="50%" delay={0} size="small" />
      <StarDecoration top="45%" left="75%" delay={1} size="medium" />

      {/* 主要内容 */}
      <View className="loading-content">
        {/* Logo 区域 */}
        <View className="loading-logo-container">
          <View className="loading-logo-ring loading-logo-ring-1" />
          <View className="loading-logo-ring loading-logo-ring-2" />
          <View className="loading-logo-ring loading-logo-ring-3" />

          <View className="loading-logo">
            <Text className="loading-logo-icon">🧩</Text>
          </View>
        </View>

        {/* 标题 */}
        <Text className="block loading-title">海海拼图</Text>
        <Text className="block loading-subtitle">Puzzle Adventure</Text>

        {/* 进度条容器 */}
        <View className="loading-progress-wrapper">
          {/* 进度条背景 */}
          <View className="loading-progress-bg">
            {/* 星星装饰 */}
            <Text className="loading-progress-star" style={{ left: '10%' }}>✨</Text>
            <Text className="loading-progress-star" style={{ left: '40%', animationDelay: '0.5s' }}>✨</Text>
            <Text className="loading-progress-star" style={{ left: '70%', animationDelay: '1s' }}>✨</Text>

            {/* 进度填充 */}
            <View
              className="loading-progress-fill"
              style={{ width: `${progressPercent}%` }}
            >
              {/* 流光效果 */}
              <View className="loading-progress-shimmer" />

              {/* 进度头部光点 */}
              <View className="loading-progress-glow" />
            </View>
          </View>

          {/* 进度百分比 */}
          <Text className="block loading-percent">{progressPercent}%</Text>
        </View>

        {/* 加载状态文字 */}
        <View className="loading-status">
          <Text className="block loading-text">
            {imagesLoaded === 0 ? '正在准备拼图碎片...' :
             imagesLoaded < totalImages ?
             `正在加载... ${imagesLoaded}/${totalImages}` :
             '准备就绪！'}
          </Text>

          {imagesLoaded < totalImages && imagesLoaded > 0 && (
            <Text className="block loading-hint">✨ 精彩即将呈现</Text>
          )}
        </View>
      </View>

      {/* 底部装饰 */}
      <View className="loading-footer">
        <Text className="block loading-footer-text">拖拽碎片 · 完成拼图</Text>
      </View>

      {/* 隐藏的图片预加载 */}
      <View style={{ display: 'none' }}>
        {imageList.map((url, index) => (
          <Image
            key={`preload-${index}`}
            src={url}
            mode="aspectFill"
            onLoad={() => {
              console.log(`🖼️ 图片 ${index + 1} 已加载`)
            }}
          />
        ))}
      </View>
    </View>
  )
}

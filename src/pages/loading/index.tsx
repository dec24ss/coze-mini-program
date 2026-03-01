import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import { useSettingsStore } from '@/stores/settingsStore'
import './index.css'

const TOTAL_IMAGES = 10 // 固定10张图片（对应10个关卡）

export default function LoadingPage() {
  const { preloadImages, imagesLoaded, imageList } = useGameStore()
  const { preloadSounds, soundsLoadProgress, soundsLoaded } = useSettingsStore()
  const [totalImages] = useState(TOTAL_IMAGES)
  const [loadingStage, setLoadingStage] = useState<'images' | 'sounds' | 'complete'>('images')

  useEffect(() => {
    const initApp = async () => {
      // 阶段1：预加载图片
      setLoadingStage('images')
      await preloadImages()
      console.log('🖼️ 图片预加载完成')

      // 阶段2：预加载音效
      setLoadingStage('sounds')
      await preloadSounds()
      console.log('🔊 音效预加载完成')

      // 阶段3：加载完成，跳转到首页
      setLoadingStage('complete')
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 500)
    }

    initApp()
  }, [preloadImages, preloadSounds])

  // 计算总加载进度（图片60% + 音效40%）
  const imageProgressPercent = totalImages > 0
    ? Math.round((imagesLoaded / totalImages) * 60)
    : 0
  const soundProgressPercent = Math.round(soundsLoadProgress * 0.4)
  const totalProgressPercent = imageProgressPercent + soundProgressPercent

  // 获取当前加载文字
  const getLoadingText = () => {
    if (loadingStage === 'images') {
      return imagesLoaded === 0
        ? '正在加载图片...'
        : `正在加载图片... ${imagesLoaded}/${totalImages}`
    } else if (loadingStage === 'sounds') {
      return `正在加载音效... ${soundsLoadProgress}%`
    } else {
      return '资源加载完成！'
    }
  }

  return (
    <View className="loading-page">
      <View className="loading-content">
        <Text className="block loading-title">海海拼图大作战</Text>

        {/* 进度条 */}
        <View className="loading-progress-container">
          <View className="loading-progress-bar">
            <View
              className="loading-progress-fill"
              style={{ width: `${totalProgressPercent}%` }}
            />
          </View>
          <Text className="block loading-percent">
            {totalProgressPercent}%
          </Text>
        </View>

        {/* 加载文字 */}
        <Text className="block loading-text">
          {getLoadingText()}
        </Text>

        {/* 加载详情 */}
        <View className="loading-details">
          <Text className="block loading-detail-item">
            📷 图片: {imagesLoaded}/{totalImages}
          </Text>
          <Text className="block loading-detail-item">
            🔊 音效: {soundsLoaded ? '✅ 已加载' : '⏳ 加载中...'}
          </Text>
        </View>

        {/* 加载状态提示 */}
        {!soundsLoaded && (
          <View className="loading-tips">
            <Text className="block loading-tip-text">
              💡 首次加载可能需要几秒钟
            </Text>
          </View>
        )}
      </View>

      {/* 隐藏的图片列表，确保所有图片都被真正加载到 DOM 中 */}
      <View style={{ display: 'none' }}>
        {imageList.map((url, index) => (
          <Image
            key={`preload-${index}`}
            src={url}
            mode="aspectFill"
            onLoad={() => {
              console.log(`🖼️ 图片 ${index + 1} 已加载到 DOM`)
            }}
          />
        ))}
      </View>
    </View>
  )
}

import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

const TOTAL_IMAGES = 30 // 固定30张图片

export default function LoadingPage() {
  const { preloadImages, imagesLoaded } = useGameStore()
  const [totalImages] = useState(TOTAL_IMAGES)

  useEffect(() => {
    // 预加载图片
    preloadImages().then(() => {
      // 图片加载完成后跳转到首页
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 500)
    })
  }, [preloadImages])

  // 计算加载进度百分比
  const progressPercent = totalImages > 0
    ? Math.round((imagesLoaded / totalImages) * 100)
    : 0

  return (
    <View className="loading-page">
      <View className="loading-content">
        <Text className="block loading-title">海海拼图大作战</Text>

        {/* 进度条 */}
        <View className="loading-progress-container">
          <View className="loading-progress-bar">
            <View
              className="loading-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
          <Text className="block loading-percent">
            {progressPercent}%
          </Text>
        </View>

        {/* 加载文字 */}
        <Text className="block loading-text">
          {imagesLoaded === 0 ? '正在加载图片...' :
           imagesLoaded < totalImages ?
           `正在加载图片... ${imagesLoaded}/${totalImages}` :
           '图片加载完成！'}
        </Text>

        {/* 加载状态提示 */}
        {imagesLoaded < totalImages && imagesLoaded > 0 && (
          <View className="loading-tips">
            <Text className="block loading-tip-text">
              💡 首次加载可能需要几秒钟
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

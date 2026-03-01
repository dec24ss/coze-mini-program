import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import { FishIcon, CrabIcon, ShellIcon, BubbleIcon } from '@/components/ocean-icons'
import './index.css'

const TOTAL_IMAGES = 10 // 固定10张图片（对应10个关卡）

export default function LoadingPage() {
  const { preloadImages, imagesLoaded, imageList } = useGameStore()
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
      {/* 背景层 */}
      <View className="loading-background">
        {/* 天空渐变 */}
        <View className="loading-sky" />

        {/* 三层海浪 */}
        <View className="loading-wave wave-layer-1" />
        <View className="loading-wave wave-layer-2" />
        <View className="loading-wave wave-layer-3" />

        {/* 沙滩层 */}
        <View className="loading-sand">
          {/* 装饰元素：小螃蟹和贝壳 */}
          <View className="decoration-decoration decoration-crab-1">
            <CrabIcon size={32} color="#FF9500" />
          </View>
          <View className="decoration-decoration decoration-crab-2">
            <CrabIcon size={24} color="#FF9500" />
          </View>
          <View className="decoration-decoration decoration-shell-1">
            <ShellIcon size={24} color="#FFB6C1" />
          </View>
          <View className="decoration-decoration decoration-shell-2">
            <ShellIcon size={20} color="#FFB6C1" />
          </View>
          <View className="decoration-decoration decoration-shell-3">
            <ShellIcon size={28} color="#FFB6C1" />
          </View>
        </View>
      </View>

      {/* 主内容 */}
      <View className="loading-content">
        {/* 标题区 */}
        <View className="loading-title-area">
          <Text className="block loading-title">海海拼图大作战</Text>
          {/* 标题装饰：气泡和小鱼 */}
          <View className="title-decorations">
            <View className="title-decoration title-decoration-1">
              <BubbleIcon size={20} color="#FFB6C1" />
            </View>
            <View className="title-decoration title-decoration-2">
              <FishIcon size={24} color="#FF9500" />
            </View>
            <View className="title-decoration title-decoration-3">
              <BubbleIcon size={16} color="#007AFF" />
            </View>
          </View>
        </View>

        {/* 进度条区 */}
        <View className="loading-progress-area">
          <View className="loading-progress-container">
            <View
              className="loading-progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
            {/* 小鱼沿进度条游动 */}
            <View
              className="loading-progress-fish"
              style={{ left: `${progressPercent}%` }}
            >
              <FishIcon size={28} color="#FF9500" />
            </View>
          </View>
          {/* 进度百分比 */}
          <Text className="block loading-percent">
            {progressPercent}%
          </Text>
        </View>

        {/* 加载文字区 */}
        <View className="loading-text-area">
          <Text className="block loading-text">
            {imagesLoaded === 0 ? '正在加载图片…' :
             imagesLoaded < totalImages ?
             `正在加载图片… ${imagesLoaded}/${totalImages}` :
             '图片加载完成！'}
          </Text>
          {/* 问号气泡图标 */}
          <View className="loading-question-icon">
            <BubbleIcon size={24} color="#007AFF" />
            <Text className="question-mark">?</Text>
          </View>
        </View>

        {/* 副提示 */}
        {imagesLoaded < totalImages && imagesLoaded > 0 && (
          <View className="loading-tips">
            <Text className="block loading-tip-text">
              首次加载可能需要几秒钟
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

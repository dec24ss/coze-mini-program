import { View, Text } from '@tarojs/components'
import { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

export default function LoadingPage() {
  const { preloadImages, imagesLoaded } = useGameStore()

  useEffect(() => {
    // 预加载图片
    preloadImages().then(() => {
      // 图片加载完成后跳转到首页
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 500)
    })
  }, [preloadImages])

  return (
    <View className="loading-page">
      <View className="loading-content">
        <Text className="block loading-title">海海拼图大作战</Text>
        <View className="loading-progress-bar">
          <View
            className="loading-progress-fill"
            style={{ width: `${imagesLoaded * 10}%` }}
          />
        </View>
        <Text className="block loading-text">
          正在加载图片... {imagesLoaded}/10
        </Text>
      </View>
    </View>
  )
}

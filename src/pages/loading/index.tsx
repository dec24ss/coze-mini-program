import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

// 云开发开关：在 Coze 环境中设为 false，下载到本地后设为 true
const USE_CLOUDBASE = false

const TOTAL_IMAGES = 100 // 固定100张图片（对应100个关卡）

export default function LoadingPage() {
  const { preloadImages, imagesLoaded, imageList } = useGameStore()
  const [totalImages] = useState(TOTAL_IMAGES)
  const [cloudbaseReady, setCloudbaseReady] = useState(!USE_CLOUDBASE)

  useEffect(() => {
    if (!USE_CLOUDBASE) {
      console.log('⚠️  云开发已禁用（在 Coze 环境中）')
      setCloudbaseReady(true)
      return
    }

    // 初始化云开发
    const initializeCloudbase = async () => {
      try {
        const { initCloudbase } = await import('@/cloudbase')
        await initCloudbase()
        console.log('☁️ 云开发初始化成功')
        setCloudbaseReady(true)
      } catch (error) {
        console.error('☁️ 云开发初始化失败:', error)
        setCloudbaseReady(true) // 即使失败也继续
      }
    }

    initializeCloudbase()
  }, [])

  useEffect(() => {
    if (!cloudbaseReady) return

    // 预加载图片
    preloadImages().then(() => {
      // 图片加载完成后跳转到首页
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 500)
    })
  }, [preloadImages, cloudbaseReady])

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

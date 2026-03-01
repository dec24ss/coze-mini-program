import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

const TOTAL_IMAGES = 10 // 固定10张图片（对应10个关卡）

// 音效文件列表
const SOUND_EFFECTS = [
  { name: 'success', url: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.m4a' }, // 成功音效
  { name: 'fail', url: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.m4a' }, // 失败音效
  { name: 'click', url: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.m4a' }, // 点击音效
  { name: 'drag', url: 'https://assets.mixkit.co/active_storage/sfx/2577/2577-preview.m4a' }, // 拖拽音效
]

export default function LoadingPage() {
  const { preloadImages, imagesLoaded, imageList } = useGameStore()
  const [totalImages] = useState(TOTAL_IMAGES)
  const [soundsLoaded, setSoundsLoaded] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [isLoadingSounds, setIsLoadingSounds] = useState(false)
  const [totalSounds] = useState(SOUND_EFFECTS.length)

  // 预加载音效
  const preloadSounds = async (): Promise<void> => {
    setIsLoadingSounds(true)
    let loadedCount = 0

    const loadPromises = SOUND_EFFECTS.map((sound) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio()
        audio.src = sound.url
        audio.preload = 'auto'

        audio.oncanplaythrough = () => {
          loadedCount++
          setSoundsLoaded(loadedCount)
          console.log(`🎵 音效 ${sound.name} 已加载`)
          resolve()
        }

        audio.onerror = () => {
          console.warn(`⚠️ 音效 ${sound.name} 加载失败`)
          // 即使失败也算加载完成，避免卡住
          loadedCount++
          setSoundsLoaded(loadedCount)
          resolve()
        }

        audio.load()
      })
    })

    await Promise.all(loadPromises)
    setIsLoadingSounds(false)
  }

  useEffect(() => {
    // 第一步：预加载图片
    setIsLoadingImages(true)
    preloadImages().then(() => {
      setIsLoadingImages(false)
      // 第二步：图片加载完成后预加载音效
      preloadSounds().then(() => {
        // 音效加载完成后跳转到首页
        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/index/index' })
        }, 500)
      })
    })
  }, [preloadImages])

  // 计算加载进度百分比
  const progressPercent = isLoadingImages
    ? (totalImages > 0 ? Math.round((imagesLoaded / totalImages) * 100) : 0)
    : (isLoadingSounds ? Math.round((soundsLoaded / totalSounds) * 100) : 100)

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
          {isLoadingImages ? (
            // 图片加载阶段
            imagesLoaded === 0 ? '正在加载图片...' :
            imagesLoaded < totalImages ?
            `正在加载图片... ${imagesLoaded}/${totalImages}` :
            '图片加载完成！'
          ) : isLoadingSounds ? (
            // 音效加载阶段
            soundsLoaded === 0 ? '正在加载音效...' :
            soundsLoaded < totalSounds ?
            `正在加载音效... ${soundsLoaded}/${totalSounds}` :
            '音效加载完成！'
          ) : (
            // 全部加载完成
            '加载完成！'
          )}
        </Text>

        {/* 加载状态提示 */}
        {imagesLoaded < totalImages && imagesLoaded > 0 && isLoadingImages && (
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

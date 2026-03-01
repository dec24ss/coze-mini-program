import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import { Network } from '@/network'
import './index.css'

const TOTAL_IMAGES = 10 // 固定10张图片（对应10个关卡）

export default function LoadingPage() {
  const { preloadImages, imagesLoaded, imageList } = useGameStore()
  const [totalImages] = useState(TOTAL_IMAGES)
  const [soundsLoaded, setSoundsLoaded] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(true)
  const [isLoadingSounds, setIsLoadingSounds] = useState(false)
  const [totalSounds, setTotalSounds] = useState(0)
  const [soundEffects, setSoundEffects] = useState<{ name: string; url: string }[]>([])

  // 从后端获取音效列表
  const fetchSoundEffects = async (): Promise<void> => {
    try {
      const res = await Network.request<{ code: number; msg: string; data: { sounds: { name: string; url: string }[]; total: number } }>({
        url: '/api/images/sounds'
      })
      if (res.data.data.sounds && res.data.data.sounds.length > 0) {
        setSoundEffects(res.data.data.sounds)
        setTotalSounds(res.data.data.sounds.length)
        console.log('🎵 获取音效列表成功:', res.data.data.sounds)
      }
    } catch (error) {
      console.error('❌ 获取音效列表失败:', error)
      // 使用默认音效列表作为后备方案
      const defaultSounds = [
        { name: 'click', url: 'https://www.soundjay.com/buttons/sounds/button-1.mp3' },
        { name: 'success', url: 'https://www.soundjay.com/buttons/sounds/button-2.mp3' },
        { name: 'fail', url: 'https://www.soundjay.com/buttons/sounds/button-3.mp3' },
        { name: 'drag', url: 'https://www.soundjay.com/buttons/sounds/button-4.mp3' },
      ]
      setSoundEffects(defaultSounds)
      setTotalSounds(defaultSounds.length)
      console.log('⚠️ 使用默认音效列表作为后备方案')
    }
  }

  useEffect(() => {
    // 预加载音效函数（定义在 useEffect 内部以避免依赖问题）
    const preloadSounds = async (): Promise<void> => {
      setIsLoadingSounds(true)
      let loadedCount = 0

      const loadPromises = soundEffects.map((sound) => {
        return new Promise<void>((resolve) => {
          const timeoutId = setTimeout(() => {
            console.warn(`⚠️ 音效 ${sound.name} 加载超时`)
            loadedCount++
            setSoundsLoaded(loadedCount)
            resolve()
          }, 10000) // 10秒超时

          const audio = new Audio()
          audio.src = sound.url
          audio.preload = 'auto'

          audio.oncanplaythrough = () => {
            clearTimeout(timeoutId)
            loadedCount++
            setSoundsLoaded(loadedCount)
            console.log(`🎵 音效 ${sound.name} 已加载`)
            resolve()
          }

          audio.onerror = () => {
            clearTimeout(timeoutId)
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

    // 第一步：预加载图片
    setIsLoadingImages(true)
    preloadImages().then(() => {
      setIsLoadingImages(false)
      // 第二步：从后端获取音效列表
      fetchSoundEffects().then(() => {
        // 第三步：音效列表获取完成后加载音效
        preloadSounds().then(() => {
          // 音效加载完成后跳转到首页
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/index/index' })
          }, 500)
        })
      })
    })
  }, [preloadImages, soundEffects])

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

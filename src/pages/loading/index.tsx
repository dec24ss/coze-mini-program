import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

const TOTAL_IMAGES = 30 // 固定30张图片

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

      {/* 预渲染拼图板（使用 backgroundImage，确保进入关卡时立即可用） */}
      {imagesLoaded === totalImages && imageList.length > 0 && (
        <View style={{ display: 'none' }}>
          {/* 为前10关预渲染拼图板 */}
          {[...Array(10)].map((_, levelIndex) => {
            const level = levelIndex + 1
            let gridSize = 3
            if (level >= 4 && level <= 6) gridSize = 4
            else if (level >= 7 && level <= 9) gridSize = 5
            else if (level >= 10) gridSize = 6

            const imageUrl = imageList[levelIndex % imageList.length]

            return (
              <View
                key={`puzzle-board-${level}`}
                style={{
                  width: '300px',
                  height: '400px',
                  position: 'relative'
                }}
              >
                {/* 预渲染所有拼图碎片 */}
                {[...Array(gridSize * gridSize)].map((__unused, pieceIndex) => {
                  const col = pieceIndex % gridSize
                  const row = Math.floor(pieceIndex / gridSize)

                  return (
                    <View
                      key={`piece-${level}-${pieceIndex}`}
                      style={{
                        position: 'absolute',
                        width: `${100 / gridSize}%`,
                        height: `${100 / gridSize}%`,
                        left: `${col * (100 / gridSize)}%`,
                        top: `${row * (100 / gridSize)}%`,
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: `${gridSize * 100}%`,
                        backgroundPosition: `${(col) * (100 / (gridSize - 1))}% ${row * (100 / (gridSize - 1))}%`,
                        boxSizing: 'border-box'
                      }}
                    />
                  )
                })}
              </View>
            )
          })}
        </View>
      )}
    </View>
  )
}

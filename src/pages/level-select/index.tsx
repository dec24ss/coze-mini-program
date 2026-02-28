import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import './index.css'

export default function LevelSelectPage() {
  const { levelImageMap, isImagesPreloaded, startGame } = useGameStore()
  const { userInfo, isLoggedIn, unlockedLevels, levelImages } = useUserStore()
  const [displayLevels, setDisplayLevels] = useState(20)  // 默认显示20关

  useEffect(() => {
    // 如果图片未预加载，跳回首页
    if (!isImagesPreloaded || Object.keys(levelImageMap).length === 0) {
      Taro.showToast({ title: '请先开始游戏', icon: 'none' })
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 1500)
    }
  }, [isImagesPreloaded, levelImageMap])

  // 开始指定关卡（自由模式）
  const handleStartLevel = async (level: number) => {
    // 检查关卡是否已解锁
    if (level > unlockedLevels) {
      Taro.showToast({ title: '该关卡尚未解锁', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '加载中...' })

      // 从关卡选择进入的游戏都是自由模式（无倒计时，不记录进度）
      await startGame(level, true)

      Taro.hideLoading()
      Taro.redirectTo({ url: '/pages/game/index' })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '加载失败', icon: 'none' })
      console.error('加载关卡失败:', error)
    }
  }

  // 返回首页
  const handleBackHome = () => {
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  // 加载更多关卡
  const handleLoadMore = () => {
    setDisplayLevels(prev => prev + 10)
  }

  // 生成关卡数组
  const levels = Array.from({ length: displayLevels }, (_, i) => i + 1)

  return (
    <View className="level-select-page">
      <View className="level-header">
        <Text className="block level-title">选择关卡</Text>
        {isLoggedIn && userInfo && (
          <Text className="block level-subtitle">
            最高关卡：第{userInfo.highestLevel}关 | 已解锁：第{unlockedLevels}关
          </Text>
        )}
      </View>

      <View className="level-grid">
        {levels.map((level) => {
          const isLocked = level > unlockedLevels
          const isCompleted = userInfo && level <= userInfo.highestLevel
          // 优先使用用户保存的关卡图片，否则使用预加载的图片
          const savedImage = levelImages[level]
          const preloadedImage = levelImageMap[level]
          const levelImage = savedImage || (preloadedImage?.url)

          return (
            <View
              key={level}
              className={`level-item ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isLocked && handleStartLevel(level)}
            >
              {isLocked ? (
                // 锁定关卡显示蓝色色块
                <View className="locked-block" />
              ) : isCompleted && levelImage ? (
                // 已过关显示缩略图
                <>
                  <Image
                    className="level-thumbnail"
                    src={levelImage}
                    mode="aspectFill"
                  />
                  <View className="level-number-overlay">{level}</View>
                </>
              ) : (
                // 已解锁但未过关（自由模式）
                <>
                  <Text className="block level-number">{level}</Text>
                  <Text className="block level-hint">自由模式</Text>
                </>
              )}
              {isCompleted && <View className="completed-overlay">✓</View>}
            </View>
          )
        })}
      </View>

      <View className="load-more">
        <Button className="load-more-button" onClick={handleLoadMore}>
          加载更多
        </Button>
      </View>

      <View className="level-footer">
        <Button className="footer-button" onClick={handleBackHome}>
          返回首页
        </Button>
      </View>
    </View>
  )
}

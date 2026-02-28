import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import { useUserStore } from '@/stores/userStore'
import './index.css'

export default function LevelSelectPage() {
  const { levelImageMap, isImagesPreloaded, startFreePlayMode } = useGameStore()
  const { userInfo, isLoggedIn, unlockedLevels } = useUserStore()
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

  // 开始指定关卡
  const handleStartLevel = async (level: number) => {
    // 检查关卡是否已解锁
    if (level > unlockedLevels) {
      Taro.showToast({ title: '该关卡尚未解锁', icon: 'none' })
      return
    }

    try {
      Taro.showLoading({ title: '加载中...' })
      await startFreePlayMode(level)
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

          return (
            <View
              key={level}
              className={`level-item ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}
              onClick={() => !isLocked && handleStartLevel(level)}
            >
              <Text className="block level-number">{level}</Text>
              {isLocked ? (
                <Text className="block lock-icon">🔒</Text>
              ) : isCompleted ? (
                <Text className="block completed-icon">✓</Text>
              ) : (
                <Text className="block level-hint">可挑战</Text>
              )}
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

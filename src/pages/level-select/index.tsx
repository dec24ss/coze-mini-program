import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { useGameStore } from '@/stores/gameStore'
import './index.css'

export default function LevelSelectPage() {
  const { levelImageMap, isImagesPreloaded, startFreePlayMode } = useGameStore()
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    // 从上一个页面传递的总时间
    const totalTimeStr = Taro.getStorageSync('totalTimeSpent')
    if (totalTimeStr) {
      setTotalTime(parseInt(totalTimeStr))
      Taro.removeStorageSync('totalTimeSpent')
    }

    // 如果图片未预加载，跳回首页
    if (!isImagesPreloaded || Object.keys(levelImageMap).length === 0) {
      Taro.showToast({ title: '请先开始游戏', icon: 'none' })
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/index/index' })
      }, 1500)
    }
  }, [isImagesPreloaded, levelImageMap])

  // 格式化时间
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 开始指定关卡
  const handleStartLevel = async (level: number) => {
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

  const levels = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <View className="level-select-page">
      <View className="level-header">
        <Text className="block level-title">选择关卡</Text>
        {totalTime > 0 && (
          <Text className="block level-subtitle">总花费时间：{formatTime(totalTime)}</Text>
        )}
      </View>

      <View className="level-grid">
        {levels.map((level) => (
          <View
            key={level}
            className="level-item"
            onClick={() => handleStartLevel(level)}
          >
            <Text className="block level-number">{level}</Text>
            <Text className="block level-hint">不再倒计时</Text>
          </View>
        ))}
      </View>

      <View className="level-footer">
        <Button className="footer-button" onClick={handleBackHome}>
          返回首页
        </Button>
      </View>
    </View>
  )
}

import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { ChevronLeft, Clock } from 'lucide-react'
import { useGameStore } from '@/stores/gameStore'
import { playSound } from '@/utils/sound'
import './index.css'

// 装饰星星组件
const StarDecoration = ({ delay = 0, top, left, size = 'small' }: { delay?: number; top: string; left: string; size?: 'small' | 'medium' | 'large' }) => {
  const sizeClass = size === 'small' ? 'w-1 h-1' : size === 'medium' ? 'w-2 h-2' : 'w-3 h-3'
  const delayClass = delay === 0 ? '' : delay === 1 ? 'delay-300' : 'delay-700'

  return (
    <View
      className={`absolute rounded-full bg-amber-200 animate-twinkle ${sizeClass} ${delayClass}`}
      style={{ top, left, boxShadow: '0 0 10px rgba(232, 184, 109, 0.8)' }}
    />
  )
}

// 关卡项组件
const LevelItem = ({
  level,
  gridSize,
  onClick,
  imageUrl,
  delay
}: {
  level: number
  gridSize: number
  onClick: () => void
  imageUrl?: string
  delay: number
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const handleTouchStart = () => {
    setIsPressed(true)
  }

  const handleTouchEnd = () => {
    setIsPressed(false)
  }

  const getDifficultyLabel = (size: number) => {
    if (size <= 3) return '简单'
    if (size <= 4) return '中等'
    if (size <= 5) return '困难'
    return '大师'
  }

  const getDifficultyColor = (size: number) => {
    if (size <= 3) return '#34d399'
    if (size <= 4) return '#fbbf24'
    if (size <= 5) return '#f87171'
    return '#a78bfa'
  }

  return (
    <View
      className={`level-item ${isPressed ? 'level-item-pressed' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
      onClick={onClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* 背景图片 */}
      {imageUrl && (
        <Image
          className="level-item-bg"
          src={imageUrl}
          mode="aspectFill"
        />
      )}

      {/* 遮罩 */}
      <View className="level-item-overlay" />

      {/* 内容 */}
      <View className="level-item-content">
        <Text className="block level-item-number">{level}</Text>
        <Text
          className="block level-item-difficulty"
          style={{ color: getDifficultyColor(gridSize) }}
        >
          {getDifficultyLabel(gridSize)}
        </Text>
        <Text className="block level-item-grid">{gridSize}×{gridSize}</Text>
      </View>

      {/* 选中效果 */}
      <View className="level-item-glow" />
    </View>
  )
}

export default function LevelSelectPage() {
  const { levelImageMap, isImagesPreloaded, startFreePlayMode, getLevelConfig } = useGameStore()
  const [totalTime, setTotalTime] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 淡入动画
    setTimeout(() => setShowContent(true), 100)

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
    playSound('click')

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
    playSound('click')
    Taro.redirectTo({ url: '/pages/index/index' })
  }

  const levels = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <View className={`level-select-page ${showContent ? 'level-select-page-active' : ''}`}>
      {/* 背景装饰星星 */}
      <StarDecoration top="5%" left="10%" delay={0} size="small" />
      <StarDecoration top="12%" left="88%" delay={1} size="medium" />
      <StarDecoration top="25%" left="5%" delay={2} size="small" />
      <StarDecoration top="50%" left="92%" delay={0} size="large" />
      <StarDecoration top="70%" left="8%" delay={1} size="medium" />
      <StarDecoration top="88%" left="85%" delay={2} size="small" />

      {/* 头部 */}
      <View className="level-header">
        <View className="level-back-btn" onClick={handleBackHome}>
          <ChevronLeft size={24} color="rgba(245, 245, 240, 0.8)" />
        </View>

        <View className="level-header-content">
          <Text className="block level-title">选择关卡</Text>
          <Text className="block level-subtitle">自由游玩模式</Text>
        </View>

        {/* 占位保持居中 */}
        <View className="w-10" />
      </View>

      {/* 总时间显示 */}
      {totalTime > 0 && (
        <View className="level-time-card">
          <Clock size={18} color="#e8b86d" />
          <Text className="block level-time-text">
            上次通关总时间：{formatTime(totalTime)}
          </Text>
        </View>
      )}

      {/* 关卡网格 */}
      <View className="level-grid">
        {levels.map((level, index) => {
          const config = getLevelConfig(level)
          return (
            <LevelItem
              key={level}
              level={level}
              gridSize={config.gridSize}
              imageUrl={levelImageMap[level]?.path}
              delay={index * 50}
              onClick={() => handleStartLevel(level)}
            />
          )
        })}
      </View>

      {/* 底部提示 */}
      <View className="level-footer">
        <Text className="block level-footer-text">
          💡 自由模式下无时间限制
        </Text>
      </View>
    </View>
  )
}

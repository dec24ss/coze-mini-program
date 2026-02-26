import { View, Text, Button } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Volume2, VolumeX } from 'lucide-react'
import { playSound, playBGM, soundManager } from '@/utils/sound'
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

// 浮动拼图块组件
const FloatingPiece = ({ emoji, delay, top, left, rotate }: { emoji: string; delay: number; top: string; left: string; rotate: string }) => (
  <View
    className="absolute animate-float"
    style={{
      top,
      left,
      animationDelay: `${delay}s`,
      transform: `rotate(${rotate})`,
      opacity: 0.6,
    }}
  >
    <Text className="text-2xl">{emoji}</Text>
  </View>
)

export default function IndexPage() {
  const [showContent, setShowContent] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    // 淡入动画
    setTimeout(() => setShowContent(true), 100)

    // 加载静音状态
    setIsMuted(soundManager.getMuteStatus())

    // 播放背景音乐
    playBGM()
  }, [])

  // 切换静音
  const handleToggleMute = () => {
    const newMuted = soundManager.toggleMute()
    setIsMuted(newMuted)
    playSound('click')
  }

  const handleStartGame = () => {
    playSound('click')
    Taro.navigateTo({ url: '/pages/game/index' })
  }

  const handleSelectLevel = () => {
    playSound('click')
    Taro.navigateTo({ url: '/pages/level-select/index' })
  }

  return (
    <View className={`home-page ${showContent ? 'home-page-active' : ''}`}>
      {/* 背景装饰星星 */}
      <StarDecoration top="8%" left="12%" delay={0} size="small" />
      <StarDecoration top="15%" left="85%" delay={1} size="medium" />
      <StarDecoration top="30%" left="8%" delay={2} size="small" />
      <StarDecoration top="55%" left="90%" delay={0} size="large" />
      <StarDecoration top="70%" left="15%" delay={1} size="medium" />
      <StarDecoration top="85%" left="75%" delay={2} size="small" />
      <StarDecoration top="12%" left="55%" delay={0} size="small" />
      <StarDecoration top="40%" left="80%" delay={1} size="medium" />

      {/* 浮动拼图装饰 */}
      <FloatingPiece emoji="🧩" delay={0} top="20%" left="5%" rotate="-15deg" />
      <FloatingPiece emoji="🌟" delay={1} top="60%" left="8%" rotate="10deg" />
      <FloatingPiece emoji="✨" delay={2} top="35%" left="92%" rotate="-8deg" />
      <FloatingPiece emoji="🎯" delay={0} top="75%" left="88%" rotate="20deg" />

      {/* 静音按钮 */}
      <View
        className="absolute top-12 right-6 z-10 w-10 h-10 rounded-full glass flex items-center justify-center active:scale-95 transition-transform"
        onClick={handleToggleMute}
      >
        {isMuted ? (
          <VolumeX size={20} color="rgba(245, 245, 240, 0.8)" />
        ) : (
          <Volume2 size={20} color="rgba(245, 245, 240, 0.8)" />
        )}
      </View>

      {/* 主要内容 */}
      <View className="home-content">
        {/* Logo 区域 */}
        <View className="home-logo-section">
          <View className="home-logo-ring home-logo-ring-1" />
          <View className="home-logo-ring home-logo-ring-2" />

          <View className="home-logo">
            <Text className="home-logo-icon">🧩</Text>
          </View>
        </View>

        {/* 标题 */}
        <View className="home-title-section">
          <Text className="block home-title">海海拼图</Text>
          <Text className="block home-subtitle">Puzzle Adventure</Text>
          <View className="home-title-underline" />
        </View>

        {/* 描述 */}
        <Text className="block home-description">
          拖拽碎片，完成拼图{'\n'}
          挑战10个精彩关卡
        </Text>

        {/* 按钮组 */}
        <View className="home-buttons">
          {/* 主按钮 - 开始游戏 */}
          <View
            className="home-btn-primary"
            onClick={handleStartGame}
          >
            <Button className="home-btn-primary-text">
              开始游戏
            </Button>
            <View className="home-btn-primary-glow" />
          </View>

          {/* 次按钮 - 选择关卡 */}
          <View
            className="home-btn-secondary"
            onClick={handleSelectLevel}
          >
            <Button className="home-btn-secondary-text">
              选择关卡
            </Button>
          </View>
        </View>
      </View>

      {/* 底部装饰 */}
      <View className="home-footer">
        <View className="home-footer-dots">
          <View className="home-footer-dot active" />
          <View className="home-footer-dot" />
          <View className="home-footer-dot" />
        </View>
        <Text className="block home-footer-text">拖拽碎片 · 完成拼图</Text>
      </View>
    </View>
  )
}

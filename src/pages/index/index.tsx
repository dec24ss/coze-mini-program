import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.css'

export default function IndexPage() {
  const handleStartGame = () => {
    Taro.navigateTo({ url: '/pages/game/index' })
  }

  return (
    <View className="home-page">
      <View className="home-content">
        <Text className="block home-title">海海拼图大作战</Text>
        <Text className="block home-subtitle">拖拽碎片，完成拼图</Text>

        {/* 游戏介绍 */}
        <View className="game-intro">
          <Text className="block intro-title">游戏介绍</Text>
          <View className="intro-list">
            <Text className="block intro-item">🎯 本游戏共有 10 个关卡</Text>
            <Text className="block intro-item">🎮 前 3 关：3×3 入门难度</Text>
            <Text className="block intro-item">🔥 4-6 关：4×4 进阶挑战</Text>
            <Text className="block intro-item">💥 7-9 关：5×5 高难度</Text>
            <Text className="block intro-item">🏆 第 10 关：6×6 终极挑战</Text>
            <Text className="block intro-item">⏱️ 每关限时 3 分钟</Text>
            <Text className="block intro-item highlight">🎁 全部通关有惊喜奖励！</Text>
          </View>
        </View>

        <Button className="home-button" onClick={handleStartGame}>
          开始游戏
        </Button>
      </View>
    </View>
  )
}

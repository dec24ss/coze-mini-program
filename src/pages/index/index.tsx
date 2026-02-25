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
          <Text className="block intro-text">
            本游戏共有10个关卡，每关限时3分钟，请善用屏幕下方提供的道具。全部通关有惊喜奖励！
          </Text>
        </View>

        <Button className="home-button" onClick={handleStartGame}>
          开始游戏
        </Button>
      </View>
    </View>
  )
}

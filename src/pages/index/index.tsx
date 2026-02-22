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
        <Text className="block home-title">拼图游戏</Text>
        <Text className="block home-subtitle">拖拽碎片，完成拼图</Text>
        <Button className="home-button" onClick={handleStartGame}>
          开始游戏
        </Button>
      </View>
    </View>
  )
}

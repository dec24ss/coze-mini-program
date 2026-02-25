import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.css'

export default function IndexPage() {
  const handleStartGame = () => {
    Taro.navigateTo({ url: '/pages/game/index' })
  }

  return (
    <View className="home-page">
      <View className="home-content">
        <Image
          className="home-logo"
          src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%B5%B7%E6%B5%B7%E6%8B%BC%E5%9B%BE%E5%A4%A7%E4%BD%9C%E6%88%98%E5%A4%B4%E5%83%8F%E8%AE%BE%E8%AE%A1.png&nonce=0c889e01-4493-4d37-86f9-fc95a37d2684&project_id=7609528567227056143&sign=615f9c20849a66301fe30fb66717d5d43cca3f0670241855ab0b386d98ac9eec"
          mode="aspectFit"
        />
        <Text className="block home-subtitle">拖拽碎片，完成拼图</Text>
        <Button className="home-button" onClick={handleStartGame}>
          开始游戏
        </Button>
      </View>
    </View>
  )
}

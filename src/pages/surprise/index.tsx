import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.css'

const SURPRISE_IMAGE_URL = 'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E5%A4%B8%E5%BC%A0%E5%90%90%E8%88%8C%E5%A4%B4%E9%AC%BC%E8%84%B8%E5%9B%BE%E8%AE%BE%E8%AE%A1_1.jpeg&nonce=9c155dc3-b9c4-4374-ae55-6af924fbee1d&project_id=7609528567227056143&sign=82ef0d5752f9236b56a7836e0edf580729407073a3bc369713d92db6a4772673'

export default function SurprisePage() {
  const handleBackHome = () => {
    Taro.reLaunch({ url: '/pages/index/index' })
  }

  const handleShare = () => {
    Taro.showToast({ title: '分享功能即将上线', icon: 'none' })
  }

  return (
    <View className="surprise-page">
      <View className="surprise-content">
        <Text className="block surprise-title">🎉 恭喜全通！</Text>

        {/* 惊喜图片 */}
        <View className="surprise-image-container">
          <Image
            className="surprise-image"
            src={SURPRISE_IMAGE_URL}
            mode="aspectFit"
          />
        </View>

        {/* 提示文字 */}
        <View className="surprise-message">
          <Text className="block message-title">你太厉害了！</Text>
          <Text className="block message-subtitle">
            你已经完成了所有10个关卡
          </Text>
          <Text className="block message-desc">
            真是拼图大师！
          </Text>
        </View>

        {/* 按钮组 */}
        <View className="surprise-buttons">
          <Button className="surprise-button primary" onClick={handleBackHome}>
            返回首页
          </Button>
          <Button className="surprise-button secondary" onClick={handleShare}>
            分享成就
          </Button>
        </View>
      </View>
    </View>
  )
}

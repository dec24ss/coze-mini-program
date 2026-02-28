import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import './index.css'

export default function RankPage() {
  const { userInfo, rankList, myRank, isLoggedIn, fetchRankList } = useUserStore()

  useEffect(() => {
    if (isLoggedIn) {
      fetchRankList()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const handleBack = () => {
    Taro.navigateBack()
  }

  if (!isLoggedIn) {
    return (
      <View className="rank-page">
        <View className="rank-empty">
          <Text className="block">请先登录</Text>
          <Button className="back-button" onClick={handleBack}>
            返回首页
          </Button>
        </View>
      </View>
    )
  }

  return (
    <View className="rank-page">
      <View className="rank-header">
        <Text className="block rank-title">排行榜</Text>
        {userInfo && (
          <View className="my-rank">
            <Text className="block my-rank-text">我的排名：第{myRank}名</Text>
            <Text className="block my-level">最高关卡：第{userInfo.highestLevel}关</Text>
          </View>
        )}
      </View>

      <View className="rank-list">
        <View className="rank-item header">
          <Text className="block rank-col">排名</Text>
          <Text className="block rank-col">用户</Text>
          <Text className="block rank-col">关卡</Text>
        </View>

        {rankList.map((item) => (
          <View
            key={item.openid}
            className={`rank-item ${item.openid === userInfo?.openid ? 'my-item' : ''}`}
          >
            <View className="rank-col rank-number">
              {item.rank <= 3 ? (
                <Text className={`block rank-badge rank-${item.rank}`}>
                  {item.rank}
                </Text>
              ) : (
                <Text className="block">{item.rank}</Text>
              )}
            </View>
            <View className="rank-col user-info">
              {item.avatarUrl ? (
                <Image className="user-avatar-small" src={item.avatarUrl} mode="aspectFill" />
              ) : (
                <View className="user-avatar-placeholder">
                  <Text className="block">{item.nickname.charAt(0)}</Text>
                </View>
              )}
              <Text className="block user-name">{item.nickname}</Text>
            </View>
            <Text className="block rank-col level-text">第{item.highestLevel}关</Text>
          </View>
        ))}
      </View>

      <View className="rank-footer">
        <Button className="back-button" onClick={handleBack}>
          返回首页
        </Button>
      </View>
    </View>
  )
}

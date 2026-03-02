import { View, Text, Image } from '@tarojs/components'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import './index.css'

export default function RankPage() {
  const { userInfo, rankList, isLoggedIn, fetchRankList } = useUserStore()
  const { initSettings } = useSettingsStore()

  useEffect(() => {
    if (isLoggedIn) {
      fetchRankList()
    }
    // 初始化设置
    initSettings()
    // 依赖登录状态变化时重新获取排行榜
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <View className="rank-page">
        <View className="rank-empty">
          <Text className="block empty-text">请先登录</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="rank-page">
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
              {/* 只显示自己的头像，其他用户使用占位符 */}
              {item.openid === userInfo?.openid && item.avatarUrl ? (
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

      <View className="rank-footer-hint">
        <Text className="block footer-hint-text">右滑屏幕返回首页</Text>
      </View>
    </View>
  )
}

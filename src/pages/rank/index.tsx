import { View, Text, Image } from '@tarojs/components'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore-supabase'
import { useSettingsStore } from '@/stores/settingsStore'
import './index.css'

// 判断头像URL是否有效
const isValidAvatarUrl = (url: string): boolean => {
  if (!url || url.trim() === '') {
    return false
  }

  // 过滤掉本地路径（wxfile://）
  if (url.startsWith('wxfile://') || url.startsWith('file://')) {
    return false
  }

  // 过滤掉空值或占位符
  if (url === '' || url === null || url === undefined) {
    return false
  }

  return true
}

// 获取有效的头像URL，如果无效则返回默认头像
const getAvatarUrl = (nickname: string, avatarUrl: string): string => {
  if (isValidAvatarUrl(avatarUrl)) {
    return avatarUrl
  }

  // 使用基于昵称的默认头像
  const seed = encodeURIComponent(nickname || 'default')
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

export default function RankPage() {
  const { userInfo, rankList, isLoggedIn, fetchRankList } = useUserStore()
  const { initSettings } = useSettingsStore()

  useEffect(() => {
    if (isLoggedIn) {
      fetchRankList().then(() => {
        // 调试：打印排行榜数据
        const currentRankList = useUserStore.getState().rankList
        console.log('排行榜数据:', currentRankList)
        currentRankList.forEach((item, index) => {
          console.log(`用户 ${index + 1}: 昵称=${item.nickname}, 原始头像URL=${item.avatarUrl}, 有效头像URL=${getAvatarUrl(item.nickname, item.avatarUrl)}`)
        })
      })
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
              {getAvatarUrl(item.nickname, item.avatarUrl) ? (
                <Image
                  className="user-avatar-small"
                  src={getAvatarUrl(item.nickname, item.avatarUrl)}
                  mode="aspectFill"
                />
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

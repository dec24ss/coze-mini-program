import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { useUserStoreCloudbase } from '@/stores/userStore-cloudbase'
import { useSettingsStore } from '@/stores/settingsStore'
import './index.css'

// 判断头像URL是否有效
const isValidAvatarUrl = (url: string | undefined | null): boolean => {
  if (!url || !url.trim()) {
    return false
  }

  // 过滤掉本地路径
  return !url.startsWith('wxfile://') && !url.startsWith('file://')
}

// 获取有效的头像URL，如果无效则返回默认头像
const getAvatarUrl = (nickname: string, avatarUrl: string | undefined): string => {
  if (isValidAvatarUrl(avatarUrl)) {
    return avatarUrl!
  }

  const seed = encodeURIComponent(nickname || 'default')
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`
}

export default function RankPage() {
  const { userInfo, rankList, isLoggedIn, fetchRankList } = useUserStoreCloudbase()
  const { initSettings } = useSettingsStore()
  const [refreshing, setRefreshing] = useState(false)

  const loadRankList = async (force = false) => {
    if (!isLoggedIn) return
    
    setRefreshing(true)
    try {
      await fetchRankList(force)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadRankList(true)
      initSettings()
    }
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
      <View className="rank-header">
        <Text className="block rank-title">排行榜</Text>
        <View 
          className="refresh-button" 
          onClick={() => loadRankList(true)}
        >
          <Text className="refresh-text">{refreshing ? '刷新中...' : '刷新'}</Text>
        </View>
      </View>
      
      <View className="rank-list">
        <View className="rank-item header">
          <Text className="block rank-col">排名</Text>
          <Text className="block rank-col">用户</Text>
          <Text className="block rank-col">关卡</Text>
        </View>

        {rankList.map((item) => {
          const avatarUrl = getAvatarUrl(item.nickname, item.avatarUrl)
          
          return (
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
                <Image
                  className="user-avatar-small"
                  src={avatarUrl}
                  mode="aspectFill"
                />
                <Text className="block user-name">{item.nickname}</Text>
              </View>
              <Text className="block rank-col level-text">第{item.highestLevel}关</Text>
            </View>
          )
        })}
      </View>

      <View className="rank-footer-hint">
        <Text className="block footer-hint-text">右滑屏幕返回首页</Text>
      </View>
    </View>
  )
}

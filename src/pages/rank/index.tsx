import { View, Text, Image } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { useUserStore } from '@/stores/userStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { Trophy } from 'lucide-react-taro/icons/trophy'
import { Medal } from 'lucide-react-taro/icons/medal'
import { Award } from 'lucide-react-taro/icons/award'
import './index.css'

export default function RankPage() {
  const { userInfo, rankList, isLoggedIn, fetchRankList } = useUserStore()
  const { initSettings } = useSettingsStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoggedIn) {
      setLoading(true)
      fetchRankList().finally(() => {
        setLoading(false)
      })
    }
    // 初始化设置
    initSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  if (!isLoggedIn) {
    return (
      <View className="rank-page">
        <View className="rank-empty">
          <Text className="block empty-text">请先登录查看排行榜</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="rank-page">
      {/* 页面标题 */}
      <View className="rank-header">
        <Trophy size={48} color="#FFD700" />
        <Text className="block rank-title">排行榜</Text>
      </View>

      {/* 加载状态 */}
      {loading && (
        <View className="rank-loading">
          <Text className="block loading-text">加载中...</Text>
        </View>
      )}

      {/* 排行榜列表 */}
      {!loading && (
        <View className="rank-list">
          {/* 前三名展示区 */}
          <View className="top-three">
            {/* 第二名 */}
            {rankList[1] && (
              <View className="top-item second">
                <Medal size={32} color="#C0C0C0" />
                <Text className="block top-rank">2</Text>
                {rankList[1].avatarUrl && (
                  <Image className="top-avatar" src={rankList[1].avatarUrl} mode="aspectFill" />
                )}
                <Text className="block top-name">{rankList[1].nickname}</Text>
                <Text className="block top-level">第{rankList[1].highestLevel}关</Text>
              </View>
            )}

            {/* 第一名 */}
            {rankList[0] && (
              <View className="top-item first">
                <Award size={40} color="#FFD700" />
                <Text className="block top-rank">1</Text>
                {rankList[0].avatarUrl && (
                  <Image className="top-avatar" src={rankList[0].avatarUrl} mode="aspectFill" />
                )}
                <Text className="block top-name">{rankList[0].nickname}</Text>
                <Text className="block top-level">第{rankList[0].highestLevel}关</Text>
              </View>
            )}

            {/* 第三名 */}
            {rankList[2] && (
              <View className="top-item third">
                <Medal size={32} color="#CD7F32" />
                <Text className="block top-rank">3</Text>
                {rankList[2].avatarUrl && (
                  <Image className="top-avatar" src={rankList[2].avatarUrl} mode="aspectFill" />
                )}
                <Text className="block top-name">{rankList[2].nickname}</Text>
                <Text className="block top-level">第{rankList[2].highestLevel}关</Text>
              </View>
            )}
          </View>

          {/* 其他排名列表 */}
          <View className="rank-list-container">
            {rankList.slice(3).map((item) => (
              <View
                key={item.openid}
                className={`rank-item ${item.openid === userInfo?.openid ? 'my-item' : ''}`}
              >
                <Text className="block rank-number">{item.rank}</Text>
                {item.avatarUrl ? (
                  <Image className="rank-avatar" src={item.avatarUrl} mode="aspectFill" />
                ) : (
                  <View className="rank-avatar-placeholder">
                    <Text className="block">{item.nickname.charAt(0)}</Text>
                  </View>
                )}
                <View className="rank-user-info">
                  <Text className="block user-nickname">{item.nickname}</Text>
                </View>
                <Text className="block rank-level">第{item.highestLevel}关</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* 底部提示 */}
      <View className="rank-footer">
        <Text className="block footer-text">右滑返回首页</Text>
      </View>
    </View>
  )
}

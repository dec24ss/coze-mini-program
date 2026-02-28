import { View, Text, Button, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect } from 'react'
import { useUserStore } from '@/stores/userStore'
import './index.css'

export default function IndexPage() {
  const { userInfo, isLoggedIn, isLoading, login, logout, checkUnlockedLevels } = useUserStore()

  useEffect(() => {
    // 检查已解锁的关卡
    checkUnlockedLevels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

  const handleStartGame = () => {
    Taro.navigateTo({ url: '/pages/game/index' })
  }

  const handleLevelSelect = () => {
    if (!isLoggedIn) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/level-select/index' })
  }

  const handleRankList = () => {
    if (!isLoggedIn) {
      Taro.showToast({ title: '请先登录', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/rank/index' })
  }

  const handleLogin = async () => {
    await login()
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
        }
      }
    })
  }

  return (
    <View className="home-page">
      <View className="home-content">
        <Text className="block home-title">海海拼图大作战</Text>
        <Text className="block home-subtitle">拖拽碎片，完成拼图</Text>

        {/* 用户信息区域 */}
        {isLoggedIn && userInfo ? (
          <View className="user-info">
            {userInfo.avatarUrl && (
              <Image className="user-avatar" src={userInfo.avatarUrl} mode="aspectFill" />
            )}
            <Text className="block user-name">{userInfo.nickname}</Text>
            <Text className="block user-level">最高关卡：第{userInfo.highestLevel}关</Text>
            <Button className="logout-button" onClick={handleLogout}>
              退出登录
            </Button>
          </View>
        ) : (
          <Button className="login-button" onClick={handleLogin} loading={isLoading}>
            微信登录
          </Button>
        )}

        {/* 功能按钮 */}
        <View className="button-group">
          <Button className="home-button primary" onClick={handleStartGame}>
            开始游戏
          </Button>
          <Button
            className={`home-button ${isLoggedIn ? '' : 'disabled'}`}
            onClick={handleLevelSelect}
          >
            关卡选择
            {!isLoggedIn && <Text className="block lock-hint">（需登录）</Text>}
          </Button>
          <Button
            className={`home-button ${isLoggedIn ? '' : 'disabled'}`}
            onClick={handleRankList}
          >
            排行榜
            {!isLoggedIn && <Text className="block lock-hint">（需登录）</Text>}
          </Button>
        </View>
      </View>
    </View>
  )
}

